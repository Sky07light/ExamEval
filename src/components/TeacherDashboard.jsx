import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import {
  ChartBarIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ClockIcon,
  PlusIcon,
  EyeIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const TeacherDashboard = () => {
  const { isDark } = useTheme();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [selectedSection, setSelectedSection] = useState('10A');
  const [showAddSectionModal, setShowAddSectionModal] = useState(false);
  const [newSection, setNewSection] = useState({ name: '', studentCount: '' });

  const stats = [
    { title: 'Total Exams Evaluated', value: '847', icon: DocumentTextIcon, color: 'blue' },
    { title: 'Active Students', value: '156', icon: UserGroupIcon, color: 'green' },
    { title: 'Average Grade', value: '78.5%', icon: ChartBarIcon, color: 'purple' },
    { title: 'Time Saved', value: '245hrs', icon: ClockIcon, color: 'orange' },
  ];

  const [sections, setSections] = useState([
    { name: '10A', students: 28, avgScore: 82.5 },
    { name: '10B', students: 31, avgScore: 79.8 },
    { name: '11A', students: 25, avgScore: 85.2 },
    { name: '11B', students: 29, avgScore: 77.6 },
    { name: '12A', students: 22, avgScore: 88.1 },
    { name: '12B', students: 21, avgScore: 83.9 },
  ]);

  const recentExams = [
    { subject: 'Mathematics', section: '10A', evaluated: 28, pending: 0, date: '2025-01-15' },
    { subject: 'English Literature', section: '11A', evaluated: 22, pending: 3, date: '2025-01-14' },
    { subject: 'Physics', section: '12A', evaluated: 18, pending: 4, date: '2025-01-13' },
    { subject: 'Chemistry', section: '11B', evaluated: 29, pending: 0, date: '2025-01-12' },
  ];

  const allStudents = {
    '10A': [
      { name: 'Alex Thompson', avgScore: 85.2, lastExam: 88, trend: 'up', grade: 'A' },
    ],
    '10B': [],
    '11A': [],
    '11B': [],
    '12A': [],
    '12B': [],
  };

  const sectionStudents = allStudents[selectedSection] || [];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600',
    };
    return colors[color] || colors.blue;
  };

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return 'text-green-600 dark:text-green-400';
    if (grade.startsWith('B')) return 'text-blue-600 dark:text-blue-400';
    if (grade.startsWith('C')) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const handleAddSection = () => {
    if (newSection.name && newSection.studentCount) {
      const newSectionData = {
        name: newSection.name,
        students: parseInt(newSection.studentCount),
        avgScore: 0,
      };
      setSections([...sections, newSectionData]);
      setNewSection({ name: '', studentCount: '' });
      setShowAddSectionModal(false);
      allStudents[newSection.name] = [];
    }
  };

  return (
    <div className={`min-h-screen pt-16 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Welcome back, {currentUser?.name}
          </h1>
          <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Here's an overview of your teaching activities and student performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}
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
          <div className={`lg:col-span-2 ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Sections Overview
              </h2>
              <button 
                onClick={() => setShowAddSectionModal(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Section
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sections.map((section, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 cursor-pointer ${
                    selectedSection === section.name
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : isDark
                        ? 'border-gray-700 bg-gray-900'
                        : 'border-gray-200 bg-gray-50'
                  }`}
                  onClick={() => navigate(`/section/${section.name}`)}
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

          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
            <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>
              Ecaluated Exams
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
                </div>
              ))}
            </div>
          </div>
        </div>

        {showAddSectionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 w-full max-w-md`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Add New Section
                </h3>
                <button
                  onClick={() => setShowAddSectionModal(false)}
                  className={`p-2 rounded-full ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  value={newSection.name}
                  onChange={(e) => setNewSection({ ...newSection, name: e.target.value })}
                  placeholder="Section Name"
                  className="w-full px-3 py-2 border rounded"
                />
                <input
                  type="number"
                  value={newSection.studentCount}
                  onChange={(e) => setNewSection({ ...newSection, studentCount: e.target.value })}
                  placeholder="Student Count"
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddSectionModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSection}
                  disabled={!newSection.name || !newSection.studentCount}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Add Section
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default TeacherDashboard;
