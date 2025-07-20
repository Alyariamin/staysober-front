import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { SobrietyProvider } from './contexts/SobrietyContext';
import { JournalProvider } from './contexts/JournalContext';
import { GoalsProvider } from './contexts/GoalsContext';
import { HabitsProvider } from './contexts/HabitsContext';
import { MoodProvider } from './contexts/MoodContext';
import { CravingsProvider } from './contexts/CravingsContext';
import { SupportProvider } from './contexts/SupportContext';

// Layout components
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Page components
import Dashboard from './pages/Dashboard';
import Journal from './pages/Journal';
import Resources from './pages/Resources';
import Goals from './pages/Goals';
import Habits from './pages/Habits';
import Cravings from './pages/Cravings';
import Community from './pages/Community';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/*" element={
              <ProtectedRoute>
                <SobrietyProvider>
                  <JournalProvider>
                    <GoalsProvider>
                      <HabitsProvider>
                        <MoodProvider>
                          <CravingsProvider>
                            <CravingsProvider>
                              <Layout>
                                <Routes>
                                  <Route path="/" element={<Dashboard />} />
                                  <Route path="/journal" element={<Journal />} />
                                  <Route path="/resources" element={<Resources />} />
                                  <Route path="/goals" element={<Goals />} />
                                  <Route path="/habits" element={<Habits />} />
                                  <Route path="/cravings" element={<Cravings />} />
                                  <Route path="/community" element={<Community />} />
                                  <Route path="/profile" element={<Profile />} />
                                </Routes>
                              </Layout>
                            </CravingsProvider>
                          </CravingsProvider>
                        </MoodProvider>
                      </HabitsProvider>
                    </GoalsProvider>
                  </JournalProvider>
                </SobrietyProvider>
              </ProtectedRoute>
            } />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;