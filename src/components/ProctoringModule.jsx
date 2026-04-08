import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from '@vladmandic/face-api';
import { useExam } from '../context/ExamContext';
import useAudioProctoring from '../hooks/useAudioProctoring';
import useGazeTracking from '../hooks/useGazeTracking';
import useProctoringEngine from '../hooks/useProctoringEngine';

export default function ProctoringModule() {
  const detectionIntervalRef = useRef(null);
  const isDetectingRef = useRef(false);
  const faceCanvasRef = useRef(null);
  const liveSignalsRef = useRef({
    gazeDirection: 'CENTER',
    isSpeaking: false,
    faceBounds: null
  });
  const detectorOptionsRef = useRef(new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.3 }));
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [isFacePresent, setIsFacePresent] = useState(false);
  const { examSession, logViolation, sendSnapshot } = useExam();
  const sessionId = examSession?.sessionId;
  const { noiseLevel, isSpeaking } = useAudioProctoring(sessionId);
  const { gazeDirection, gazeStabilityScore, faceBounds, videoRef, canvasRef } = useGazeTracking(sessionId, {
    drawOverlay: true,
    mirrorPreview: true,
    directionHysteresis: 0.04,
    suppressViolationLogging: true
  });
  const { attentionScore, status, ingestBehavior } = useProctoringEngine(sessionId);

  useEffect(() => {
    liveSignalsRef.current = {
      gazeDirection,
      isSpeaking,
      faceBounds
    };
  }, [gazeDirection, isSpeaking, faceBounds]);

  const DETECTION_INTERVAL_MS = 300;
  const NO_FACE_THRESHOLD_MS = 4000;
  const MULTIPLE_FACES_THRESHOLD_MS = 4000;
  const ATTENTION_VIOLATION_COOLDOWN_MS = 5000;
  const LOOKING_AWAY_PERSIST_MS = 3000;

  // Internal state to avoid spamming violations
  const violationState = useRef({
    noFaceDurationMs: 0,
    multipleFaceDurationMs: 0,
    lookingAwayDurationMs: 0,
    lookingAwayDirection: null,
    lastAttentionViolationTs: 0,
    lastLookingAwayViolationTs: 0,
    lastSnapshotSent: 0
  });

  useEffect(() => {
    const loadModels = async () => {
      try {
        const MODEL_URL = '/models';
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        setModelsLoaded(true);
      } catch (err) {
        console.error("Failed to load models:", err);
      }
    };
    loadModels();
  }, []);

  useEffect(() => {
    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
        detectionIntervalRef.current = null;
      }
      isDetectingRef.current = false;
    };
  }, []);

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

  const drawFaceBox = (detections, fallbackBounds = null) => {
    const canvas = faceCanvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const width = video.videoWidth;
    const height = video.videoHeight;
    if (!width || !height) return;

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, width, height);

    const validBoxes = detections
      .map((det) => det?.detection?.box || det?.box)
      .filter(
        (box) =>
          box &&
          typeof box.x === 'number' &&
          typeof box.y === 'number' &&
          typeof box.width === 'number' &&
          typeof box.height === 'number'
      );

    if (validBoxes.length) {
      validBoxes.forEach((box) => {
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = 'rgba(34, 197, 94, 0.6)';
        ctx.shadowBlur = 8;
        ctx.strokeRect(box.x, box.y, box.width, box.height);
        ctx.shadowBlur = 0;
      });
      return;
    }

    if (fallbackBounds) {
      const x = fallbackBounds.x * width;
      const y = fallbackBounds.y * height;
      const w = fallbackBounds.width * width;
      const h = fallbackBounds.height * height;
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = 'rgba(34, 197, 94, 0.6)';
      ctx.shadowBlur = 8;
      ctx.strokeRect(x, y, w, h);
      ctx.shadowBlur = 0;
      return;
    }

    return;
  };

  const handleVideoPlay = () => {
    if (!modelsLoaded) return;

    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }

    violationState.current.noFaceDurationMs = 0;
    violationState.current.multipleFaceDurationMs = 0;

    detectionIntervalRef.current = setInterval(async () => {
      if (isDetectingRef.current) return;

      if (videoRef.current && videoRef.current.readyState === 4 && examSession?.status === 'IN_PROGRESS') {
        isDetectingRef.current = true;
        try {
          const detections = await faceapi.detectAllFaces(videoRef.current, detectorOptionsRef.current);
          const signals = liveSignalsRef.current;
          drawFaceBox(detections, signals.faceBounds);
          analyzeDetections(detections, DETECTION_INTERVAL_MS, signals);
        } catch (err) {
          console.error('Detection loop error:', err);
          const signals = liveSignalsRef.current;
          drawFaceBox([], signals.faceBounds);
        } finally {
          isDetectingRef.current = false;
        }
      }
    }, DETECTION_INTERVAL_MS);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!modelsLoaded || !video || examSession?.status !== 'IN_PROGRESS') return;

    // If video is already playing when models finish loading, start detection immediately.
    if (video.readyState >= 2) {
      handleVideoPlay();
      return;
    }

    const onLoadedData = () => handleVideoPlay();
    video.addEventListener('loadeddata', onLoadedData);
    return () => video.removeEventListener('loadeddata', onLoadedData);
  }, [modelsLoaded, examSession?.status]);

  const analyzeDetections = (detections, elapsedMs, signals) => {
    const state = violationState.current;
    const faceDetectedByApi = detections.length > 0;
    const multipleFaces = detections.length > 1;
    const meshFaceDetected = Boolean(signals?.faceBounds);
    const hasFaceForGaze = faceDetectedByApi || meshFaceDetected;
    const faceDetected = hasFaceForGaze;

    setIsFacePresent((prev) => (prev === hasFaceForGaze ? prev : hasFaceForGaze));

    const engineResult = ingestBehavior({
      faceDetected,
      multipleFaces,
      gaze: hasFaceForGaze ? signals?.gazeDirection || 'CENTER' : 'CENTER',
      audioSpeaking: Boolean(signals?.isSpeaking),
      tabSwitched: false,
      timestamp: Date.now()
    });

    if (engineResult?.violationTriggered && sessionId) {
      const now = Date.now();
      if (now - state.lastAttentionViolationTs >= ATTENTION_VIOLATION_COOLDOWN_MS) {
        state.lastAttentionViolationTs = now;
        logViolation(sessionId, 'LOW_ATTENTION_SCORE', {
          attentionScore: engineResult.attentionScore,
          status: engineResult.status,
          lowScoreDurationMs: engineResult.lowScoreDurationMs
        });
      }
    }

    // 1. NO_FACE Detection
    if (!faceDetected) {
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
    if (multipleFaces) {
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

    // 3. LOOKING_AWAY Detection (centralized via unified engine)
    const liveGazeDirection = signals?.gazeDirection || 'CENTER';
    if (hasFaceForGaze && liveGazeDirection !== 'CENTER') {
      if (state.lookingAwayDirection !== liveGazeDirection) {
        state.lookingAwayDirection = liveGazeDirection;
        state.lookingAwayDurationMs = 0;
      }
      state.lookingAwayDurationMs += elapsedMs;
      
      const now = Date.now();
      const canTrigger = now - state.lastLookingAwayViolationTs >= ATTENTION_VIOLATION_COOLDOWN_MS;
      
      if (state.lookingAwayDurationMs >= LOOKING_AWAY_PERSIST_MS && canTrigger && sessionId) {
        state.lastLookingAwayViolationTs = now;
        logViolation(sessionId, 'LOOKING_AWAY', {
          direction: liveGazeDirection,
          duration: state.lookingAwayDurationMs
        });
      }
    } else {
      state.lookingAwayDirection = null;
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
        <div className="px-2 py-1 bg-gray-800/80 border-y border-gray-700 text-[10px] text-gray-200 flex items-center justify-between">
          <span>Audio: {isSpeaking ? 'Speaking' : 'Quiet'}</span>
          <span>Level: {noiseLevel}</span>
        </div>
        <div className="px-2 py-1 bg-gray-800/80 border-b border-gray-700 text-[10px] text-gray-200 flex items-center justify-between">
          <span>Gaze: {isFacePresent ? gazeDirection : 'NO_FACE'}</span>
          <span>Stability: {gazeStabilityScore}</span>
        </div>
        <div className="px-2 py-1 bg-gray-800/80 border-b border-gray-700 text-[10px] text-gray-200 flex items-center justify-between">
          <span>Attention: {status}</span>
          <span>Score: {attentionScore}</span>
        </div>
        <div className="relative w-48 h-36">
          {!modelsLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 text-sm text-gray-400">
              Loading AI Models...
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
            style={{ zIndex: 10 }}
          />
          <canvas
            ref={faceCanvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none transform scale-x-[-1]"
            style={{ zIndex: 20 }}
          />
        </div>
      </div>
    </div>
  );
}
