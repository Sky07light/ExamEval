import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import {
  CloudArrowUpIcon,
  DocumentTextIcon,
  PhotoIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

const Upload = () => {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const [uploadType, setUploadType] = useState('question');
  const [files, setFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...droppedFiles]);
  };

  const handleFileSelect = (e) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    
    setUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          // Reset files after successful upload
          setTimeout(() => {
            setFiles([]);
            setUploadProgress(0);
          }, 1000);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) {
      return <PhotoIcon className="h-8 w-8 text-blue-500" />;
    }
    return <DocumentTextIcon className="h-8 w-8 text-blue-500" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`min-h-screen pt-16 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Upload Exam Materials
          </h1>
          <p className={`mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Upload question papers, model answers, or student responses for ExamEval's AI evaluation.
          </p>
        </div>

        {/* Upload Type Selection */}
        <div className="mb-8">
          <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
            What are you uploading?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setUploadType('question')}
              className={`p-6 rounded-lg border-2 transition-all duration-200 text-left ${
                uploadType === 'question'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : isDark 
                    ? 'border-gray-700 bg-gray-800 hover:border-gray-600'
                    : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
            >
              <DocumentTextIcon className={`h-8 w-8 mb-3 ${uploadType === 'question' ? 'text-blue-600' : isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <h3 className={`font-semibold ${uploadType === 'question' ? 'text-blue-600' : isDark ? 'text-white' : 'text-gray-900'}`}>
                Question Papers & Model Answers
              </h3>
              <p className={`text-sm mt-2 ${uploadType === 'question' ? 'text-blue-500' : isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Upload question papers with their corresponding model answers and evaluation rubrics
              </p>
            </button>
            
            <button
              onClick={() => setUploadType('answer')}
              className={`p-6 rounded-lg border-2 transition-all duration-200 text-left ${
                uploadType === 'answer'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : isDark 
                    ? 'border-gray-700 bg-gray-800 hover:border-gray-600'
                    : 'border-gray-300 bg-white hover:border-gray-400'
              }`}
            >
              <PhotoIcon className={`h-8 w-8 mb-3 ${uploadType === 'answer' ? 'text-blue-600' : isDark ? 'text-gray-400' : 'text-gray-500'}`} />
              <h3 className={`font-semibold ${uploadType === 'answer' ? 'text-blue-600' : isDark ? 'text-white' : 'text-gray-900'}`}>
                Student Answer Sheets
              </h3>
              <p className={`text-sm mt-2 ${uploadType === 'answer' ? 'text-blue-500' : isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Upload student answer sheets (handwritten or typed) for AI evaluation
              </p>
            </button>
          </div>
        </div>

        {/* Upload Area */}
        <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 mb-8`}>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-all duration-200 ${
              dragOver
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : isDark
                  ? 'border-gray-600 hover:border-gray-500'
                  : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <CloudArrowUpIcon className={`mx-auto h-12 w-12 ${isDark ? 'text-gray-400' : 'text-gray-400'} mb-4`} />
            <h3 className={`text-lg font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
              Drop files here or click to upload
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
              Supports PDF, DOC, DOCX, JPG, PNG, and JPEG files up to 10MB each
            </p>
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
            >
              Select Files
            </label>
          </div>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 mb-8`}>
            <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
              Selected Files ({files.length})
            </h3>
            <div className="space-y-3">
              {files.map((file, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}
                >
                  <div className="flex items-center">
                    {getFileIcon(file)}
                    <div className="ml-3">
                      <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {file.name}
                      </p>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className={`p-1 rounded-full ${isDark ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-gray-200 text-gray-500'} transition-colors`}
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Progress */}
        {uploading && (
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 mb-8`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Uploading files...
              </span>
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {uploadProgress}%
              </span>
            </div>
            <div className={`w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2`}>
              <div 
                className="h-2 bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Upload Complete */}
        {uploadProgress === 100 && !uploading && (
          <div className={`${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6 mb-8`}>
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Upload Complete!
                </h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Your files have been uploaded successfully and are being processed.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Upload Button */}
        <div className="flex justify-end">
          <button
            onClick={handleUpload}
            disabled={files.length === 0 || uploading}
            className={`px-8 py-3 rounded-lg font-medium transition-colors ${
              files.length === 0 || uploading
                ? isDark 
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {uploading ? 'Uploading...' : `Upload ${files.length} File${files.length !== 1 ? 's' : ''}`}
          </button>
        </div>

        {/* Instructions */}
        <div className={`mt-8 ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg p-6`}>
          <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'} mb-4`}>
            Upload Guidelines
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                For Question Papers:
              </h4>
              <ul className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} space-y-1`}>
                <li>• Include clear question numbers and marks allocation</li>
                <li>• Provide detailed model answers</li>
                <li>• Add evaluation rubrics when available</li>
                <li>• Ensure text is readable and well-formatted</li>
              </ul>
            </div>
            <div>
              <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'} mb-2`}>
                For Answer Sheets:
              </h4>
              <ul className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} space-y-1`}>
                <li>• Ensure handwriting is clearly visible</li>
                <li>• Include student name and roll number</li>
                <li>• Upload in high resolution (300 DPI minimum)</li>
                <li>• Group by question or subject for better analysis</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;