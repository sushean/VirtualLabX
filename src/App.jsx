import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import AllLabsPage from './pages/AllLabsPage'
import LinearRegressionLabPage from './pages/LinearRegressionLabPage'
import MatrixMultiplicationLabPage from './pages/MatrixMultiplicationLabPage'
import DsaLabPage from './pages/DsaLabPage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import PerformancePage from './pages/PerformancePage'
import CertificationsSelectionPage from './pages/CertificationsSelectionPage'
import ExamPage from './pages/ExamPage'
import AdminDashboard from './pages/AdminDashboard'
import AdminLabBuilder from './pages/AdminLabBuilder'
import AdminLabContentEditor from './pages/AdminLabContentEditor'
import DynamicLabPage from './pages/DynamicLabPage'
import FeaturesPage from './pages/FeaturesPage'
import ExamLobbyPage from './pages/ExamLobbyPage'
import VerifyCertificatePage from './pages/VerifyCertificatePage'
import TopicDetailPage from './pages/TopicDetailPage'
import ScrollToTop from './components/ScrollToTop'
import PrivateRoute from './routes/PrivateRoute'
import { AuthProvider } from './context/AuthContext'
import { SpotifyProvider } from './context/SpotifyContext'
import { ExamProvider } from './context/ExamContext'
import { ThemeProvider } from './context/ThemeContext'
import SpotifyPlayerWidget from './components/SpotifyPlayerWidget'

function App() {
  return (
    <AuthProvider>
      <ExamProvider>
        <SpotifyProvider>
          <ThemeProvider>
            <BrowserRouter>
              <ScrollToTop />
              <div className="min-h-screen text-white relative font-sans">
                <Navbar />
                <SpotifyPlayerWidget />
                <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                
                {/* Protected Routes */}
                <Route path="/labs" element={<PrivateRoute><AllLabsPage /></PrivateRoute>} />
                <Route path="/labs/linear-regression" element={<PrivateRoute><LinearRegressionLabPage /></PrivateRoute>} />
                <Route path="/labs/matrix-multiplication" element={<PrivateRoute><MatrixMultiplicationLabPage /></PrivateRoute>} />
                <Route path="/labs/dsa" element={<PrivateRoute><DsaLabPage /></PrivateRoute>} />
                <Route path="/labs/:slug" element={<PrivateRoute><DynamicLabPage /></PrivateRoute>} />
                <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
                <Route path="/performance" element={<PrivateRoute><PerformancePage /></PrivateRoute>} />
                <Route path="/certifications" element={<PrivateRoute><CertificationsSelectionPage /></PrivateRoute>} />
                <Route path="/certifications/lobby" element={<PrivateRoute><ExamLobbyPage /></PrivateRoute>} />
                <Route path="/exam/:sessionId" element={<PrivateRoute><ExamPage /></PrivateRoute>} />
                
                {/* Admin Protected Routes */}
                <Route path="/admin/exams" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
                <Route path="/admin/builder" element={<PrivateRoute><AdminLabBuilder /></PrivateRoute>} />
                <Route path="/admin/builder/:slug" element={<PrivateRoute><AdminLabBuilder /></PrivateRoute>} />
                <Route path="/admin/lab/create" element={<PrivateRoute><AdminLabContentEditor /></PrivateRoute>} />
                <Route path="/admin/lab/:slug/edit" element={<PrivateRoute><AdminLabContentEditor /></PrivateRoute>} />
                
                {/* Public Details & Verifiers */}
                <Route path="/topic/:topicName" element={<TopicDetailPage />} />
                <Route path="/features" element={<FeaturesPage />} />
                <Route path="/verify/:hash" element={<VerifyCertificatePage />} />
                </Routes>
              </div>
            </BrowserRouter>
          </ThemeProvider>
        </SpotifyProvider>
      </ExamProvider>
    </AuthProvider>
  )
}

export default App
