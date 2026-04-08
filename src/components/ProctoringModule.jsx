import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from '@vladmandic/face-api';
import { useExam } from '../context/ExamContext';

export default function ProctoringModule() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const detectionIntervalRef = useRef(null);
  const isDetectingRef = useRef(false);
  const detectorOptionsRef = useRef(new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 }));
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const { examSession, logViolation, sendSnapshot } = useExam();

  const DETECTION_INTERVAL_MS = 300;
  const NO_FACE_THRESHOLD_MS = 6000;
  const MULTIPLE_FACES_THRESHOLD_MS = 4000;
  const LOOKING_AWAY_THRESHOLD_MS = 6000;

  // Internal state to avoid spamming violations
  const violationState = useRef({
    noFaceDurationMs: 0,
    multipleFaceDurationMs: 0,
    lookingAwayDurationMs: 0,
    lastSnapshotSent: 0
  });

  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = '/models';
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        setModelsLoaded(true);
      } catch (err) {
        console.error("Failed to load models:", err);
      }
    };
    loadModels();
  }, []);

  useEffect(() => {
    if (modelsLoaded && examSession && examSession.status === 'IN_PROGRESS') {
      startVideo();
    }

    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
        detectionIntervalRef.current = null;
      }
      isDetectingRef.current = false;

      // Cleanup video stream on unmount
      if (videoRef.current && videoRef.current.srcObject) {
        let tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [modelsLoaded, examSession]);

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 640 },
        height: { ideal: 360 },
        frameRate: { ideal: 24, max: 30 },
        facingMode: 'user'
      },
      audio: false
    })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error('Error accessing webcam', err);
        // Possible webcam block violation
      });
  };

  const captureSnapshot = (violationType) => {
    const now = Date.now();
    // Only send snapshot at most once every 5 seconds to prevent spam
    if (now - violationState.current.lastSnapshotSent < 5000) return;

    if (videoRef.current) {
      const snapshotCanvas = document.createElement('canvas');
      const context = snapshotCanvas.getContext('2d');
      snapshotCanvas.width = videoRef.current.videoWidth;
      snapshotCanvas.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, snapshotCanvas.width, snapshotCanvas.height);
      const imageBase64 = snapshotCanvas.toDataURL('image/jpeg', 0.5);
      sendSnapshot(examSession.sessionId, imageBase64, violationType);
      violationState.current.lastSnapshotSent = now;
    }
  };

  const drawDot = (ctx, x, y, color = '#22d3ee') => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, 2.8, 0, 2 * Math.PI);
    ctx.fill();
  };

  const drawOverlay = (detections) => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const width = video.videoWidth;
    const height = video.videoHeight;
    if (!width || !height) return;

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, width, height);

    detections.forEach((det) => {
      const box = det.detection.box;

      // Face bounding box
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(box.x, box.y, box.width, box.height);

      // Landmark dots: eyes, nose, mouth
      const landmarks = det.landmarks;
      const points = [
        ...landmarks.getLeftEye(),
        ...landmarks.getRightEye(),
        ...landmarks.getNose(),
        ...landmarks.getMouth()
      ];

      points.forEach((pt) => drawDot(ctx, pt.x, pt.y));
    });
  };

  const handleVideoPlay = () => {
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }

    violationState.current.noFaceDurationMs = 0;
    violationState.current.multipleFaceDurationMs = 0;
    violationState.current.lookingAwayDurationMs = 0;

    detectionIntervalRef.current = setInterval(async () => {
      if (isDetectingRef.current) return;

      if (videoRef.current && videoRef.current.readyState === 4 && examSession?.status === 'IN_PROGRESS') {
        isDetectingRef.current = true;
        try {
          const detections = await faceapi.detectAllFaces(
            videoRef.current,
            detectorOptionsRef.current
          ).withFaceLandmarks();

          drawOverlay(detections);
          analyzeDetections(detections, DETECTION_INTERVAL_MS);
        } catch (err) {
          console.error('Detection loop error:', err);
        } finally {
          isDetectingRef.current = false;
        }
      }
    }, DETECTION_INTERVAL_MS);
  };

  const analyzeDetections = (detections, elapsedMs) => {
    const state = violationState.current;

    // 1. NO_FACE Detection
    if (detections.length === 0) {
      state.noFaceDurationMs += elapsedMs;
      if (state.noFaceDurationMs >= NO_FACE_THRESHOLD_MS) {
        logViolation(examSession.sessionId, 'NO_FACE', { durationMs: state.noFaceDurationMs });
        captureSnapshot('NO_FACE');
        state.noFaceDurationMs = 0;
      }
      return; 
    } else {
      state.noFaceDurationMs = 0;
    }

    // 2. MULTIPLE_FACES Detection
    if (detections.length > 1) {
      state.multipleFaceDurationMs += elapsedMs;
      if (state.multipleFaceDurationMs >= MULTIPLE_FACES_THRESHOLD_MS) {
        logViolation(examSession.sessionId, 'MULTIPLE_FACES', { faces: detections.length });
        captureSnapshot('MULTIPLE_FACES');
        state.multipleFaceDurationMs = 0;
      }
      return;
    } else {
      state.multipleFaceDurationMs = 0;
    }

    // 3. LOOKING_AWAY Detection (Eye Tracking / Gaze)
    const landmarks = detections[0].landmarks;
    const nose = landmarks.getNose()[3]; // Tip of the nose
    const leftEye = landmarks.getLeftEye();
    const rightEye = landmarks.getRightEye();

    // Calculate center of eyes
    const leftEyeX = leftEye.reduce((sum, pt) => sum + pt.x, 0) / leftEye.length;
    const rightEyeX = rightEye.reduce((sum, pt) => sum + pt.x, 0) / rightEye.length;

    // Detect if nose is outside the horizontal boundary of the eyes (with a margin)
    const eyeDistance = rightEyeX - leftEyeX;
    const margin = eyeDistance * 0.2; // 20% margin
    
    const isLookingLeft = nose.x < (leftEyeX - margin);
    const isLookingRight = nose.x > (rightEyeX + margin);

    if (isLookingLeft || isLookingRight) {
      state.lookingAwayDurationMs += elapsedMs;
      if (state.lookingAwayDurationMs >= LOOKING_AWAY_THRESHOLD_MS) {
        logViolation(examSession.sessionId, 'LOOKING_AWAY', { direction: isLookingLeft ? 'LEFT' : 'RIGHT' });
        captureSnapshot('LOOKING_AWAY');
        state.lookingAwayDurationMs = 0;
      }
    } else {
      state.lookingAwayDurationMs = 0;
    }
  };

  if (!examSession || examSession.status !== 'IN_PROGRESS') return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-gray-900 border border-purple-500 rounded-lg shadow-xl overflow-hidden shadow-purple-500/20">
        <div className="px-2 py-1 bg-purple-900/50 text-xs text-center text-purple-200">
          Proctoring Active
        </div>
        <div className="relative w-48 h-36">
          {!modelsLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-sm text-gray-400">
              Loading AI...
            </div>
          )}
          <video
            ref={videoRef}
            autoPlay
            muted
            className="w-full h-full object-cover transform scale-x-[-1]"
            onPlay={handleVideoPlay}
          />
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none transform scale-x-[-1]"
          />
        </div>
      </div>
    </div>
  );
}
