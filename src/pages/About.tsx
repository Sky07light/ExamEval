import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const About: React.FC = () => {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen pt-16 ${isDark ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className={`text-4xl md:text-5xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-8`}>
          About ExamEval
        </h1>
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-8`}>
          <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-6`}>
            This page is coming soon! We're working on creating comprehensive information about our mission,
            team, and the technology behind ExamEval.
          </p>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            In the meantime, feel free to explore our features and get started with ExamEval's AI-powered exam evaluation.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;