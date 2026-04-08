import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

const ExamContext = createContext();

export function useExam() {
  return useContext(ExamContext);
}

export function ExamProvider({ children }) {
  const { user } = useContext(AuthContext);
  const [examSession, setExamSession] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [examResult, setExamResult] = useState(null);

  // Helper to get headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    };
  };

  const startExam = async (examType) => {
    try {
      const res = await axios.post('http://localhost:5000/api/exam/start', { examType, title: `${examType} Certification Test` }, getAuthHeaders());
      setExamSession(res.data);
      setExamResult(null);
      return res.data;
    } catch (err) {
      console.error('Error starting exam', err);
      throw err;
    }
  };

  const fetchQuestion = async (sessionId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/exam/question/${sessionId}`, getAuthHeaders());
      setCurrentQuestion(res.data);
      return res.data;
    } catch (err) {
      console.error('Error fetching question', err);
      throw err;
    }
  };

  const submitAnswer = async (sessionId, questionId, selectedOption) => {
    try {
      await axios.post('http://localhost:5000/api/exam/answer', {
        sessionId,
        questionId,
        selectedOption
      }, getAuthHeaders());
      // Fetch next question
      await fetchQuestion(sessionId);
    } catch (err) {
      // If no more questions, submit exam
      if (err.response && err.response.data.msg === 'All questions answered') {
        await submitExam(sessionId);
      } else {
        console.error('Error submitting answer', err);
        throw err;
      }
    }
  };

  const logViolation = async (sessionId, violationType, details = {}) => {
    try {
      await axios.post('http://localhost:5000/api/exam/monitor', {
        sessionId,
        violationType,
        details
      }, getAuthHeaders());
    } catch (err) {
      console.error('Error logging violation', err);
    }
  };

  const sendSnapshot = async (sessionId, image, violationType) => {
    try {
      await axios.post('http://localhost:5000/api/exam/snapshot', {
        sessionId,
        image,
        violationType
      }, getAuthHeaders());
    } catch (err) {
      console.error('Error sending snapshot', err);
    }
  };

  const submitExam = async (sessionId) => {
    try {
      const res = await axios.post('http://localhost:5000/api/exam/submit', { sessionId }, getAuthHeaders());
      setExamResult(res.data);
      setExamSession(null);
      setCurrentQuestion(null);
      return res.data;
    } catch (err) {
      console.error('Error submitting exam', err);
      throw err;
    }
  };

  return (
    <ExamContext.Provider value={{
      examSession,
      currentQuestion,
      examResult,
      startExam,
      fetchQuestion,
      submitAnswer,
      logViolation,
      sendSnapshot,
      submitExam
    }}>
      {children}
    </ExamContext.Provider>
  );
}
