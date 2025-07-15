import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import {
  ArrowLeftIcon,
  UserGroupIcon,
  ChartBarIcon,
  DocumentTextIcon,
  PlusIcon,
  BookOpenIcon,
  BeakerIcon,
  CalculatorIcon,
  GlobeAltIcon,
  LanguageIcon,
  PaintBrushIcon,
  MusicalNoteIcon,
  HeartIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';

const SectionDetails = () => {
  const { sectionName } = useParams();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');

  // Sample student data for the section
  const allStudents = {
    '10A': [
      { name: 'Alex Thompson', avgScore: 85.2, lastExam: 88, trend: 'up', grade: 'A', rollNo: '001' },
      { name: 'Sarah Miller', avgScore: 82.7, lastExam: 79, trend: 'down', grade: 'A-', rollNo: '002' },
      { name: 'David Chen', avgScore: 91.3, lastExam: 93, trend: 'up', grade: 'A+', rollNo: '003' },
      { name: 'Lisa Brown', avgScore: 76.8, lastExam: 81, trend: 'up', grade: 'B+', rollNo: '004' },
      { name: 'Ryan Kumar', avgScore: 88.5, lastExam: 87, trend: 'down', grade: 'A', rollNo: '005' },
      { name: 'Emma Davis', avgScore: 79.2, lastExam: 84, trend: 'up', grade: 'B+', rollNo: '006' },
    ],
    '10B': [
      { name: 'Michael Johnson', avgScore: 78.5, lastExam: 82, trend: 'up', grade: 'B+', rollNo: '001' },
      { name: 'Jessica Lee', avgScore: 84.2, lastExam: 86, trend: 'up', grade: 'A-', rollNo: '002' },
      { name: 'Daniel Wilson', avgScore: 72.8, lastExam: 75, trend: 'up', grade: 'B', rollNo: '003' },
      { name: 'Sophie Chen', avgScore: 89.1, lastExam: 91, trend: 'up', grade: 'A', rollNo: '004' },
      { name: 'James Rodriguez', avgScore: 81.7, lastExam: 78, trend: 'down', grade: 'A-', rollNo: '005' },
    ],
    '11A': [
      { name: 'Emily Watson', avgScore: 92.4, lastExam: 94, trend: 'up', grade: 'A+', rollNo: '001' },
      { name: 'Noah Martinez', avgScore: 87.6, lastExam: 89, trend: 'up', grade: 'A', rollNo: '002' },
      { name: 'Olivia Taylor', avgScore: 83.9, lastExam: 81, trend: 'down', grade: 'A-', rollNo: '003' },
      { name: 'Ethan Anderson', avgScore: 79.3, lastExam: 83, trend: 'up', grade: 'B+', rollNo: '004' },
    ],
    '11B': [
      { name: 'Ava Thompson', avgScore: 85.7, lastExam: 88, trend: 'up', grade: 'A', rollNo: '001' },
      { name: 'Liam Garcia', avgScore: 74.2, lastExam: 72, trend: 'down', grade: 'B', rollNo: '002' },
      { name: 'Mia Robinson', avgScore: 90.8, lastExam: 93, trend: 'up', grade: 'A+', rollNo: '003' },
      { name: 'Lucas White', avgScore: 77.5, lastExam: 80, trend: 'up', grade: 'B+', rollNo: '004' },
    ],
    '12A': [
      { name: 'Isabella Clark', avgScore: 94.2, lastExam: 96, trend: 'up', grade: 'A+', rollNo: '001' },
      { name: 'Mason Lewis', avgScore: 89.7, lastExam: 91, trend: 'up', grade: 'A', rollNo: '002' },
      { name: 'Charlotte Hall', avgScore: 86.3, lastExam: 84, trend: 'down', grade: 'A', rollNo: '003' },
      { name: 'William Allen', avgScore: 82.1, lastExam: 85, trend: 'up', grade: 'A-', rollNo: '004' },
    ],
    '12B': [
      { name: 'Amelia Young', avgScore: 91.5, lastExam: 93, trend: 'up', grade: 'A+', rollNo: '001' },
      { name: 'Benjamin King', avgScore: 84.8, lastExam: 87, trend: 'up', grade: 'A-', rollNo: '002' },
      { name: 'Harper Wright', avgScore: 78.9, lastExam: 76, trend: 'down', grade: 'B+', rollNo: '003' },
      { name: 'Alexander Lopez', avgScore: 87.2, lastExam: 89, trend: 'up', grade: 'A', rollNo: '004' },
    ],
  };

  const subjects = [
    { name: 'Mathematics', icon: CalculatorIcon, color: 'blue' },
    { name: 'English Literature', icon: BookOpenIcon, color: 'green' },
    { name: 'Physics', icon: BeakerIcon, color: 'purple' },
    { name: 'Chemistry', icon: BeakerIcon, color: 'orange' },
    { name: 'Biology', icon: HeartIcon, color: 'red' },
    { name: 'History', icon: GlobeAltIcon, color: 'yellow' },
    { name: 'Geography', icon: GlobeAltIcon, color: 'teal' },
    { name: 'Computer Science', icon: ComputerDesktopIcon, color: 'indigo' },
    { name: 'Art', icon: PaintBrushIcon, color: 'pink' },
    { name: 'Music', icon: MusicalNoteIcon, color: 'cyan' },
  ];

  const students = allStudents[sectionName] || [];
  
  const sectionStats = {
    totalStudents: students.length,
    avgScore: students.reduce((sum, student) => sum + student.avgScore, 0) / students.length,
    topPerformer: students.reduce((top, student) => student.avgScore > top.avgScore ? student : top, students[0]),
    improvingStudents: students.filter(student => student.trend === 'up').length,
  };

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return 'text-green-600 dark:text-green-400';
    if (grade.startsWith('B')) return 'text-blue-600 dark:text-blue-400';
    if (grade.startsWith('C')) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getColorClasses = (color) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600',
      red: 'from-red-500 to-red-600',
      yellow: 'from-yellow-500 to-yellow-600',
      teal: 'from-teal-500 to-teal-600',
      indigo: 'from-indigo-500 to-indigo-600',
      pink: 'from-pink-500 to-pink-600',
      cyan: 'from-cyan-500 to-cyan-600',
    };
    return colors[color] || colors.blue;
  };

  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject);
    setShowSubjectModal(false);
    // Navigate to upload page with subject parameter
    navigate(`/upload?subject=${encodeURIComponent(subject)}§ion=${encodeURIComponent(sectionName || '')}`);
  };

  return (
    <div className={`min-h-screen pt-16 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'} transition-colors mr-4`}
          >
            <ArrowLeftIcon className="h-6 w-6" />
          </button>
          <div>
            <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Class {sectionName}
            </h1>
            <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage students and upload exam materials for this section.
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600">
                <UserGroupIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Total Students
                </p>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {sectionStats.totalStudents}
                </p>
              </div>
            </div>
          </div>

          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600">
                <ChartBarIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Average Score
                </p>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {sectionStats.avgScore.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600">
                <DocumentTextIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Top Performer
                </p>
                <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {sectionStats.topPerformer?.name.split(' ')[0]}
                </p>
              </div>
            </div>
          </div>

          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600">
                <ChartBarIcon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Improving
                </p>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {sectionStats.improvingStudents}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 mb-8`}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Upload Exam Materials
              </h2>
              <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Select a subject to upload question papers or student answer sheets.
              </p>
            </div>
            <button
              onClick={() => setShowSubjectModal(true)}
              className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Upload Materials
            </button>
          </div>
        </div>

        {/* Students Table */}
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
          <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>
            Students in Class {sectionName}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                  <th className={`px-6 py-3 text-left text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                    Roll No.
                  </th>
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
                    Grade
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
                {students.map((student, index) => (
                  <tr key={index}>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {student.rollNo}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {student.name}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {student.avgScore}%
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {student.lastExam}%
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${getGradeColor(student.grade)}`}>
                      {student.grade}
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

        {/* Subject Selection Modal */}
        {showSubjectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-2xl p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Select Subject
                </h3>
                <button
                  onClick={() => setShowSubjectModal(false)}
                  className={`p-2 rounded-full ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'} transition-colors`}
                >
                  <ArrowLeftIcon className="h-5 w-5" />
                </button>
              </div>
              
              <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-6`}>
                Choose the subject for which you want to upload exam materials.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {subjects.map((subject, index) => (
                  <button
                    key={index}
                    onClick={() => handleSubjectSelect(subject.name)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left hover:scale-105 ${
                      isDark 
                        ? 'border-gray-700 bg-gray-900 hover:border-gray-600'
                        : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`p-3 rounded-lg bg-gradient-to-r ${getColorClasses(subject.color)} mr-4`}>
                        <subject.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {subject.name}
                        </h4>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Upload materials for {subject.name}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SectionDetails;