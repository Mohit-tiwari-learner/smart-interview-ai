import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LandingPage from './pages/LandingPage';
import PracticePage from './pages/PracticePage';
import FeedbackPage from './pages/FeedbackPage';
import PricingPage from './pages/PricingPage';
import ProgressPage from './pages/ProgressPage';
import AuthPage from './pages/AuthPage';
import NotFoundPage from './pages/NotFoundPage';
import BlogPage from './pages/BlogPage';
import CareersPage from './pages/CareersPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import ProtectedRoute from './components/layout/ProtectedRoute';



import { ROUTES } from './routes';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-primary-500/30 selection:text-primary-200">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path={ROUTES.HOME} element={<LandingPage />} />
          <Route path={ROUTES.PRICING} element={<PricingPage />} />
          <Route path={ROUTES.AUTH} element={<AuthPage />} />
          <Route path={ROUTES.ABOUT} element={<AboutPage />} />
          <Route path={ROUTES.BLOG} element={<BlogPage />} />
          <Route path={ROUTES.CAREERS} element={<CareersPage />} />
          <Route path={ROUTES.CONTACT} element={<ContactPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path={ROUTES.PRACTICE} element={<PracticePage />} />
            <Route path={ROUTES.FEEDBACK} element={<FeedbackPage />} />
            <Route path={ROUTES.PROGRESS} element={<ProgressPage />} />
          </Route>

          <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
