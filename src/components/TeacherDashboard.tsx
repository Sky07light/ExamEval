import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import {
  ChartBarIcon,
  UserGroupIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  ClockIcon,
  TrophyIcon,
  PlusIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const TeacherDashboard: React.FC = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [selectedSection, setSelectedSection] = useState('10A');

  const stats = [
    { title: 'Total Exams Evaluated', value: '847', icon: DocumentTextIcon, color: 'blue' },
    { title: 'Active Students', value: '156', icon: UserGroupIcon, color: 'green' },
    { title: 'Average Grade', value: '78.5%', icon: ChartBarIcon, color: 'purple' },
    { title: 'Time Saved', value: '245hrs', icon: ClockIcon, color: 'orange' },
  ];

  const sections = [
    { name: '10A', students: 28, avgScore: 82.5 },
    { name: '10B', students: 31, avgScore: 79.8 },
    { name: '11A', students: 25, avgScore: 85.2 },
    { name: '11B', students: 29, avgScore: 77.6 },
    { name: '12A', students: 22, avgScore: 88.1 },
    { name: '12B', students: 21, avgScore: 83.9 },
  ];

  const recentExams = [
    { subject: 'Mathematics', section: '10A', evaluated: 28, pending: 0, date: '2025-01-15' },
    { subject: 'English Literature', section: '11A', evaluated: 22, pending: 3, date: '2025-01-14' },
    { subject: 'Physics', section: '12A', evaluated: 18, pending: 4, date: '2025-01-13' },
    { subject: 'Chemistry', section: '11B', evaluated: 29, pending: 0, date: '2025-01-12' },
  ];

  const topStudents = [
    { name: 'Emma Wilson', section: '12A', avgScore: 94.5, improvement: '+2.3%' },
    { name: 'James Chen', section: '11A', avgScore: 92.1, improvement: '+1.8%' },
    { name: 'Sofia Rodriguez', section: '10A', avgScore: 89.7, improvement: '+3.2%' },
    { name: 'Michael Johnson', section: '12B', avgScore: 88.9, improvement: '+0.9%' },
    { name: 'Aisha Patel', section: '11B', avgScore: 87.4, improvement: '+2.1%' },
  ];

  const sectionStudents = [
    { name: 'Alex Thompson', avgScore: 85.2, lastExam: 88, trend: 'up' },
    { name: 'Sarah Miller', avgScore: 82.7, lastExam: 79, trend: 'down' },
    { name: 'David Chen', avgScore: 91.3, lastExam: 93, trend: 'up' },
    { name: 'Lisa Brown', avgScore: 76.8, lastExam: 81, trend: 'up' },
    { name: 'Ryan Kumar', avgScore: 88.5, lastExam: 87, trend: 'down' },
    { name: 'Emma Davis', avgScore: 79.2, lastExam: 84, trend: 'up' },
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600',
    };
    return colors[color as keyof typeof colors] || colors.blue;
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
            Here's an overview of your teaching activities and student performance.
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
          {/* Sections Overview */}
          <div className={`lg:col-span-2 ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Sections Overview
              </h2>
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Section
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sections.map((section, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    selectedSection === section.name
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : isDark
                        ? 'border-gray-700 bg-gray-900 hover:border-gray-600'
                        : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedSection(section.name)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Class {section.name}
                    </h3>
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {section.students} students
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Avg Score:
                    </span>
                    <span className={`ml-2 font-bold ${section.avgScore >= 80 ? 'text-green-600' : section.avgScore >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {section.avgScore}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Exams */}
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>
              Recent Exams
            </h2>
            <div className="space-y-4">
              {recentExams.map((exam, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {exam.subject}
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
                      {exam.section}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                      {exam.evaluated} evaluated
                    </span>
                    {exam.pending > 0 && (
                      <span className="text-orange-600 font-medium">
                        {exam.pending} pending
                      </span>
                    )}
                  </div>
                  <div className="mt-2">
                    <button className="flex items-center text-blue-600 hover:text-blue-700 text-sm">
                      <EyeIcon className="h-4 w-4 mr-1" />
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Students in Selected Section */}
        <div className={`mt-8 ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>
            Students in Class {selectedSection}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                    Student Name
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                    Average Score
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                    Last Exam
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                    Trend
                  </th>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className={`${isDark ? 'bg-gray-800' : 'bg-white'} divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {sectionStudents.map((student, index) => (
                  <tr key={index}>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {student.name}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {student.avgScore}%
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {student.lastExam}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        student.trend === 'up' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                        {student.trend === 'up' ? '↗ Improving' : '↘ Declining'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-blue-600 hover:text-blue-700">
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;