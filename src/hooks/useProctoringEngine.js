import { useCallback, useMemo, useRef, useState } from 'react';

const STATUS = {
  NORMAL: 'NORMAL',
  SUSPICIOUS: 'SUSPICIOUS',
  CHEATING: 'CHEATING'
};

const DEFAULT_CONFIG = {
  windowMs: 25000,
  lowScorePersistMs: 5000,
  uiEmitIntervalMs: 250,
  smoothingAlpha: 0.25,
  maxDropPerSecond: 20,
  penalties: {
    noFace: 20,
    multipleFaces: 30,
    lookingAway: 10,
    speaking: 15,
    tabSwitch: 25
  }
};

const DEFAULT_BEHAVIOR = {
  faceDetected: true,
  multipleFaces: false,
  gaze: 'CENTER',
  audioSpeaking: false,
  tabSwitched: false,
  timestamp: 0
};

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const resolveStatus = (score) => {
  if (score > 70) return STATUS.NORMAL;
  if (score >= 40) return STATUS.SUSPICIOUS;
  return STATUS.CHEATING;
};

const mergeBehavior = (next) => ({
  ...DEFAULT_BEHAVIOR,
  ...next,
  gaze: next?.gaze || 'CENTER',
  timestamp: next?.timestamp || Date.now()
});

const scoreBehavior = (entry, penalties) => {
  let score = 100;

  if (!entry.faceDetected) score -= penalties.noFace;
  if (entry.multipleFaces) score -= penalties.multipleFaces;
  if (entry.gaze !== 'CENTER') score -= penalties.lookingAway;
  if (entry.audioSpeaking) score -= penalties.speaking;
  if (entry.tabSwitched) score -= penalties.tabSwitch;

  return clamp(score, 0, 100);
};

export function useProctoringEngine(sessionId, options = {}) {
  const config = useMemo(() => ({
    ...DEFAULT_CONFIG,
    ...options,
    penalties: {
      ...DEFAULT_CONFIG.penalties,
      ...(options.penalties || {})
    }
  }), [options]);

  const historyRef = useRef([]);
  const emaScoreRef = useRef(100);
  const lowScoreStartRef = useRef(null);
  const lowScoreViolationFiredRef = useRef(false);
  const lastUiEmitRef = useRef(0);
  const lastSmoothingTsRef = useRef(0);

  const [uiState, setUiState] = useState({
    attentionScore: 100,
    status: STATUS.NORMAL,
    lowScoreDurationMs: 0,
    sampleCount: 0,
    sessionId
  });

  const emitUiState = useCallback((nextState, force = false) => {
    const now = Date.now();
    if (!force && now - lastUiEmitRef.current < config.uiEmitIntervalMs) return;

    setUiState((prev) => {
      const scoreDelta = Math.abs(prev.attentionScore - nextState.attentionScore);
      const shouldUpdate =
        force ||
        prev.status !== nextState.status ||
        scoreDelta >= 1 ||
        prev.lowScoreDurationMs !== nextState.lowScoreDurationMs ||
        prev.sampleCount !== nextState.sampleCount ||
        prev.sessionId !== sessionId;

      if (!shouldUpdate) return prev;
      lastUiEmitRef.current = now;
      return nextState;
    });
  }, [config.uiEmitIntervalMs, sessionId]);

  const trimHistory = useCallback((nowTs) => {
    const cutoff = nowTs - config.windowMs;
    historyRef.current = historyRef.current.filter((entry) => entry.timestamp >= cutoff);
  }, [config.windowMs]);

  const smoothScore = useCallback((windowAverage, nowTs) => {
    if (lastSmoothingTsRef.current === 0) {
      lastSmoothingTsRef.current = nowTs;
      emaScoreRef.current = windowAverage;
      return emaScoreRef.current;
    }

    const elapsedMs = nowTs - lastSmoothingTsRef.current;
    lastSmoothingTsRef.current = nowTs;

    const dropLimit = (config.maxDropPerSecond * elapsedMs) / 1000;
    const projected =
      config.smoothingAlpha * windowAverage +
      (1 - config.smoothingAlpha) * emaScoreRef.current;

    const minAllowed = emaScoreRef.current - dropLimit;
    const boundedProjected = Math.max(projected, minAllowed);

    emaScoreRef.current = clamp(boundedProjected, 0, 100);
    return emaScoreRef.current;
  }, [config.maxDropPerSecond, config.smoothingAlpha]);

  const ingestBehavior = useCallback((behaviorInput) => {
    if (!sessionId) {
      return {
        attentionScore: uiState.attentionScore,
        status: uiState.status,
        violationTriggered: false,
        lowScoreDurationMs: uiState.lowScoreDurationMs
      };
    }

    const entry = mergeBehavior(behaviorInput);
    const rawScore = scoreBehavior(entry, config.penalties);
    historyRef.current.push({ ...entry, rawScore });
    trimHistory(entry.timestamp);

    const windowAverage = historyRef.current.length
      ? historyRef.current.reduce((sum, item) => sum + item.rawScore, 0) / historyRef.current.length
      : 100;

    const smoothedScore = smoothScore(windowAverage, entry.timestamp);
    const roundedScore = Math.round(smoothedScore);
    const status = resolveStatus(roundedScore);

    let lowScoreDurationMs = 0;
    let violationTriggered = false;

    if (status === STATUS.NORMAL) {
      lowScoreStartRef.current = null;
      lowScoreViolationFiredRef.current = false;
    } else {
      if (!lowScoreStartRef.current) lowScoreStartRef.current = entry.timestamp;
      lowScoreDurationMs = entry.timestamp - lowScoreStartRef.current;

      if (
        lowScoreDurationMs >= config.lowScorePersistMs &&
        !lowScoreViolationFiredRef.current
      ) {
        lowScoreViolationFiredRef.current = true;
        violationTriggered = true;
      }
    }

    const nextUiState = {
      attentionScore: roundedScore,
      status,
      lowScoreDurationMs,
      sampleCount: historyRef.current.length,
      sessionId
    };

    emitUiState(nextUiState);

    if (violationTriggered && typeof options.onViolation === 'function') {
      options.onViolation({
        sessionId,
        attentionScore: roundedScore,
        status,
        lowScoreDurationMs,
        timestamp: entry.timestamp,
        latestSignal: entry
      });
    }

    if (typeof options.onUpdate === 'function') {
      options.onUpdate({
        sessionId,
        attentionScore: roundedScore,
        status,
        lowScoreDurationMs,
        timestamp: entry.timestamp
      });
    }

    return {
      attentionScore: roundedScore,
      status,
      violationTriggered,
      lowScoreDurationMs,
      windowAverage: Math.round(windowAverage)
    };
  }, [
    config.lowScorePersistMs,
    config.penalties,
    emitUiState,
    options,
    sessionId,
    smoothScore,
    trimHistory,
    uiState.attentionScore,
    uiState.lowScoreDurationMs,
    uiState.status
  ]);

  const resetEngine = useCallback(() => {
    historyRef.current = [];
    emaScoreRef.current = 100;
    lowScoreStartRef.current = null;
    lowScoreViolationFiredRef.current = false;
    lastUiEmitRef.current = 0;
    lastSmoothingTsRef.current = 0;

    emitUiState({
      attentionScore: 100,
      status: STATUS.NORMAL,
      lowScoreDurationMs: 0,
      sampleCount: 0,
      sessionId
    }, true);
  }, [emitUiState, sessionId]);

  const getEngineSnapshot = useCallback(() => ({
    attentionScore: uiState.attentionScore,
    status: uiState.status,
    lowScoreDurationMs: uiState.lowScoreDurationMs,
    sampleCount: uiState.sampleCount,
    sessionId,
    history: historyRef.current
  }), [sessionId, uiState.attentionScore, uiState.lowScoreDurationMs, uiState.sampleCount, uiState.status]);

  return {
    attentionScore: uiState.attentionScore,
    status: uiState.status,
    lowScoreDurationMs: uiState.lowScoreDurationMs,
    sampleCount: uiState.sampleCount,
    ingestBehavior,
    resetEngine,
    getEngineSnapshot,
    STATUS
  };
}

export default useProctoringEngine;
