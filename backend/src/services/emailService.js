import nodemailer from 'nodemailer';
import ErrorResponse from '../utils/errorResponse.js';

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('📧 Email service disabled - SMTP configuration not found');
      return;
    }

    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Verify connection configuration
    this.transporter.verify((error, success) => {
      if (error) {
        console.error('📧 Email service initialization failed:', error);
      } else {
        console.log('📧 Email service initialized successfully');
      }
    });
  }

  async sendEmail(options) {
    if (!this.transporter) {
      console.log('📧 Email service not configured - skipping email send');
      return;
    }

    try {
      const mailOptions = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log('📧 Email sent successfully:', info.messageId);
      return info;
    } catch (error) {
      console.error('📧 Email send failed:', error);
      throw new ErrorResponse('Failed to send email', 500);
    }
  }

  async sendWelcomeEmail(user) {
    const subject = 'Welcome to ExamEval!';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">Welcome to ExamEval</h1>
        </div>
        <div style="padding: 30px; background-color: #f9f9f9;">
          <h2 style="color: #333;">Hello ${user.name}!</h2>
          <p style="color: #666; line-height: 1.6;">
            Welcome to ExamEval, the AI-powered exam evaluation system. Your account has been successfully created as a <strong>${user.role}</strong>.
          </p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Getting Started:</h3>
            <ul style="color: #666; line-height: 1.8;">
              ${user.role === 'teacher' ? `
                <li>Create your first exam</li>
                <li>Add questions with model answers</li>
                <li>Invite students to take the exam</li>
                <li>Review AI-generated evaluations</li>
              ` : `
                <li>Check for available exams</li>
                <li>Submit your answers</li>
                <li>View detailed feedback</li>
                <li>Track your progress</li>
              `}
            </ul>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block;">
              Get Started
            </a>
          </div>
          <p style="color: #999; font-size: 14px; text-align: center;">
            If you have any questions, feel free to contact our support team.
          </p>
        </div>
      </div>
    `;

    return await this.sendEmail({
      to: user.email,
      subject,
      html
    });
  }

  async sendExamNotification(student, exam, teacher) {
    const subject = `New Exam Available: ${exam.title}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">📝 New Exam Available</h1>
        </div>
        <div style="padding: 30px; background-color: #f9f9f9;">
          <h2 style="color: #333;">Hello ${student.name}!</h2>
          <p style="color: #666; line-height: 1.6;">
            A new exam has been assigned to you by ${teacher.name}.
          </p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">${exam.title}</h3>
            <p style="color: #666;"><strong>Subject:</strong> ${exam.subject}</p>
            <p style="color: #666;"><strong>Duration:</strong> ${exam.duration} minutes</p>
            <p style="color: #666;"><strong>Total Questions:</strong> ${exam.questions.length}</p>
            <p style="color: #666;"><strong>Due Date:</strong> ${new Date(exam.dueDate).toLocaleDateString()}</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/student/exams/${exam._id}" style="background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block;">
              Take Exam
            </a>
          </div>
        </div>
      </div>
    `;

    return await this.sendEmail({
      to: student.email,
      subject,
      html
    });
  }

  async sendEvaluationComplete(student, exam, evaluation) {
    const subject = `Exam Results: ${exam.title}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">📊 Exam Results Ready</h1>
        </div>
        <div style="padding: 30px; background-color: #f9f9f9;">
          <h2 style="color: #333;">Hello ${student.name}!</h2>
          <p style="color: #666; line-height: 1.6;">
            Your exam results are now available.
          </p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">${exam.title}</h3>
            <div style="display: flex; justify-content: space-between; margin: 15px 0;">
              <span style="color: #666;">Score:</span>
              <span style="color: #333; font-weight: bold;">${evaluation.totalMarks}/${evaluation.maxMarks}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 15px 0;">
              <span style="color: #666;">Percentage:</span>
              <span style="color: #333; font-weight: bold;">${evaluation.percentage}%</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 15px 0;">
              <span style="color: #666;">Grade:</span>
              <span style="color: #333; font-weight: bold; font-size: 18px;">${evaluation.grade}</span>
            </div>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/student/results/${evaluation._id}" style="background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block;">
              View Detailed Results
            </a>
          </div>
        </div>
      </div>
    `;

    return await this.sendEmail({
      to: student.email,
      subject,
      html
    });
  }

  async sendPasswordReset(user, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const subject = 'Password Reset Request';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #FF6B6B 0%, #EE5A52 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">🔐 Password Reset</h1>
        </div>
        <div style="padding: 30px; background-color: #f9f9f9;">
          <h2 style="color: #333;">Hello ${user.name}!</h2>
          <p style="color: #666; line-height: 1.6;">
            You requested a password reset for your ExamEval account. Click the button below to reset your password.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: linear-gradient(135deg, #FF6B6B 0%, #EE5A52 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="color: #999; font-size: 14px; text-align: center;">
            This link will expire in 10 minutes. If you didn't request this reset, please ignore this email.
          </p>
          <p style="color: #999; font-size: 12px; text-align: center; word-break: break-all;">
            Or copy and paste this URL: ${resetUrl}
          </p>
        </div>
      </div>
    `;

    return await this.sendEmail({
      to: user.email,
      subject,
      html
    });
  }

  async sendBulkNotification(recipients, subject, message, type = 'info') {
    const results = [];
    
    for (const recipient of recipients) {
      try {
        const html = this.createNotificationTemplate(recipient.name, message, type);
        await this.sendEmail({
          to: recipient.email,
          subject,
          html
        });
        results.push({ email: recipient.email, status: 'sent' });
      } catch (error) {
        results.push({ email: recipient.email, status: 'failed', error: error.message });
      }
    }

    return results;
  }

  createNotificationTemplate(name, message, type) {
    const colors = {
      info: { bg: '#2196F3', bgEnd: '#1976D2' },
      success: { bg: '#4CAF50', bgEnd: '#45a049' },
      warning: { bg: '#FF9800', bgEnd: '#F57C00' },
      error: { bg: '#F44336', bgEnd: '#D32F2F' }
    };

    const color = colors[type] || colors.info;

    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, ${color.bg} 0%, ${color.bgEnd} 100%); padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">📢 Notification</h1>
        </div>
        <div style="padding: 30px; background-color: #f9f9f9;">
          <h2 style="color: #333;">Hello ${name}!</h2>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="color: #666; line-height: 1.6; margin: 0;">${message}</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}" style="background: linear-gradient(135deg, ${color.bg} 0%, ${color.bgEnd} 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; display: inline-block;">
              Go to ExamEval
            </a>
          </div>
        </div>
      </div>
    `;
  }
}

export default new EmailService();