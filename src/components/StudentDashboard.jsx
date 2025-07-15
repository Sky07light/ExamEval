import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import {
  ChartBarIcon,
  ClockIcon,
  TrophyIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  PlayIcon
} from '@heroicons/react/24/outline';

const StudentDashboard = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();

  const stats = [
    { title: 'Tests Completed', value: '24', icon: CheckCircleIcon, color: 'green' },
    { title: 'Average Score', value: '84.2%', icon: ChartBarIcon, color: 'blue' },
    { title: 'Study Hours', value: '127h', icon: ClockIcon, color: 'purple' },
    { title: 'Rank in Class', value: '#7', icon: TrophyIcon, color: 'orange' },
  ];

  const subjects = [
    {
      name: 'Mathematics',
      icon: '📊',
      completed: 8,
      total: 10,
      avgScore: 87.5,
      lastScore: 92,
      trend: 'up',
      improvementPoints: ['Focus on algebra problems', 'Practice word problems']
    },
    {
      name: 'English Literature',
      icon: '📚',
      completed: 6,
      total: 8,
      avgScore: 82.1,
      lastScore: 78,
      trend: 'down',
      improvementPoints: ['Improve essay structure', 'Expand vocabulary', 'Practice literary analysis']
    },
    {
      name: 'Physics',
      icon: '⚛️',
      completed: 5,
      total: 7,
      avgScore: 79.8,
      lastScore: 85,
      trend: 'up',
      improvementPoints: ["Review Newton's laws", 'Practice numerical problems']
    },
    {
      name: 'Chemistry',
      icon: '🧪',
      completed: 7,
      total: 9,
      avgScore: 91.2,
      lastScore: 94,
      trend: 'up',
      improvementPoints: ['Excellent progress!', 'Keep up the good work']
    },
  ];

  const recentTests = [
    { subject: 'Mathematics', score: 92, maxScore: 100, date: '2025-01-15', status: 'excellent' },
    { subject: 'Physics', score: 85, maxScore: 100, date: '2025-01-14', status: 'good' },
    { subject: 'English Literature', score: 78, maxScore: 100, date: '2025-01-13', status: 'average' },
    { subject: 'Chemistry', score: 94, maxScore: 100, date: '2025-01-12', status: 'excellent' },
  ];

  const practiceRecommendations = [
    { subject: 'English Literature', topic: 'Essay Writing', difficulty: 'Medium', estimatedTime: '30 min' },
    { subject: 'Mathematics', topic: 'Quadratic Equations', difficulty: 'Hard', estimatedTime: '45 min' },
    { subject: 'Physics', topic: 'Motion in a Plane', difficulty: 'Medium', estimatedTime: '35 min' },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600',
    };
    return colors[color] || colors.blue;
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusColor = (status) => {
    const colors = {
      excellent: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      good: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      average: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      poor: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    };
    return colors[status] || colors.average;
  };

  return (
    <div className={`min-h-screen pt-16 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Welcome back, {user?.name}
          </h1>
          <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Track your progress and continue your learning journey.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300`}
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${getColorClasses(stat.color)}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {stat.title}
                  </p>
                  <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Subjects Progress */}
          <div className={`lg:col-span-2 ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>
              Subject Progress
            </h2>
            <div className="space-y-6">
              {subjects.map((subject, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{subject.icon}</span>
                      <div>
                        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {subject.name}
                        </h3>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {subject.completed}/{subject.total} tests completed
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-lg font-bold ${getScoreColor(subject.avgScore)}`}>
                        {subject.avgScore}%
                      </div>
                      <div className="flex items-center text-sm">
                        <span className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Last: {subject.lastScore}%
                        </span>
                        <ArrowTrendingUpIcon 
                          className={`ml-1 h-4 w-4 ${subject.trend === 'up' ? 'text-green-500' : 'text-red-500'} ${subject.trend === 'down' ? 'rotate-180' : ''}`}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full bg-gradient-to-r ${getColorClasses('blue')}`}
                        style={{ width: `${(subject.completed / subject.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Improvement Points */}
                  <div>
                    <h4 className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                      Improvement Points:
                    </h4>
                    <ul className="space-y-1">
                      {subject.improvementPoints.map((point, pointIndex) => (
                        <li key={pointIndex} className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} flex items-start`}>
                          <span className="text-blue-500 mr-2">•</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4">
                    <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      <PlayIcon className="h-4 w-4 mr-2" />
                      Practice Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Tests & Recommendations */}
          <div className="space-y-6">
            {/* Recent Tests */}
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>
                Evaluated Tests
              </h2>
              <div className="space-y-4">
                {recentTests.map((test, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {test.subject}
                      </h3>
                      <span className={`text-sm px-2 py-1 rounded-full ${getStatusColor(test.status)}`}>
                        {test.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-lg font-bold ${getScoreColor(test.score)}`}>
                        {test.score}/{test.maxScore}
                      </span>
                      <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {test.date}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Practice Recommendations */}
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>
                Recommended Practice
              </h2>
              <div className="space-y-4">
                {practiceRecommendations.map((rec, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}
                  >
                    <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-1`}>
                      {rec.topic}
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                      {rec.subject}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded ${
                        rec.difficulty === 'Hard' 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                          : rec.difficulty === 'Medium'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                          : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      }`}>
                        {rec.difficulty}
                      </span>
                      <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {rec.estimatedTime}
                      </span>
                    </div>
                    <button className="w-full mt-3 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm">
                      Start Practice
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
