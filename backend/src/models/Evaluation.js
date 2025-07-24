import mongoose from 'mongoose';

const answerEvaluationSchema = new mongoose.Schema({
  questionNumber: {
    type: String,
    required: true
  },
  studentAnswer: {
    type: String,
    required: true
  },
  marksAwarded: {
    type: Number,
    required: true,
    min: 0
  },
  maxMarks: {
    type: Number,
    required: true,
    min: 0
  },
  feedback: {
    type: String,
    required: true
  },
  strengths: [{
    type: String,
    trim: true
  }],
  improvements: [{
    type: String,
    trim: true
  }],
  keywordMatches: [{
    keyword: String,
    found: Boolean,
    context: String
  }],
  aiConfidence: {
    type: Number,
    min: 0,
    max: 1,
    default: 0
  },
  evaluationTime: {
    type: Number, // in milliseconds
    default: 0
  }
});

const evaluationSchema = new mongoose.Schema({
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  evaluatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  answers: [answerEvaluationSchema],
  totalMarksAwarded: {
    type: Number,
    required: true,
    min: 0
  },
  totalMaxMarks: {
    type: Number,
    required: true,
    min: 0
  },
  percentage: {
    type: Number,
    min: 0,
    max: 100
  },
  grade: {
    type: String,
    enum: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'F'],
    required: true
  },
  overallFeedback: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'reviewed'],
    default: 'pending'
  },
  evaluationMethod: {
    type: String,
    enum: ['ai', 'manual', 'hybrid'],
    default: 'ai'
  },
  aiMetrics: {
    processingTime: Number, // in milliseconds
    modelUsed: String,
    averageConfidence: Number,
    flaggedForReview: { type: Boolean, default: false },
    reviewReason: String
  },
  files: [{
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    mimetype: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  submittedAt: {
    type: Date,
    default: Date.now
  },
  evaluatedAt: {
    type: Date
  },
  publishedAt: {
    type: Date
  },
  isPublished: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
evaluationSchema.index({ exam: 1, student: 1 }, { unique: true });
evaluationSchema.index({ student: 1 });
evaluationSchema.index({ evaluatedBy: 1 });
evaluationSchema.index({ status: 1 });
evaluationSchema.index({ submittedAt: 1 });

// Virtual for performance level
evaluationSchema.virtual('performanceLevel').get(function() {
  if (this.percentage >= 90) return 'excellent';
  if (this.percentage >= 80) return 'good';
  if (this.percentage >= 70) return 'average';
  if (this.percentage >= 60) return 'below_average';
  return 'poor';
});

// Calculate percentage and grade before saving
evaluationSchema.pre('save', function(next) {
  if (this.totalMaxMarks > 0) {
    this.percentage = Math.round((this.totalMarksAwarded / this.totalMaxMarks) * 100 * 100) / 100;
    
    // Calculate grade based on percentage
    if (this.percentage >= 97) this.grade = 'A+';
    else if (this.percentage >= 93) this.grade = 'A';
    else if (this.percentage >= 90) this.grade = 'A-';
    else if (this.percentage >= 87) this.grade = 'B+';
    else if (this.percentage >= 83) this.grade = 'B';
    else if (this.percentage >= 80) this.grade = 'B-';
    else if (this.percentage >= 77) this.grade = 'C+';
    else if (this.percentage >= 73) this.grade = 'C';
    else if (this.percentage >= 70) this.grade = 'C-';
    else if (this.percentage >= 60) this.grade = 'D';
    else this.grade = 'F';
  }
  
  if (this.status === 'completed' && !this.evaluatedAt) {
    this.evaluatedAt = new Date();
  }
  
  next();
});

export default mongoose.model('Evaluation', evaluationSchema);