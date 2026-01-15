/**
 * Author: BaseLine Designs.com
 * Version: v0.1
 * Last Updated: 2026-01-10 JST
 * Changes: Routing + AuthProvider wiring
 */
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import SwipeNavigation from './components/SwipeNavigation.jsx';

import Home from './pages/Home.jsx';
import Practice from './pages/Practice.jsx';
import News from './pages/News.jsx';
import Faq from './pages/Faq.jsx';
import Contact from './pages/Contact.jsx';
import Join from './pages/Join.jsx';
import Teacher from './pages/Teacher.jsx';

import Links from './pages/Links.jsx';
import About from './pages/About.jsx';
import Character from './pages/Character.jsx';
import Privacy from './pages/Privacy.jsx';

import Login from './pages/Login.jsx';
import MemberHome from './pages/MemberHome.jsx';

import PhilosophyHarmony from './pages/PhilosophyHarmony.jsx';
import PhilosophyEtiquette from './pages/PhilosophyEtiquette.jsx';
import PhilosophyLifelong from './pages/PhilosophyLifelong.jsx';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <SwipeNavigation>
          <Routes>
            {/* Public site pages */}
            <Route path="/" element={<Home />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/news" element={<News />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/Teacher" element={<Teacher />} />
            <Route path="/join" element={<Join />} />
            <Route path="/links" element={<Links />} />
            <Route path="/character" element={<Character />} />
            <Route path="/privacy" element={<Privacy />} />

            {/* Philosophy pages */}
            <Route path="/philosophy/harmony" element={<PhilosophyHarmony />} />
            <Route path="/philosophy/etiquette" element={<PhilosophyEtiquette />} />
            <Route path="/philosophy/lifelong" element={<PhilosophyLifelong />} />

            {/* Member site routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/member" element={<MemberHome />} />

            {/* Fallback: redirect unknown routes to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </SwipeNavigation>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
