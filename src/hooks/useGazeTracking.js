import { useEffect, useRef, useState } from 'react';
import { FaceMesh } from '@mediapipe/face_mesh';
import { useExam } from '../context/ExamContext';

const LOOP_INTERVAL_MS = 100; // ~10 FPS processing cadence with overlap guard
const LOOK_AWAY_PERSIST_MS = 3000;
const VIOLATION_COOLDOWN_MS = 5000;
const HISTORY_WINDOW_MS = 15000;
const RATIO_SMOOTHING_SAMPLES = 8;

const GAZE = {
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
  CENTER: 'CENTER'
};

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const avgPoint = (landmarks, indices) => {
  let x = 0;
  let y = 0;
  for (let i = 0; i < indices.length; i += 1) {
    const pt = landmarks[indices[i]];
    x += pt.x;
    y += pt.y;
  }
  return { x: x / indices.length, y: y / indices.length };
};

const drawDot = (ctx, x, y, color = '#22d3ee') => {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, 2.5, 0, Math.PI * 2);
  ctx.fill();
};

export default function useGazeTracking(sessionId, options = {}) {
  const {
    drawOverlay = true,
    leftThreshold = 0.35,
    rightThreshold = 0.65,
    suppressViolationLogging = false
  } = options;

  const { logViolation } = useExam();

  const [gazeDirection, setGazeDirection] = useState(GAZE.CENTER);
  const [gazeStabilityScore, setGazeStabilityScore] = useState(100);
  const [faceBounds, setFaceBounds] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const streamRef = useRef(null);
  const faceMeshRef = useRef(null);
  const rafRef = useRef(null);
  const inFlightRef = useRef(false);
  const lastProcessedTsRef = useRef(0);

  const smoothRatiosRef = useRef([]);
  const historyRef = useRef([]);

  const currentDirectionRef = useRef(GAZE.CENTER);
  const awayStartTsRef = useRef(null);
  const awayDirectionRef = useRef(null);
  const lastViolationTsRef = useRef(0);

  const uiDirectionRef = useRef(GAZE.CENTER);
  const uiStabilityRef = useRef(100);
  const uiFaceBoundsRef = useRef(null);

  const maybeEmitFaceBounds = (nextBounds) => {
    const prev = uiFaceBoundsRef.current;
    if (!prev && !nextBounds) return;

    if (!prev || !nextBounds) {
      uiFaceBoundsRef.current = nextBounds;
      setFaceBounds(nextBounds);
      return;
    }

    const epsilon = 0.003;
    const changed =
      Math.abs(prev.x - nextBounds.x) > epsilon ||
      Math.abs(prev.y - nextBounds.y) > epsilon ||
      Math.abs(prev.width - nextBounds.width) > epsilon ||
      Math.abs(prev.height - nextBounds.height) > epsilon;

    if (changed) {
      uiFaceBoundsRef.current = nextBounds;
      setFaceBounds(nextBounds);
    }
  };

  const cleanupMedia = async () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    if (faceMeshRef.current) {
      await faceMeshRef.current.close();
      faceMeshRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    inFlightRef.current = false;
  };

  const classifyDirection = (ratio) => {
    if (ratio < leftThreshold) return GAZE.LEFT;
    if (ratio > rightThreshold) return GAZE.RIGHT;
    return GAZE.CENTER;
  };

  const pushHistory = (entryTs, direction) => {
    historyRef.current.push({ timestamp: entryTs, direction });
    const cutoff = entryTs - HISTORY_WINDOW_MS;
    historyRef.current = historyRef.current.filter((item) => item.timestamp >= cutoff);
  };

  const computeStability = () => {
    if (!historyRef.current.length) return 100;
    const centerCount = historyRef.current.reduce(
      (sum, item) => sum + (item.direction === GAZE.CENTER ? 1 : 0),
      0
    );
    return Math.round((centerCount / historyRef.current.length) * 100);
  };

  const maybeEmitUi = (direction, stability) => {
    if (direction !== uiDirectionRef.current) {
      uiDirectionRef.current = direction;
      setGazeDirection(direction);
    }

    if (stability !== uiStabilityRef.current) {
      uiStabilityRef.current = stability;
      setGazeStabilityScore(stability);
    }
  };

  const drawTrackingOverlay = (landmarks, directionLabel) => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || !drawOverlay) return;

    const width = video.videoWidth;
    const height = video.videoHeight;
    if (!width || !height) return;

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, width, height);

    const leftIris = avgPoint(landmarks, [468, 469, 470, 471]);
    const rightIris = avgPoint(landmarks, [473, 474, 475, 476]);

    drawDot(ctx, leftIris.x * width, leftIris.y * height, '#22d3ee');
    drawDot(ctx, rightIris.x * width, rightIris.y * height, '#22d3ee');

    ctx.fillStyle = '#a855f7';
    ctx.font = '12px sans-serif';
    ctx.fillText(`Gaze: ${directionLabel}`, 8, 16);
  };

  const processResults = (results, nowTs) => {
    const faceLandmarks = results.multiFaceLandmarks;
    if (!faceLandmarks || !faceLandmarks.length) {
      maybeEmitFaceBounds(null);
      currentDirectionRef.current = GAZE.CENTER;
      awayStartTsRef.current = null;
      awayDirectionRef.current = null;
      pushHistory(nowTs, GAZE.CENTER);
      const stability = computeStability();
      maybeEmitUi(GAZE.CENTER, stability);
      return;
    }

    const landmarks = faceLandmarks[0];

    // Build normalized face bounds from mesh landmarks for a reliable fallback box.
    let minX = 1;
    let minY = 1;
    let maxX = 0;
    let maxY = 0;
    for (let i = 0; i < landmarks.length; i += 1) {
      const pt = landmarks[i];
      if (pt.x < minX) minX = pt.x;
      if (pt.y < minY) minY = pt.y;
      if (pt.x > maxX) maxX = pt.x;
      if (pt.y > maxY) maxY = pt.y;
    }
    const pad = 0.04;
    const bounds = {
      x: clamp(minX - pad, 0, 1),
      y: clamp(minY - pad, 0, 1),
      width: clamp(maxX - minX + pad * 2, 0, 1),
      height: clamp(maxY - minY + pad * 2, 0, 1)
    };
    maybeEmitFaceBounds(bounds);

    // Eye region boundaries and iris centers.
    const leftEyeCorners = [landmarks[33], landmarks[133]];
    const rightEyeCorners = [landmarks[362], landmarks[263]];

    const leftIris = avgPoint(landmarks, [468, 469, 470, 471]);
    const rightIris = avgPoint(landmarks, [473, 474, 475, 476]);

    const leftEyeLeftX = Math.min(leftEyeCorners[0].x, leftEyeCorners[1].x);
    const leftEyeRightX = Math.max(leftEyeCorners[0].x, leftEyeCorners[1].x);
    const rightEyeLeftX = Math.min(rightEyeCorners[0].x, rightEyeCorners[1].x);
    const rightEyeRightX = Math.max(rightEyeCorners[0].x, rightEyeCorners[1].x);

    const leftRatio = clamp(
      (leftIris.x - leftEyeLeftX) / Math.max(1e-6, leftEyeRightX - leftEyeLeftX),
      0,
      1
    );

    const rightRatio = clamp(
      (rightIris.x - rightEyeLeftX) / Math.max(1e-6, rightEyeRightX - rightEyeLeftX),
      0,
      1
    );

    const rawRatio = (leftRatio + rightRatio) / 2;

    // Moving-average smoothing for less jitter.
    smoothRatiosRef.current.push(rawRatio);
    if (smoothRatiosRef.current.length > RATIO_SMOOTHING_SAMPLES) {
      smoothRatiosRef.current.shift();
    }
    const smoothedRatio =
      smoothRatiosRef.current.reduce((sum, value) => sum + value, 0) /
      smoothRatiosRef.current.length;

    const direction = classifyDirection(smoothedRatio);
    currentDirectionRef.current = direction;

    pushHistory(nowTs, direction);

    if (direction === GAZE.CENTER) {
      awayStartTsRef.current = null;
      awayDirectionRef.current = null;
    } else {
      if (awayDirectionRef.current !== direction) {
        awayDirectionRef.current = direction;
        awayStartTsRef.current = nowTs;
      }

      const awayDuration = nowTs - (awayStartTsRef.current || nowTs);
      const onCooldown = nowTs - lastViolationTsRef.current < VIOLATION_COOLDOWN_MS;

      if (awayDuration >= LOOK_AWAY_PERSIST_MS && !onCooldown && sessionId && !suppressViolationLogging) {
        lastViolationTsRef.current = nowTs;
        logViolation(sessionId, 'LOOKING_AWAY', {
          direction,
          duration: awayDuration,
          ratio: Number(smoothedRatio.toFixed(3))
        });
      }
    }

    const stability = computeStability();
    maybeEmitUi(direction, stability);
    drawTrackingOverlay(landmarks, direction);
  };

  useEffect(() => {
    if (!sessionId) return undefined;

    let mounted = true;

    const start = async () => {
      try {
        streamRef.current = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 360 },
            frameRate: { ideal: 24, max: 30 },
            facingMode: 'user'
          },
          audio: false
        });

        if (!mounted) return;

        if (videoRef.current) {
          videoRef.current.srcObject = streamRef.current;
          await videoRef.current.play();
        }

        const faceMesh = new FaceMesh({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
        });

        faceMesh.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        });

        faceMesh.onResults((results) => {
          const nowTs = Date.now();
          processResults(results, nowTs);
          inFlightRef.current = false;
        });

        faceMeshRef.current = faceMesh;

        const tick = async () => {
          if (!mounted) return;

          rafRef.current = requestAnimationFrame(tick);

          const now = Date.now();
          if (now - lastProcessedTsRef.current < LOOP_INTERVAL_MS) return;
          if (!videoRef.current || videoRef.current.readyState < 2) return;
          if (inFlightRef.current || !faceMeshRef.current) return;

          inFlightRef.current = true;
          lastProcessedTsRef.current = now;

          try {
            await faceMeshRef.current.send({ image: videoRef.current });
          } catch (err) {
            inFlightRef.current = false;
            console.error('FaceMesh inference error:', err);
          }
        };

        rafRef.current = requestAnimationFrame(tick);
      } catch (err) {
        console.error('Gaze tracking initialization failed:', err);
      }
    };

    start();

    return () => {
      mounted = false;
      cleanupMedia();
      smoothRatiosRef.current = [];
      historyRef.current = [];
      awayStartTsRef.current = null;
      awayDirectionRef.current = null;
      lastViolationTsRef.current = 0;
      lastProcessedTsRef.current = 0;
      maybeEmitUi(GAZE.CENTER, 100);
      maybeEmitFaceBounds(null);

      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };
  }, [drawOverlay, logViolation, sessionId, leftThreshold, rightThreshold]);

  return {
    gazeDirection,
    gazeStabilityScore,
    faceBounds,
    videoRef,
    canvasRef,
    GAZE
  };
}
