import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import AllLabsPage from './pages/AllLabsPage'
import LinearRegressionLabPage from './pages/LinearRegressionLabPage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import ScrollToTop from './components/ScrollToTop'
import { AuthProvider } from './context/AuthContext'
import { SpotifyProvider } from './context/SpotifyContext'
import SpotifyPlayerWidget from './components/SpotifyPlayerWidget'

function App() {
  return (
    <AuthProvider>
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
              <Route path="/login" element={<LoginPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </div>
        </BrowserRouter>
      </SpotifyProvider>
    </AuthProvider>
  )
}

export default App
