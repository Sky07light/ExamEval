import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { 
  SparklesIcon as BrainIcon, 
  ClockIcon, 
  ChartBarIcon, 
  UserGroupIcon,
  CheckCircleIcon,
  StarIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  ArrowRightIcon,
  SparklesIcon,
  ShieldCheckIcon,
  BoltIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  const { isDark } = useTheme();

  const features = [
    {
      icon: BrainIcon,
      title: 'AI-Powered Evaluation',
      description: 'Advanced Gemini API integration provides accurate, consistent grading with detailed feedback for every answer.',
    },
    {
      icon: ClockIcon,
      title: 'Time-Saving Automation',
      description: 'Reduce grading time by 90%. Focus on teaching while AI handles the repetitive evaluation process.',
    },
    {
      icon: ChartBarIcon,
      title: 'Detailed Analytics',
      description: 'Comprehensive insights into student performance, progress tracking, and improvement recommendations.',
    },
    {
      icon: UserGroupIcon,
      title: 'Multi-Role Support',
      description: 'Separate dashboards for teachers and students with role-specific features and permissions.',
    },
    {
      icon: ShieldCheckIcon,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with data encryption and reliable cloud infrastructure.',
    },
    {
      icon: DocumentTextIcon,
      title: 'Flexible Upload',
      description: 'Support for both typed and handwritten answers with OCR technology for seamless processing.',
    },
  ];

  const testimonials = [
    {
      name: 'Dr. Sarah Mitchell',
      role: 'Professor of Literature',
      avatar: 'https://images.pexels.com/photos/3184460/pexels-photo-3184460.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      content: 'ExamEval has revolutionized how I grade essays. The detailed feedback is incredibly helpful for students.',
      rating: 5,
    },
    {
      name: 'Mark Johnson',
      role: 'High School Teacher',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      content: 'I save 15 hours per week on grading. The consistency and quality of AI evaluation is impressive.',
      rating: 5,
    },
    {
      name: 'Emily Chen',
      role: 'University Lecturer',
      avatar: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
      content: 'Students love the immediate feedback. It helps them understand their mistakes and improve faster.',
      rating: 5,
    },
  ];

  const stats = [
    { number: '50K+', label: 'Exams Evaluated' },
    { number: '2K+', label: 'Active Teachers' },
    { number: '25K+', label: 'Students Helped' },
    { number: '90%', label: 'Time Saved' },
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Hero Section */}
      <section className={`relative overflow-hidden ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 dark:from-gray-800 dark:via-blue-900/20 dark:to-purple-900/20"></div>
        
        {/* Animated Mathematical Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Mathematical formulas and symbols */}
          <div className="absolute top-20 left-10 text-blue-400 dark:text-blue-600 text-2xl font-mono animate-float-slow opacity-40">
            ∫f(x)dx
          </div>
          <div className="absolute top-32 right-20 text-purple-500 dark:text-purple-600 text-lg font-mono animate-float-medium opacity-45">
            x² + y² = r²
          </div>
          <div className="absolute top-48 left-1/4 text-green-500 dark:text-green-600 text-xl font-mono animate-float-fast opacity-40">
            ∑(n=1 to ∞)
          </div>
          <div className="absolute top-64 right-1/3 text-orange-500 dark:text-orange-600 text-lg font-mono animate-float-slow opacity-45">
            lim(x→∞)
          </div>
          <div className="absolute top-80 left-16 text-pink-500 dark:text-pink-600 text-2xl font-mono animate-float-medium opacity-40">
            π = 3.14159...
          </div>
          <div className="absolute top-96 right-12 text-indigo-500 dark:text-indigo-600 text-lg font-mono animate-float-fast opacity-45">
            e^(iπ) + 1 = 0
          </div>
          <div className="absolute top-40 left-1/2 text-cyan-500 dark:text-cyan-600 text-xl font-mono animate-float-slow opacity-40">
            √(a² + b²)
          </div>
          <div className="absolute top-72 left-1/3 text-yellow-500 dark:text-yellow-600 text-lg font-mono animate-float-medium opacity-45">
            sin²θ + cos²θ = 1
          </div>
          <div className="absolute top-24 right-1/4 text-red-500 dark:text-red-600 text-xl font-mono animate-float-fast opacity-40">
            ∂f/∂x
          </div>
          <div className="absolute top-56 right-16 text-teal-500 dark:text-teal-600 text-lg font-mono animate-float-slow opacity-45">
            log₂(x)
          </div>
          
          {/* Geometric shapes */}
          <div className="absolute top-16 left-1/3 w-8 h-8 border-2 border-blue-500 dark:border-blue-600 rotate-45 animate-spin-slow opacity-40"></div>
          <div className="absolute top-44 right-1/4 w-6 h-6 bg-purple-500 dark:bg-purple-600 rounded-full animate-pulse opacity-45"></div>
          <div className="absolute top-68 left-20 w-10 h-10 border-2 border-green-500 dark:border-green-600 transform rotate-12 animate-bounce-subtle opacity-40"></div>
          <div className="absolute top-84 right-20 w-4 h-12 bg-orange-500 dark:bg-orange-600 transform rotate-45 animate-float-medium opacity-45"></div>
          <div className="absolute top-28 left-2/3 w-6 h-6 border-2 border-pink-500 dark:border-pink-600 rounded-full animate-spin-slow opacity-40"></div>
          <div className="absolute top-52 right-1/3 w-8 h-8 bg-indigo-500 dark:bg-indigo-600 transform rotate-45 animate-pulse opacity-45"></div>
          
          {/* Mathematical symbols */}
          <div className="absolute top-36 left-12 text-4xl text-cyan-500 dark:text-cyan-600 animate-float-fast opacity-40">
            ∞
          </div>
          <div className="absolute top-60 right-24 text-3xl text-yellow-500 dark:text-yellow-600 animate-float-slow opacity-45">
            Σ
          </div>
          <div className="absolute top-76 left-1/4 text-2xl text-red-500 dark:text-red-600 animate-float-medium opacity-40">
            ∆
          </div>
          <div className="absolute top-88 right-1/4 text-3xl text-teal-500 dark:text-teal-600 animate-float-fast opacity-45">
            ∇
          </div>
          <div className="absolute top-20 left-3/4 text-2xl text-purple-500 dark:text-purple-600 animate-float-slow opacity-40">
            ∂
          </div>
          
          {/* Additional geometric elements */}
          <div className="absolute top-32 left-1/2 w-12 h-1 bg-blue-500 dark:bg-blue-600 transform rotate-30 animate-float-medium opacity-40"></div>
          <div className="absolute top-48 right-12 w-1 h-12 bg-green-500 dark:bg-green-600 transform rotate-60 animate-float-slow opacity-45"></div>
          <div className="absolute top-64 left-8 w-6 h-6 border-l-2 border-b-2 border-orange-500 dark:border-orange-600 transform rotate-45 animate-bounce-subtle opacity-40"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm font-medium mb-8">
              <SparklesIcon className="h-4 w-4 mr-2" />
              AI-Powered Evaluation System
            </div>
            
            <h1 className={`text-4xl md:text-6xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-6`}>
              <span className="inline-block group cursor-default">
                {['Transform', 'Your'].map((word, index) => (
                  <span
                    key={index}
                    className="inline-block mr-4 group-hover:animate-bounce transition-all duration-300"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {word}
                  </span>
                ))}
               {['Exam', 'Grading'].map((word, index) => (
                <span
                  key={index}
                  className="inline-block mr-4 group-hover:animate-bounce transition-all duration-300 bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent"
                  style={{ animationDelay: `${(index + 2) * 0.1}s` }}
                >
                  {word}
                </span>
                ))}

                {['with', 'AI'].map((word, index) => (
                  <span
                    key={index}
                    className="inline-block mr-4 group-hover:animate-bounce transition-all duration-300"
                    style={{ animationDelay: `${(index + 4) * 0.1}s` }}
                  >
                    {word}
                  </span>
                ))}
              </span>
            </h1>
            
            <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-8 max-w-3xl mx-auto`}>
              Revolutionize subjective exam evaluation with our advanced AI system. Save time, ensure consistency,
              and provide detailed feedback that helps students learn and improve.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                to="/register"
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center transform hover:scale-105"
              >
                Get Started Free
                <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/pricing"
                className={`px-8 py-4 ${isDark ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'} font-semibold rounded-lg transition-all duration-300 transform hover:scale-105`}
              >
                View Pricing
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                    {stat.number}
                  </div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={`py-20 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
              Powerful Features for Modern Education
            </h2>
            <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto`}>
              Everything you need to streamline exam evaluation and enhance student learning
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group p-8 rounded-xl ${isDark ? 'bg-gray-900 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'} shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2`}
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h3 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-3`}>
                  {feature.title}
                </h3>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={`py-20 ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
              What Our Users Say
            </h2>
            <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto`}>
              Trusted by thousands of educators worldwide
            </p>
          </div>

          {/* Infinite Scrolling Reviews */}
          <div className="relative overflow-hidden">
            <div className="flex animate-scroll-infinite space-x-8">
              {/* First set of reviews */}
              {[
                {
                  name: 'Dr. Sarah Mitchell',
                  role: 'Professor of Literature',
                  avatar: 'https://images.pexels.com/photos/3184460/pexels-photo-3184460.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
                  content: 'ExamEval has revolutionized how I grade essays. The detailed feedback is incredibly helpful for students.',
                  rating: 5,
                },
                {
                  name: 'Mark Johnson',
                  role: 'High School Teacher',
                  avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
                  content: 'I save 15 hours per week on grading. The consistency and quality of AI evaluation is impressive.',
                  rating: 5,
                },
                {
                  name: 'Emily Chen',
                  role: 'University Lecturer',
                  avatar: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
                  content: 'Students love the immediate feedback. It helps them understand their mistakes and improve faster.',
                  rating: 5,
                },
                {
                  name: 'Dr. Michael Rodriguez',
                  role: 'Mathematics Professor',
                  avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
                  content: 'The AI understands mathematical concepts remarkably well. It has transformed my assessment process.',
                  rating: 5,
                },
                {
                  name: 'Lisa Thompson',
                  role: 'Science Department Head',
                  avatar: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
                  content: 'ExamEval provides consistent grading across all our teachers. The analytics help us improve our curriculum.',
                  rating: 5,
                },
              ].map((review, index) => (
                <div
                  key={index}
                  className={`flex-shrink-0 w-80 p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
                >
                  <div className="flex items-center mb-4">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {review.name}
                      </h4>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {review.role}
                      </p>
                    </div>
                  </div>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                    "{review.content}"
                  </p>
                  <div className="flex">
                    {[...Array(review.rating)].map((_, i) => (
                      <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              ))}
              
              {/* Duplicate set for infinite scroll */}
              {[
                {
                  name: 'Dr. Sarah Mitchell',
                  role: 'Professor of Literature',
                  avatar: 'https://images.pexels.com/photos/3184460/pexels-photo-3184460.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
                  content: 'ExamEval has revolutionized how I grade essays. The detailed feedback is incredibly helpful for students.',
                  rating: 5,
                },
                {
                  name: 'Mark Johnson',
                  role: 'High School Teacher',
                  avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
                  content: 'I save 15 hours per week on grading. The consistency and quality of AI evaluation is impressive.',
                  rating: 5,
                },
                {
                  name: 'Emily Chen',
                  role: 'University Lecturer',
                  avatar: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
                  content: 'Students love the immediate feedback. It helps them understand their mistakes and improve faster.',
                  rating: 5,
                },
                {
                  name: 'Dr. Michael Rodriguez',
                  role: 'Mathematics Professor',
                  avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
                  content: 'The AI understands mathematical concepts remarkably well. It has transformed my assessment process.',
                  rating: 5,
                },
                {
                  name: 'Lisa Thompson',
                  role: 'Science Department Head',
                  avatar: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
                  content: 'ExamEval provides consistent grading across all our teachers. The analytics help us improve our curriculum.',
                  rating: 5,
                },
              ].map((review, index) => (
                <div
                  key={`duplicate-${index}`}
                  className={`flex-shrink-0 w-80 p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
                >
                  <div className="flex items-center mb-4">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h4 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {review.name}
                      </h4>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {review.role}
                      </p>
                    </div>
                  </div>
                  <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                    "{review.content}"
                  </p>
                  <div className="flex">
                    {[...Array(review.rating)].map((_, i) => (
                      <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={`py-20 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
              How It Works
            </h2>
            <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto`}>
              Simple, efficient process that transforms your evaluation workflow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Upload Content', desc: 'Upload question papers and model answers', icon: DocumentTextIcon },
              { step: '02', title: 'AI Analysis', desc: 'AI evaluates student responses against rubrics', icon: BrainIcon },
              { step: '03', title: 'Generate Scores', desc: 'Detailed scores and feedback are generated', icon: ChartBarIcon },
              { step: '04', title: 'Review & Finalize', desc: 'Teachers review and adjust final grades', icon: CheckCircleIcon },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg`}>
                  <item.icon className="h-8 w-8" />
                </div>
                <div className={`text-sm font-semibold ${isDark ? 'text-blue-400' : 'text-blue-600'} mb-2`}>
                  {item.step}
                </div>
                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                  {item.title}
                </h3>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;