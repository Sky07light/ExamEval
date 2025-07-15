import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import {
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const ChatAssistant = () => {
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: "Hi! I'm ExamEval Assistant. How can I help you today? You can ask me about our features, pricing, or how to get started!",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');

  const predefinedResponses = {
    'how does it work': "ExamEval uses advanced AI to evaluate subjective exam answers. Simply upload your question papers and model answers, then let our AI grade student responses with detailed feedback!",
    'pricing': "We offer three plans: Free (10 evaluations/month), Professional ($29/month for 500 evaluations), and Enterprise ($99/month for unlimited evaluations). Check our pricing page for full details!",
    'features': "Our key features include AI-powered grading, detailed feedback, analytics dashboard, bulk upload, custom rubrics, and support for both handwritten and typed answers.",
    'getting started': "Getting started is easy! Sign up for a free account, choose your role (teacher or student), upload your first exam materials, and let our AI do the rest!",
    'support': "We offer email support for free users, priority support for Professional users, and 24/7 phone support for Enterprise customers.",
    'accuracy': "Our AI achieves high accuracy by using advanced language models and can be fine-tuned with your specific rubrics and grading criteria.",
    'formats': "We support PDF, DOC, DOCX, JPG, PNG, and JPEG files. Our OCR technology can read handwritten answers too!",
    'security': "Your data is secure with enterprise-grade encryption, regular backups, and SOC 2 compliance. We never share your exam content.",
    'default': "That's a great question! While I'm still learning, I'd recommend checking our documentation or contacting our support team for detailed assistance. Is there anything specific about ExamEval's features or pricing I can help with?"
  };

  const getResponse = (userMessage) => {
    const message = userMessage.toLowerCase();

    for (const [key, response] of Object.entries(predefinedResponses)) {
      if (key !== 'default' && message.includes(key)) {
        return response;
      }
    }

    return predefinedResponses.default;
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        text: getResponse(inputText),
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);

    setInputText('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickQuestions = [
    "How does it work?",
    "What's the pricing?",
    "What features do you offer?",
    "How do I get started?",
    "Is my data secure?"
  ];

  const handleQuickQuestion = (question) => {
    setInputText(question);
  };

  return (
    <>
      {isOpen && (
        <div className={`fixed bottom-24 right-6 w-80 h-96 ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl border ${isDark ? 'border-gray-700' : 'border-gray-200'} flex flex-col z-50 animate-slide-up`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <SparklesIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  ExamEval Assistant
                </h3>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Online now
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className={`p-1 rounded-full ${isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'} transition-colors`}
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                    message.isUser
                      ? 'bg-blue-600 text-white'
                      : isDark
                        ? 'bg-gray-700 text-gray-200'
                        : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="px-4 pb-2">
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
                Quick questions:
              </p>
              <div className="flex flex-wrap gap-1">
                {quickQuestions.slice(0, 3).map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question)}
                    className={`text-xs px-2 py-1 rounded-full ${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} transition-colors`}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className={`flex-1 px-3 py-2 text-sm border rounded-lg ${isDark ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                className={`p-2 rounded-lg transition-colors ${
                  inputText.trim()
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : isDark
                      ? 'bg-gray-700 text-gray-500'
                      : 'bg-gray-200 text-gray-400'
                }`}
              >
                <PaperAirplaneIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-50 ${isOpen ? 'rotate-180' : 'hover:scale-110'}`}
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <ChatBubbleLeftRightIcon className="h-6 w-6" />
        )}
      </button>
    </>
  );
};

export default ChatAssistant;