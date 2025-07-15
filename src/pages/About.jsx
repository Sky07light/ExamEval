import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const About = () => {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-8 ${isDark ? 'bg-gray-900 text-gray-200' : 'bg-white text-gray-800'}`}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">
          About ExamEval
        </h1>

        <p className="text-lg mb-6 text-center max-w-3xl mx-auto">
          Your smart grading assistant, giving students the feedback they need while saving you hours.
        </p>


        <div className={`rounded-xl shadow-lg p-8 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <h2 className="text-2xl font-semibold mb-4">What It Is</h2>
          <p className="mb-4">
            ExamEval helps teachers and institutes automatically evaluate subjective answers. It uses advanced AI (Gemini API) to compare student submissions with model answers, assigning scores and providing actionable feedback on accuracy, missing points, and areas for improvement.
          </p>

          <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
          <ul className="list-disc pl-6 mb-4 space-y-2">
            <li>Teachers upload questions with model answers.</li>
            <li>Students submit their typed or handwritten responses.</li>
            <li>AI evaluates responses against rubric criteria, assigning section-wise scores and detailed feedback.</li>
            <li>Teachers can review and adjust scores or feedback if needed.</li>
            <li>Progress and analytics are stored for tracking student performance over time.</li>
          </ul>

          <h2 className="text-2xl font-semibold mb-4">Purpose</h2>
          <p>
            ExamEval saves teachers countless hours while providing students with meaningful, detailed feedback—not just marks. It makes subjective evaluation faster, consistent, and insightful, supporting better learning outcomes for students and a smoother workflow for educators.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
