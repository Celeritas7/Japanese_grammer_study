import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import Auth from './components/Auth';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';
import GrammarPage from './pages/GrammarPage';
import QuizPage from './pages/QuizPage';
import CardsPage from './pages/CardsPage';
import ProgressPage from './pages/ProgressPage';

export default function App() {
  const { session, loading, signIn, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('grammar');

  // Show loading while checking auth
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#2C2420',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <LoadingSpinner message="Starting up..." />
      </div>
    );
  }

  // Show login if not authenticated
  if (!session) {
    return <Auth onSignIn={signIn} />;
  }

  // Main app
  return (
    <Layout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onSignOut={signOut}
    >
      {activeTab === 'grammar' && <GrammarPage />}
      {activeTab === 'quiz' && <QuizPage />}
      {activeTab === 'cards' && <CardsPage />}
      {activeTab === 'progress' && <ProgressPage />}
    </Layout>
  );
}
