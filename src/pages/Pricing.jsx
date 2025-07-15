import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Link } from 'react-router-dom';
import { 
  CheckIcon, 
  XMarkIcon,
  StarIcon,
  BoltIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';

const Pricing = () => {
  const { isDark } = useTheme();

  const plans = [
    {
      name: 'Free',
      price: '₹0',
      period: 'forever',
      description: 'Perfect for trying out EvalAI',
      icon: StarIcon,
      color: 'gray',
      popular: false,
      features: [
        { name: 'Up to 10 evaluations per month', included: true },
        { name: 'Basic AI feedback', included: true },
        { name: 'Standard upload formats', included: true },
        { name: 'Email support', included: true },
        { name: 'Analytics dashboard', included: false },
        { name: 'Bulk upload', included: false },
        { name: 'Custom rubrics', included: false },
        { name: 'API access', included: false },
      ],
    },
    {
      name: 'Professional',
      price: '₹199',
      period: 'per month',
      description: 'Ideal for individual teachers and small teams',
      icon: BoltIcon,
      color: 'blue',
      popular: true,
      features: [
        { name: 'Up to 500 evaluations per month', included: true },
        { name: 'Advanced AI feedback with suggestions', included: true },
        { name: 'All upload formats including handwriting', included: true },
        { name: 'Priority email support', included: true },
        { name: 'Detailed analytics dashboard', included: true },
        { name: 'Bulk upload (up to 50 files)', included: true },
        { name: 'Custom rubrics and grading scales', included: true },
        { name: 'API access', included: false },
      ],
    },
    {
      name: 'Enterprise',
      price: '₹999',
      period: 'per month',
      description: 'For institutions and large organizations',
      icon: RocketLaunchIcon,
      color: 'purple',
      popular: false,
      features: [
        { name: 'Unlimited evaluations', included: true },
        { name: 'Advanced AI with custom models', included: true },
        { name: 'All formats + OCR optimization', included: true },
        { name: '24/7 phone & email support', included: true },
        { name: 'Advanced analytics & reporting', included: true },
        { name: 'Unlimited bulk upload', included: true },
        { name: 'Advanced custom rubrics', included: true },
        { name: 'Full API access', included: true },
      ],
    },
  ];

  const features = [
    {
      category: 'Evaluation Features',
      items: [
        { name: 'AI-Powered Grading', free: true, pro: true, enterprise: true },
        { name: 'Detailed Feedback', free: 'Basic', pro: 'Advanced', enterprise: 'Premium' },
        { name: 'Multiple Question Types', free: true, pro: true, enterprise: true },
        { name: 'Custom Rubrics', free: false, pro: true, enterprise: true },
        { name: 'Plagiarism Detection', free: false, pro: false, enterprise: true },
      ]
    },
    {
      category: 'Upload & Processing',
      items: [
        { name: 'File Upload Limit', free: '10MB', pro: '100MB', enterprise: 'Unlimited' },
        { name: 'Supported Formats', free: 'PDF, DOC', pro: 'All formats', enterprise: 'All + OCR' },
        { name: 'Batch Processing', free: false, pro: 'Up to 50', enterprise: 'Unlimited' },
        { name: 'Handwriting Recognition', free: false, pro: true, enterprise: true },
      ]
    },
    {
      category: 'Analytics & Reporting',
      items: [
        { name: 'Basic Analytics', free: true, pro: true, enterprise: true },
        { name: 'Student Progress Tracking', free: false, pro: true, enterprise: true },
        { name: 'Class Performance Reports', free: false, pro: true, enterprise: true },
        { name: 'Custom Reports', free: false, pro: false, enterprise: true },
        { name: 'Data Export', free: false, pro: 'CSV', enterprise: 'All formats' },
      ]
    },
    {
      category: 'Support & Integration',
      items: [
        { name: 'Email Support', free: 'Standard', pro: 'Priority', enterprise: '24/7' },
        { name: 'Phone Support', free: false, pro: false, enterprise: true },
        { name: 'API Access', free: false, pro: false, enterprise: true },
        { name: 'LMS Integration', free: false, pro: 'Basic', enterprise: 'Advanced' },
        { name: 'SSO Support', free: false, pro: false, enterprise: true },
      ]
    }
  ];

  const getColorClasses = (color, variant = 'medium') => {
    const colors = {
      gray: {
        light: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
        medium: 'bg-gray-600 text-white',
        dark: 'bg-gray-800 text-white'
      },
      blue: {
        light: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
        medium: 'bg-blue-600 text-white',
        dark: 'bg-blue-800 text-white'
      },
      purple: {
        light: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
        medium: 'bg-purple-600 text-white',
        dark: 'bg-purple-800 text-white'
      }
    };
    return colors[color]?.[variant] || colors.blue[variant];
  };

  const renderFeatureValue = (value) => {
    if (typeof value === 'boolean') {
      return value ? (
        <CheckIcon className="h-5 w-5 text-green-500" />
      ) : (
        <XMarkIcon className="h-5 w-5 text-gray-400" />
      );
    }
    return <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{value}</span>;
  };

  return (
    <div className={`min-h-screen pt-16 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className={`text-4xl md:text-5xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
            Simple, Transparent Pricing
          </h1>
          <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto`}>
            Choose the perfect plan for your needs. Upgrade or downgrade at any time.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-8 ${
                plan.popular ? 'ring-2 ring-blue-500 transform scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <div className={`inline-flex p-3 rounded-full ${getColorClasses(plan.color, 'light')} mb-4`}>
                  <plan.icon className="h-8 w-8" />
                </div>
                <h3 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                  {plan.name}
                </h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                  {plan.description}
                </p>
                <div className="flex items-baseline justify-center">
                  <span className={`text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {plan.price}
                  </span>
                  <span className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'} ml-2`}>
                    {plan.period}
                  </span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    {feature.included ? (
                      <CheckIcon className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    ) : (
                      <XMarkIcon className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${
                      feature.included 
                        ? isDark ? 'text-gray-300' : 'text-gray-700'
                        : isDark ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                to="/register"
                className={`block w-full text-center py-3 px-6 rounded-lg font-semibold transition-colors ${
                  plan.popular
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : isDark
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                Get Started
              </Link>
            </div>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl overflow-hidden`}>
          <div className="px-8 py-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Compare All Features
            </h2>
            <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Detailed comparison of all features across plans
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                  <th className={`px-8 py-4 text-left text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                    Feature
                  </th>
                  <th className={`px-6 py-4 text-center text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                    Free
                  </th>
                  <th className={`px-6 py-4 text-center text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                    Professional
                  </th>
                  <th className={`px-6 py-4 text-center text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider`}>
                    Enterprise
                  </th>
                </tr>
              </thead>
              <tbody className={`${isDark ? 'bg-gray-800' : 'bg-white'} divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                {features.map((category, categoryIndex) => (
                  <React.Fragment key={categoryIndex}>
                    <tr>
                      <td colSpan={4} className={`px-8 py-4 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {category.category}
                        </h3>
                      </td>
                    </tr>
                    {category.items.map((item, itemIndex) => (
                      <tr key={itemIndex}>
                        <td className={`px-8 py-4 text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {item.name}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {renderFeatureValue(item.free)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {renderFeatureValue(item.pro)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          {renderFeatureValue(item.enterprise)}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'} text-center mb-12`}>
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                question: 'Can I change my plan at any time?',
                answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and billing is prorated.'
              },
              {
                question: 'Is there a free trial for paid plans?',
                answer: 'Yes, all paid plans come with a 14-day free trial. No credit card required to start your trial.'
              },
              {
                question: 'What payment methods do you accept?',
                answer: 'We accept all major credit cards, PayPal, and bank transfers for enterprise customers.'
              },
              {
                question: 'Do you offer discounts for educational institutions?',
                answer: 'Yes, we offer special pricing for educational institutions. Contact our sales team for more information.'
              },
              {
                question: 'What happens if I exceed my plan limits?',
                answer: 'You\'ll receive notifications when approaching limits. You can upgrade your plan or purchase additional credits.'
              },
              {
                question: 'Is my data secure?',
                answer: 'Yes, we use enterprise-grade security measures including encryption, regular backups, and SOC 2 compliance.'
              },
            ].map((faq, index) => (
              <div key={index} className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg p-6 shadow-lg`}>
                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                  {faq.question}
                </h3>
                <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 rounded-2xl p-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of educators who are transforming their grading process with AI-powered evaluation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
              >
                Start Free Trial
              </Link>
              <button className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;