import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import TeacherDashboard from '../components/TeacherDashboard';
import StudentDashboard from '../components/StudentDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Please log in to access your dashboard.</div>;
  }

  return user.role === 'teacher' ? <TeacherDashboard /> : <StudentDashboard />;
};

export default Dashboard;
