import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import AllLabsPage from './pages/AllLabsPage'
import LinearRegressionLabPage from './pages/LinearRegressionLabPage'
import MatrixMultiplicationLabPage from './pages/MatrixMultiplicationLabPage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import CertificationsSelectionPage from './pages/CertificationsSelectionPage'
import ExamPage from './pages/ExamPage'
import AdminDashboard from './pages/AdminDashboard'
import FeaturesPage from './pages/FeaturesPage'
import ExamLobbyPage from './pages/ExamLobbyPage'
import VerifyCertificatePage from './pages/VerifyCertificatePage'
import ScrollToTop from './components/ScrollToTop'
import { AuthProvider } from './context/AuthContext'
import { SpotifyProvider } from './context/SpotifyContext'
import { ExamProvider } from './context/ExamContext'
import SpotifyPlayerWidget from './components/SpotifyPlayerWidget'

function App() {
  return (
    <AuthProvider>
      <ExamProvider>
        <SpotifyProvider>
          <BrowserRouter>
            <ScrollToTop />
            <div className="min-h-screen text-white relative font-sans">
              <Navbar />
              <SpotifyPlayerWidget />
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/labs" element={<AllLabsPage />} />
                <Route path="/labs/linear-regression" element={<LinearRegressionLabPage />} />
                <Route path="/labs/matrix-multiplication" element={<MatrixMultiplicationLabPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/certifications" element={<CertificationsSelectionPage />} />
                <Route path="/exam/:sessionId" element={<ExamPage />} />
                <Route path="/admin/exams" element={<AdminDashboard />} />
                <Route path="/features" element={<FeaturesPage />} />
                <Route path="/certifications/lobby" element={<ExamLobbyPage />} />
                <Route path="/verify/:hash" element={<VerifyCertificatePage />} />
              </Routes>
            </div>
          </BrowserRouter>
        </SpotifyProvider>
      </ExamProvider>
    </AuthProvider>
  )
}

export default App
