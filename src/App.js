import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import LandingPage from './components/LandingPage';
import RegisterPage from './components/RegisterPage';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import SkillAssessment from './components/SkillAssessment';
import CareerPathMapping from './components/CareerPathMapping';
import CareerRecommendation from './components/CareerRecommendation';
import SkillGapIdentification from './components/SkillGapIdentification';
import LearningResources from './components/LearningResources';
import ProgressTracking from './components/ProgressTracking';
import OnboardingChatBot from './components/OnboardingChatBot';
import { getMyAssessment, logoutUser } from './api';
import './App.css';

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [user, setUser] = useState(null);
  const [assessmentData, setAssessmentData] = useState(null);
  const [showChatBot, setShowChatBot] = useState(false);

  const navigate = (page) => setCurrentPage(page);

  const hydrateAssessment = async () => {
    try {
      const assessment = await getMyAssessment();
      setAssessmentData(assessment || null);
    } catch (_err) {
      setAssessmentData(null);
    }
  };

  const handleLogin = async (userData) => {
      setUser(userData);
    await hydrateAssessment();
      setShowChatBot(true);
      navigate('dashboard');
    };

  const handleRegister = async (userData) => {
    setUser(userData);
    await hydrateAssessment();
    setShowChatBot(true);
    navigate('dashboard');
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
    setAssessmentData(null);
    setShowChatBot(false);
    navigate('landing');
  };

  const handleAssessmentComplete = async (data) => {
    setAssessmentData(data || null);
    await hydrateAssessment();
  };

  const isAuthenticated = !!user;

  const renderPage = () => {
    switch (currentPage) {
      case 'landing': return <LandingPage navigate={navigate} />;
      case 'register': return <RegisterPage navigate={navigate} onRegister={handleRegister} />;
      case 'login': return <LoginPage navigate={navigate} onLogin={handleLogin} />;
      case 'dashboard': return <Dashboard navigate={navigate} user={user} assessmentData={assessmentData} />;
      case 'skill-assessment': return <SkillAssessment navigate={navigate} user={user} onComplete={handleAssessmentComplete} assessmentData={assessmentData} />;
      case 'career-path': return <CareerPathMapping navigate={navigate} assessmentData={assessmentData} />;
      case 'career-recommendation': return <CareerRecommendation navigate={navigate} assessmentData={assessmentData} />;
      case 'skill-gap': return <SkillGapIdentification navigate={navigate} assessmentData={assessmentData} />;
      case 'learning-resources': return <LearningResources navigate={navigate} assessmentData={assessmentData} />;
      case 'progress': return <ProgressTracking navigate={navigate} user={user} assessmentData={assessmentData} />;
      default: return <LandingPage navigate={navigate} />;
    }
  };

  return (
    <div className="app-container">
      {isAuthenticated && (
        <Sidebar
          currentPage={currentPage}
          navigate={navigate}
          user={user}
          onLogout={handleLogout}
        />
      )}
      <main className={`main-content ${isAuthenticated ? 'with-sidebar' : ''}`}>
        {renderPage()}
        {isAuthenticated && showChatBot && (
          <OnboardingChatBot
            userName={user?.name}
            assessmentData={assessmentData}
            onComplete={async (data) => {
              await handleAssessmentComplete(data);
              navigate('career-recommendation');
            }}
          />
        )}
      </main>
    </div>
  );
}
