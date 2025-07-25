import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import sharp from 'sharp';
import Tesseract from 'tesseract.js';
import ErrorResponse from '../utils/errorResponse.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class FileService {
  constructor() {
    this.uploadPath = process.env.UPLOAD_PATH || './uploads';
    this.maxFileSize = parseInt(process.env.MAX_FILE_SIZE) || 10485760; // 10MB
    this.allowedTypes = {
      documents: ['pdf', 'doc', 'docx', 'txt'],
      images: ['jpg', 'jpeg', 'png', 'gif', 'bmp'],
      archives: ['zip', 'rar']
    };
  }

  /**
   * Process uploaded file and extract text content
   * @param {Object} file - Multer file object
   * @returns {Object} Processed file information with extracted text
   */
  async processFile(file) {
    try {
      const fileExtension = this.getFileExtension(file.originalname);
      const fileType = this.getFileType(fileExtension);

      let extractedText = '';
      let metadata = {
        originalName: file.originalname,
        filename: file.filename,
        size: file.size,
        mimetype: file.mimetype,
        extension: fileExtension,
        type: fileType,
        uploadDate: new Date()
      };

      // Extract text based on file type
      switch (fileType) {
        case 'pdf':
          extractedText = await this.extractTextFromPDF(file.path);
          break;
        case 'doc':
        case 'docx':
          extractedText = await this.extractTextFromWord(file.path);
          break;
        case 'txt':
          extractedText = await this.extractTextFromTxt(file.path);
          break;
        case 'image':
          extractedText = await this.extractTextFromImage(file.path);
          break;
        default:
          extractedText = 'Text extraction not supported for this file type';
      }

      metadata.extractedText = extractedText;
      metadata.wordCount = this.countWords(extractedText);

      return metadata;
    } catch (error) {
      console.error('File processing error:', error);
      throw new ErrorResponse('Failed to process file', 500);
    }
  }

  /**
   * Extract text from PDF files
   */
  async extractTextFromPDF(filePath) {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const data = await pdfParse(dataBuffer);
      return data.text;
    } catch (error) {
      console.error('PDF extraction error:', error);
      return 'Failed to extract text from PDF';
    }
  }

  /**
   * Extract text from Word documents
   */
  async extractTextFromWord(filePath) {
    try {
      const result = await mammoth.extractRawText({ path: filePath });
      return result.value;
    } catch (error) {
      console.error('Word extraction error:', error);
      return 'Failed to extract text from Word document';
    }
  }

  /**
   * Extract text from plain text files
   */
  async extractTextFromTxt(filePath) {
    try {
      return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
      console.error('Text file extraction error:', error);
      return 'Failed to read text file';
    }
  }

  /**
   * Extract text from images using OCR
   */
  async extractTextFromImage(filePath) {
    try {
      // First, optimize the image for better OCR results
      const optimizedPath = await this.optimizeImageForOCR(filePath);
      
      const { data: { text } } = await Tesseract.recognize(optimizedPath, 'eng', {
        logger: m => console.log(m)
      });

      // Clean up optimized image if it's different from original
      if (optimizedPath !== filePath) {
        fs.unlinkSync(optimizedPath);
      }

      return text;
    } catch (error) {
      console.error('OCR extraction error:', error);
      return 'Failed to extract text from image';
    }
  }

  /**
   * Optimize image for better OCR results
   */
  async optimizeImageForOCR(filePath) {
    try {
      const optimizedPath = filePath.replace(/\.[^/.]+$/, '_optimized.png');
      
      await sharp(filePath)
        .resize(2000, 2000, { 
          fit: 'inside',
          withoutEnlargement: true 
        })
        .greyscale()
        .normalize()
        .sharpen()
        .png()
        .toFile(optimizedPath);

      return optimizedPath;
    } catch (error) {
      console.error('Image optimization error:', error);
      return filePath; // Return original if optimization fails
    }
  }

  /**
   * Validate file before processing
   */
  validateFile(file) {
    const errors = [];

    // Check file size
    if (file.size > this.maxFileSize) {
      errors.push(`File size exceeds maximum limit of ${this.maxFileSize / 1024 / 1024}MB`);
    }

    // Check file type
    const extension = this.getFileExtension(file.originalname);
    const allAllowedTypes = [
      ...this.allowedTypes.documents,
      ...this.allowedTypes.images,
      ...this.allowedTypes.archives
    ];

    if (!allAllowedTypes.includes(extension)) {
      errors.push(`File type .${extension} is not supported`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Get file extension from filename
   */
  getFileExtension(filename) {
    return filename.split('.').pop().toLowerCase();
  }

  /**
   * Determine file type category
   */
  getFileType(extension) {
    if (this.allowedTypes.documents.includes(extension)) {
      return extension === 'pdf' ? 'pdf' : extension.includes('doc') ? 'docx' : 'txt';
    }
    if (this.allowedTypes.images.includes(extension)) {
      return 'image';
    }
    if (this.allowedTypes.archives.includes(extension)) {
      return 'archive';
    }
    return 'unknown';
  }

  /**
   * Count words in text
   */
  countWords(text) {
    if (!text || typeof text !== 'string') return 0;
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  /**
   * Delete file from filesystem
   */
  async deleteFile(filename) {
    try {
      const filePath = path.join(this.uploadPath, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return true;
      }
      return false;
    } catch (error) {
      console.error('File deletion error:', error);
      throw new ErrorResponse('Failed to delete file', 500);
    }
  }

  /**
   * Get file information
   */
  getFileInfo(filename) {
    try {
      const filePath = path.join(this.uploadPath, filename);
      if (!fs.existsSync(filePath)) {
        throw new ErrorResponse('File not found', 404);
      }

      const stats = fs.statSync(filePath);
      return {
        filename,
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        path: filePath
      };
    } catch (error) {
      console.error('Get file info error:', error);
      throw new ErrorResponse('Failed to get file information', 500);
    }
  }

  /**
   * Create thumbnail for image files
   */
  async createThumbnail(filePath, filename) {
    try {
      const extension = this.getFileExtension(filename);
      if (!this.allowedTypes.images.includes(extension)) {
        return null;
      }

      const thumbnailPath = path.join(
        this.uploadPath, 
        'thumbnails', 
        `thumb_${filename.replace(/\.[^/.]+$/, '.jpg')}`
      );

      // Ensure thumbnails directory exists
      const thumbnailDir = path.dirname(thumbnailPath);
      if (!fs.existsSync(thumbnailDir)) {
        fs.mkdirSync(thumbnailDir, { recursive: true });
      }

      await sharp(filePath)
        .resize(200, 200, { 
          fit: 'cover',
          position: 'center'
        })
        .jpeg({ quality: 80 })
        .toFile(thumbnailPath);

      return thumbnailPath;
    } catch (error) {
      console.error('Thumbnail creation error:', error);
      return null;
    }
  }

  /**
   * Batch process multiple files
   */
  async batchProcess(files) {
    const results = [];
    
    for (const file of files) {
      try {
        const validation = this.validateFile(file);
        if (!validation.isValid) {
          results.push({
            filename: file.originalname,
            status: 'failed',
            errors: validation.errors
          });
          continue;
        }

        const processedFile = await this.processFile(file);
        const thumbnail = await this.createThumbnail(file.path, file.filename);
        
        results.push({
          filename: file.originalname,
          status: 'success',
          data: {
            ...processedFile,
            thumbnail: thumbnail ? path.basename(thumbnail) : null
          }
        });
      } catch (error) {
        results.push({
          filename: file.originalname,
          status: 'failed',
          errors: [error.message]
        });
      }
    }

    return results;
  }

  /**
   * Clean up old files
   */
  async cleanupOldFiles(maxAge = 7 * 24 * 60 * 60 * 1000) { // 7 days default
    try {
      const files = fs.readdirSync(this.uploadPath);
      const now = Date.now();
      let deletedCount = 0;

      for (const file of files) {
        const filePath = path.join(this.uploadPath, file);
        const stats = fs.statSync(filePath);
        
        if (now - stats.mtime.getTime() > maxAge) {
          fs.unlinkSync(filePath);
          deletedCount++;
        }
      }

      console.log(`🧹 Cleaned up ${deletedCount} old files`);
      return deletedCount;
    } catch (error) {
      console.error('File cleanup error:', error);
      throw new ErrorResponse('Failed to cleanup old files', 500);
    }
  }
}

export default new FileService();