import OpenAI from 'openai';
import ErrorResponse from '../utils/errorResponse.js';

class AIService {
  constructor() {
    this.openai = null;
    this.geminiApiKey = process.env.GEMINI_API_KEY;
    
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }
  }

  /**
   * Evaluate a student's answer using AI
   * @param {Object} evaluationData - The evaluation data
   * @param {string} evaluationData.studentAnswer - Student's answer
   * @param {string} evaluationData.modelAnswer - Model/correct answer
   * @param {string} evaluationData.question - The question
   * @param {number} evaluationData.maxMarks - Maximum marks for the question
   * @param {string} evaluationData.rubric - Evaluation rubric
   * @param {string} evaluationData.subject - Subject of the question
   * @returns {Object} Evaluation result
   */
  async evaluateAnswer(evaluationData) {
    try {
      const {
        studentAnswer,
        modelAnswer,
        question,
        maxMarks,
        rubric,
        subject = 'General'
      } = evaluationData;

      // Use OpenAI if available, otherwise use Gemini
      if (this.openai) {
        return await this.evaluateWithOpenAI(evaluationData);
      } else if (this.geminiApiKey) {
        return await this.evaluateWithGemini(evaluationData);
      } else {
        // Fallback to rule-based evaluation
        return this.fallbackEvaluation(evaluationData);
      }
    } catch (error) {
      console.error('AI Evaluation Error:', error);
      throw new ErrorResponse('Failed to evaluate answer', 500);
    }
  }

  /**
   * Evaluate using OpenAI GPT
   */
  async evaluateWithOpenAI(evaluationData) {
    const {
      studentAnswer,
      modelAnswer,
      question,
      maxMarks,
      rubric,
      subject
    } = evaluationData;

    const prompt = this.buildEvaluationPrompt(evaluationData);

    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert educational evaluator. Provide fair, consistent, and detailed evaluations of student answers."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1000
    });

    const evaluation = response.choices[0].message.content;
    return this.parseEvaluationResponse(evaluation, maxMarks);
  }

  /**
   * Evaluate using Gemini API
   */
  async evaluateWithGemini(evaluationData) {
    const prompt = this.buildEvaluationPrompt(evaluationData);
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 1000,
        }
      })
    });

    if (!response.ok) {
      throw new Error('Gemini API request failed');
    }

    const data = await response.json();
    const evaluation = data.candidates[0].content.parts[0].text;
    return this.parseEvaluationResponse(evaluation, evaluationData.maxMarks);
  }

  /**
   * Fallback evaluation when AI services are not available
   */
  fallbackEvaluation(evaluationData) {
    const { studentAnswer, modelAnswer, maxMarks } = evaluationData;

    // Simple keyword matching and length-based scoring
    const studentWords = studentAnswer.toLowerCase().split(/\s+/);
    const modelWords = modelAnswer.toLowerCase().split(/\s+/);
    
    let matchCount = 0;
    modelWords.forEach(word => {
      if (studentWords.includes(word) && word.length > 3) {
        matchCount++;
      }
    });

    const similarity = matchCount / modelWords.length;
    const marks = Math.round(similarity * maxMarks);

    return {
      marks: Math.min(marks, maxMarks),
      feedback: "Automated evaluation based on keyword matching. Manual review recommended.",
      strengths: similarity > 0.7 ? ["Good coverage of key concepts"] : [],
      improvements: similarity < 0.5 ? ["Include more relevant details", "Address key concepts more thoroughly"] : [],
      confidence: 0.6
    };
  }

  /**
   * Build evaluation prompt for AI services
   */
  buildEvaluationPrompt(evaluationData) {
    const {
      studentAnswer,
      modelAnswer,
      question,
      maxMarks,
      rubric,
      subject
    } = evaluationData;

    return `
Subject: ${subject}
Question: ${question}
Maximum Marks: ${maxMarks}

Model Answer:
${modelAnswer}

Student Answer:
${studentAnswer}

${rubric ? `Rubric: ${rubric}` : ''}

Please evaluate the student's answer and provide:
1. Marks out of ${maxMarks}
2. Detailed feedback
3. Strengths identified in the answer
4. Areas for improvement
5. Confidence level (0.0 to 1.0)

Format your response as JSON:
{
  "marks": number,
  "feedback": "string",
  "strengths": ["string"],
  "improvements": ["string"],
  "confidence": number
}
`;
  }

  /**
   * Parse AI evaluation response
   */
  parseEvaluationResponse(response, maxMarks) {
    try {
      // Try to extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          marks: Math.min(Math.max(parsed.marks || 0, 0), maxMarks),
          feedback: parsed.feedback || "No feedback provided",
          strengths: parsed.strengths || [],
          improvements: parsed.improvements || [],
          confidence: parsed.confidence || 0.8
        };
      }
    } catch (error) {
      console.error('Failed to parse AI response:', error);
    }

    // Fallback parsing if JSON extraction fails
    return {
      marks: Math.round(maxMarks * 0.7), // Default to 70%
      feedback: response,
      strengths: [],
      improvements: [],
      confidence: 0.5
    };
  }

  /**
   * Batch evaluate multiple answers
   */
  async batchEvaluate(evaluations) {
    const results = [];
    
    for (const evaluation of evaluations) {
      try {
        const result = await this.evaluateAnswer(evaluation);
        results.push({
          questionId: evaluation.questionId,
          ...result
        });
      } catch (error) {
        results.push({
          questionId: evaluation.questionId,
          marks: 0,
          feedback: "Evaluation failed",
          strengths: [],
          improvements: ["Technical error occurred during evaluation"],
          confidence: 0.0
        });
      }
    }

    return results;
  }

  /**
   * Generate feedback summary for an exam
   */
  async generateExamSummary(evaluations) {
    const totalMarks = evaluations.reduce((sum, eval) => sum + eval.maxMarks, 0);
    const obtainedMarks = evaluations.reduce((sum, eval) => sum + (eval.marks || 0), 0);
    const percentage = (obtainedMarks / totalMarks) * 100;

    let grade = 'F';
    if (percentage >= 90) grade = 'A+';
    else if (percentage >= 80) grade = 'A';
    else if (percentage >= 70) grade = 'B';
    else if (percentage >= 60) grade = 'C';
    else if (percentage >= 50) grade = 'D';

    const strengths = [];
    const improvements = [];
    
    evaluations.forEach(eval => {
      if (eval.strengths) strengths.push(...eval.strengths);
      if (eval.improvements) improvements.push(...eval.improvements);
    });

    return {
      totalMarks,
      obtainedMarks,
      percentage: Math.round(percentage * 100) / 100,
      grade,
      overallFeedback: this.generateOverallFeedback(percentage),
      strengths: [...new Set(strengths)].slice(0, 5),
      improvements: [...new Set(improvements)].slice(0, 5)
    };
  }

  generateOverallFeedback(percentage) {
    if (percentage >= 90) {
      return "Excellent performance! You have demonstrated mastery of the subject matter.";
    } else if (percentage >= 80) {
      return "Very good work! You show strong understanding with minor areas for improvement.";
    } else if (percentage >= 70) {
      return "Good performance! You have a solid grasp of the concepts with some room for growth.";
    } else if (percentage >= 60) {
      return "Satisfactory work. Focus on strengthening your understanding of key concepts.";
    } else if (percentage >= 50) {
      return "You're on the right track but need to improve your understanding of fundamental concepts.";
    } else {
      return "Significant improvement needed. Consider reviewing the material and seeking additional help.";
    }
  }
}

export default new AIService();