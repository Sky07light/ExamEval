import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { asyncHandler } from '../utils/asyncHandler.js';
import ErrorResponse from '../utils/errorResponse.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Upload files
// @route   POST /api/v1/uploads
// @access  Private
export const uploadFiles = asyncHandler(async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next(new ErrorResponse('Please upload at least one file', 400));
  }

  const uploadedFiles = req.files.map(file => ({
    filename: file.filename,
    originalName: file.originalname,
    path: file.path,
    size: file.size,
    mimetype: file.mimetype,
    uploadedBy: req.user.id,
    uploadedAt: new Date()
  }));

  res.status(200).json({
    success: true,
    message: `${req.files.length} file(s) uploaded successfully`,
    data: uploadedFiles
  });
});

// @desc    Get uploaded files
// @route   GET /api/v1/uploads
// @access  Private
export const getUploadedFiles = asyncHandler(async (req, res, next) => {
  const uploadsDir = path.join(__dirname, '../../uploads');
  
  try {
    const files = fs.readdirSync(uploadsDir);
    const fileList = files.map(filename => {
      const filePath = path.join(uploadsDir, filename);
      const stats = fs.statSync(filePath);
      
      return {
        filename,
        size: stats.size,
        uploadedAt: stats.birthtime,
        url: `/uploads/${filename}`
      };
    });

    res.status(200).json({
      success: true,
      count: fileList.length,
      data: fileList
    });
  } catch (error) {
    return next(new ErrorResponse('Error reading upload directory', 500));
  }
});

// @desc    Delete uploaded file
// @route   DELETE /api/v1/uploads/:filename
// @access  Private
export const deleteFile = asyncHandler(async (req, res, next) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../../uploads', filename);

  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.status(200).json({
        success: true,
        message: 'File deleted successfully'
      });
    } else {
      return next(new ErrorResponse('File not found', 404));
    }
  } catch (error) {
    return next(new ErrorResponse('Error deleting file', 500));
  }
});