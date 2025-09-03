import React, { useState, useRef, useCallback } from 'react';
import { mediaApi, MediaUploadResult, AllowedFileTypes } from '../services/mediaApi';

interface FileUploadProps {
  entityType: string;
  entityId: string;
  onUploadComplete: (results: MediaUploadResult[]) => void;
  onUploadError?: (error: string) => void;
  multiple?: boolean;
  accept?: string;
  maxFiles?: number;
  maxFileSize?: number;
  showPreview?: boolean;
  className?: string;
  disabled?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  entityType,
  entityId,
  onUploadComplete,
  onUploadError,
  multiple = false,
  accept,
  maxFiles = 10,
  maxFileSize,
  showPreview = true,
  className = '',
  disabled = false
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [allowedTypes, setAllowedTypes] = useState<AllowedFileTypes>({});
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Load allowed file types on component mount
  React.useEffect(() => {
    const loadAllowedTypes = async () => {
      try {
        const types = await mediaApi.getAllowedFileTypes();
        setAllowedTypes(types);
      } catch (err) {
        console.error('Failed to load allowed file types:', err);
      }
    };
    loadAllowedTypes();
  }, []);

  const validateFile = useCallback((file: File): string | null => {
    // Check file size
    if (maxFileSize && file.size > maxFileSize) {
      return `Filen är för stor. Max storlek: ${mediaApi.formatFileSize(maxFileSize)}`;
    }

    // Check allowed types
    if (Object.keys(allowedTypes).length > 0 && !allowedTypes[file.type]) {
      return `Filtypen ${file.type} är inte tillåten`;
    }

    // Check max file size from allowed types
    if (allowedTypes[file.type] && file.size > allowedTypes[file.type]) {
      return `Filen är för stor. Max storlek för ${file.type}: ${mediaApi.formatFileSize(allowedTypes[file.type])}`;
    }

    return null;
  }, [maxFileSize, allowedTypes]);

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);
    const validFiles: File[] = [];
    const errors: string[] = [];

    // Validate each file
    fileArray.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      setError(errors.join('\n'));
      if (onUploadError) {
        onUploadError(errors.join('\n'));
      }
    } else {
      setError(null);
    }

    // Limit number of files
    const limitedFiles = validFiles.slice(0, maxFiles);
    setSelectedFiles(limitedFiles);
  }, [validateFile, maxFiles, onUploadError]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = e.dataTransfer.files;
    handleFileSelect(files);
  }, [disabled, handleFileSelect]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  }, [handleFileSelect]);

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      let results: MediaUploadResult[];

      if (selectedFiles.length === 1 && !multiple) {
        const result = await mediaApi.uploadFile(
          selectedFiles[0],
          entityType,
          entityId
        );
        results = [result];
      } else {
        results = await mediaApi.uploadMultipleFiles(
          selectedFiles,
          entityType,
          entityId
        );
      }

      // Check for failed uploads
      const failedUploads = results.filter(r => !r.success);
      if (failedUploads.length > 0) {
        const errorMessage = failedUploads.map(r => r.errorMessage).join('\n');
        setError(errorMessage);
        if (onUploadError) {
          onUploadError(errorMessage);
        }
      }

      // Call success callback with all results
      onUploadComplete(results);

      // Clear selected files
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (err: any) {
      const errorMessage = 'Uppladdning misslyckades. Försök igen.';
      setError(errorMessage);
      if (onUploadError) {
        onUploadError(errorMessage);
      }
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
  };

  const openFileDialog = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const getAcceptString = () => {
    if (accept) return accept;
    if (Object.keys(allowedTypes).length > 0) {
      return Object.keys(allowedTypes).join(',');
    }
    return undefined;
  };

  return (
    <div className={`file-upload ${className}`}>
      {/* Drop Zone */}
      <div
        ref={dropZoneRef}
        className={`file-upload-dropzone ${isDragging ? 'dragging' : ''} ${disabled ? 'disabled' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <div className="file-upload-content">
          <div className="file-upload-icon">
            {isUploading ? '⏳' : '📁'}
          </div>
          <div className="file-upload-text">
            {isUploading ? (
              <div>
                <p>Laddar upp filer...</p>
                <div className="upload-progress">
                  <div 
                    className="upload-progress-bar" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            ) : (
              <div>
                <p>
                  {isDragging 
                    ? 'Släpp filerna här' 
                    : 'Klicka för att välja filer eller dra och släpp dem här'
                  }
                </p>
                <p className="file-upload-hint">
                  {multiple ? `Max ${maxFiles} filer` : 'En fil i taget'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={getAcceptString()}
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
        disabled={disabled}
      />

      {/* Error Message */}
      {error && (
        <div className="file-upload-error">
          <p>{error}</p>
        </div>
      )}

      {/* Selected Files Preview */}
      {showPreview && selectedFiles.length > 0 && (
        <div className="file-upload-preview">
          <h4>Valda filer ({selectedFiles.length})</h4>
          <div className="file-list">
            {selectedFiles.map((file, index) => (
              <div key={index} className="file-item">
                <div className="file-info">
                  <span className="file-icon">
                    {mediaApi.getFileTypeIcon(file.type)}
                  </span>
                  <div className="file-details">
                    <span className="file-name">{file.name}</span>
                    <span className="file-size">{mediaApi.formatFileSize(file.size)}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="file-remove-btn"
                  disabled={isUploading}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Button */}
      {selectedFiles.length > 0 && (
        <div className="file-upload-actions">
          <button
            type="button"
            onClick={handleUpload}
            disabled={isUploading || disabled}
            className="btn btn-primary"
          >
            {isUploading ? 'Laddar upp...' : `Ladda upp ${selectedFiles.length} fil${selectedFiles.length > 1 ? 'er' : ''}`}
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
