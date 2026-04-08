import { useEffect, useRef, useState } from 'react';
import { useExam } from '../context/ExamContext';

const POLL_INTERVAL_MS = 250;
const ROLLING_WINDOW_MS = 3000;
const CALIBRATION_MS = 2000;
const SPEECH_PERSIST_MS = 3000;
const TRIGGER_COOLDOWN_MS = 5000;
const SPEECH_DEBOUNCE_FRAMES = 2;

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const calculateRms = (samples) => {
  let sumSquares = 0;
  for (let i = 0; i < samples.length; i += 1) {
    const sample = samples[i];
    sumSquares += sample * sample;
  }
  return Math.sqrt(sumSquares / samples.length);
};

const average = (arr) => {
  if (!arr.length) return 0;
  return arr.reduce((sum, value) => sum + value, 0) / arr.length;
};

// Reusable audio proctoring hook (Web Audio API only)
export default function useAudioProctoring(sessionId) {
  const { logViolation } = useExam();

  const [noiseLevel, setNoiseLevel] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);

  const rollingRef = useRef([]);
  const calibrationSamplesRef = useRef([]);
  const thresholdsRef = useRef({
    silence: 0.008,
    speech: 0.02
  });

  const calibrationEndTsRef = useRef(0);
  const speechStartTsRef = useRef(null);
  const speechStreakRef = useRef(0);
  const lastTriggerTsRef = useRef(0);

  const uiNoiseLevelRef = useRef(0);
  const uiSpeakingRef = useRef(false);

  useEffect(() => {
    if (!sessionId) return undefined;

    let cancelled = false;

    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;

        const audioContext = new window.AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();

        analyser.fftSize = 1024;
        analyser.smoothingTimeConstant = 0.75;

        source.connect(analyser);

        audioContextRef.current = audioContext;
        sourceRef.current = source;
        analyserRef.current = analyser;

        calibrationEndTsRef.current = Date.now() + CALIBRATION_MS;

        const domainBuffer = new Float32Array(analyser.fftSize);
        const maxRollingSamples = Math.max(1, Math.ceil(ROLLING_WINDOW_MS / POLL_INTERVAL_MS));

        intervalRef.current = setInterval(() => {
          if (!analyserRef.current || !sessionId) return;

          analyserRef.current.getFloatTimeDomainData(domainBuffer);
          const rms = calculateRms(domainBuffer);
          const now = Date.now();

          // Initial environment calibration to adapt to room noise.
          if (now <= calibrationEndTsRef.current) {
            calibrationSamplesRef.current.push(rms);
          } else if (calibrationSamplesRef.current.length > 0) {
            const baseline = average(calibrationSamplesRef.current);
            const silence = Math.max(0.005, baseline * 1.8);
            const speech = Math.max(silence + 0.005, baseline * 3.2, 0.015);
            thresholdsRef.current = { silence, speech };
            calibrationSamplesRef.current = [];
          }

          rollingRef.current.push(rms);
          if (rollingRef.current.length > maxRollingSamples) {
            rollingRef.current.shift();
          }

          const smoothedRms = average(rollingRef.current);
          const { silence, speech } = thresholdsRef.current;

          let classification = 'BACKGROUND_NOISE';
          if (smoothedRms < silence) classification = 'SILENCE';
          if (smoothedRms >= speech) classification = 'SPEECH';

          if (classification === 'SPEECH') {
            speechStreakRef.current += 1;
          } else {
            speechStreakRef.current = 0;
            speechStartTsRef.current = null;
          }

          const stableSpeech = speechStreakRef.current >= SPEECH_DEBOUNCE_FRAMES;
          if (stableSpeech && !speechStartTsRef.current) {
            speechStartTsRef.current = now;
          }

          const speechDuration = speechStartTsRef.current ? now - speechStartTsRef.current : 0;
          const speaking = stableSpeech && speechDuration > 0;

          // Normalize smoothed RMS to a 0-100 UI scale.
          const maxExpected = speech * 2.5;
          const normalized = clamp((smoothedRms / maxExpected) * 100, 0, 100);
          const roundedLevel = Math.round(normalized);

          if (roundedLevel !== uiNoiseLevelRef.current) {
            uiNoiseLevelRef.current = roundedLevel;
            setNoiseLevel(roundedLevel);
          }

          if (speaking !== uiSpeakingRef.current) {
            uiSpeakingRef.current = speaking;
            setIsSpeaking(speaking);
          }

          const canTrigger = now - lastTriggerTsRef.current >= TRIGGER_COOLDOWN_MS;
          if (speaking && speechDuration >= SPEECH_PERSIST_MS && canTrigger) {
            lastTriggerTsRef.current = now;

            logViolation(sessionId, 'AUDIO_SPEECH_DETECTED', {
              level: roundedLevel,
              duration: speechDuration,
              rms: Number(smoothedRms.toFixed(5)),
              classification
            });
          }
        }, POLL_INTERVAL_MS);
      } catch (err) {
        console.error('Audio proctoring initialization failed:', err);
      }
    };

    start();

    return () => {
      cancelled = true;

      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }

      if (sourceRef.current) {
        sourceRef.current.disconnect();
        sourceRef.current = null;
      }

      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
        audioContextRef.current = null;
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

      analyserRef.current = null;
      rollingRef.current = [];
      calibrationSamplesRef.current = [];
      speechStartTsRef.current = null;
      speechStreakRef.current = 0;
      lastTriggerTsRef.current = 0;
      uiNoiseLevelRef.current = 0;
      uiSpeakingRef.current = false;
      setNoiseLevel(0);
      setIsSpeaking(false);
    };
  }, [logViolation, sessionId]);

  return {
    noiseLevel,
    isSpeaking
  };
}
