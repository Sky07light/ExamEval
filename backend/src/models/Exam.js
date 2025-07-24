import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  questionNumber: {
    type: String,
    required: true
  },
  questionText: {
    type: String,
    required: true
  },
  marks: {
    type: Number,
    required: true,
    min: 0
  },
  modelAnswer: {
    type: String,
    required: true
  },
  rubric: {
    type: String
  },
  keywords: [{
    type: String,
    trim: true
  }],
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  }
});

const examSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide exam title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  subject: {
    type: String,
    required: [true, 'Please provide subject'],
    trim: true
  },
  class: {
    type: String,
    required: [true, 'Please provide class'],
    trim: true
  },
  section: {
    type: String,
    trim: true
  },
  duration: {
    type: Number, // in minutes
    required: [true, 'Please provide exam duration']
  },
  totalMarks: {
    type: Number,
    required: [true, 'Please provide total marks'],
    min: 0
  },
  questions: [questionSchema],
  instructions: {
    type: String,
    trim: true
  },
  examDate: {
    type: Date,
    required: [true, 'Please provide exam date']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  evaluationSettings: {
    strictness: {
      type: String,
      enum: ['lenient', 'moderate', 'strict'],
      default: 'moderate'
    },
    partialMarking: {
      type: Boolean,
      default: true
    },
    negativeMarking: {
      type: Boolean,
      default: false
    },
    autoPublishResults: {
      type: Boolean,
      default: false
    }
  },
  files: [{
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    mimetype: String,
    uploadedAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
examSchema.index({ createdBy: 1 });
examSchema.index({ subject: 1 });
examSchema.index({ class: 1, section: 1 });
examSchema.index({ examDate: 1 });
examSchema.index({ isActive: 1 });

// Virtual for question count
examSchema.virtual('questionCount').get(function() {
  return this.questions.length;
});

// Virtual for average marks per question
examSchema.virtual('averageMarksPerQuestion').get(function() {
  if (this.questions.length === 0) return 0;
  return this.totalMarks / this.questions.length;
});

// Calculate total marks from questions
examSchema.pre('save', function(next) {
  if (this.questions && this.questions.length > 0) {
    this.totalMarks = this.questions.reduce((total, question) => total + question.marks, 0);
  }
  next();
});

export default mongoose.model('Exam', examSchema);