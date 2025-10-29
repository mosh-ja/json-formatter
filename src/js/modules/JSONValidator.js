/**
 * JSONValidator - Handles JSON validation and error reporting
 */
export class JSONValidator {
  constructor() {
    this.maxSize = 1048576; // 1MB default limit
  }

  /**
   * Validates JSON content and returns detailed results
   * @param {string} content - JSON content to validate
   * @param {Object} options - Validation options
   * @returns {Object} Validation result with detailed information
   */
  validateJSON(content, options = {}) {
    const result = {
      isValid: false,
      error: null,
      errorInfo: null,
      size: 0,
      sizeValid: true,
      parseTime: 0
    };

    // Check if content is provided
    if (!content || typeof content !== 'string') {
      result.error = 'No content provided';
      result.errorInfo = ErrorInfo.fromValidationError('No content provided');
      return result;
    }

    // Check content size
    result.size = new Blob([content]).size;
    const maxSize = options.maxSize || this.maxSize;
    result.sizeValid = result.size <= maxSize;

    if (!result.sizeValid) {
      result.error = `Content size (${this._formatBytes(result.size)}) exceeds limit (${this._formatBytes(maxSize)})`;
      result.errorInfo = ErrorInfo.fromSizeError(result.size, maxSize);
      return result;
    }

    // Check if content is empty or only whitespace
    if (!content.trim()) {
      result.error = 'Content is empty';
      result.errorInfo = ErrorInfo.fromValidationError('Content is empty');
      return result;
    }

    // Attempt to parse JSON
    const startTime = performance.now();
    try {
      const parsed = JSON.parse(content);
      const endTime = performance.now();

      result.isValid = true;
      result.parseTime = endTime - startTime;
      result.parsedData = parsed;

      return result;
    } catch (error) {
      const endTime = performance.now();
      result.parseTime = endTime - startTime;
      result.error = error.message;
      result.errorInfo = ErrorInfo.fromJSONError(error, content);

      return result;
    }
  }

  /**
   * Validates JSON with size checking only
   * @param {string} content - JSON content to validate
   * @param {number} maxSize - Maximum allowed size in bytes
   * @returns {Object} Size validation result
   */
  validateSize(content, maxSize = this.maxSize) {
    const size = new Blob([content]).size;
    const isValid = size <= maxSize;

    return {
      isValid,
      size,
      maxSize,
      error: isValid ? null : `Content size (${this._formatBytes(size)}) exceeds limit (${this._formatBytes(maxSize)})`
    };
  }

  /**
   * Validates JSON syntax only (no size checking)
   * @param {string} content - JSON content to validate
   * @returns {Object} Syntax validation result
   */
  validateSyntax(content) {
    if (!content || typeof content !== 'string') {
      return {
        isValid: false,
        error: 'No content provided',
        errorInfo: ErrorInfo.fromValidationError('No content provided')
      };
    }

    if (!content.trim()) {
      return {
        isValid: false,
        error: 'Content is empty',
        errorInfo: ErrorInfo.fromValidationError('Content is empty')
      };
    }

    try {
      JSON.parse(content);
      return {
        isValid: true,
        error: null,
        errorInfo: null
      };
    } catch (error) {
      return {
        isValid: false,
        error: error.message,
        errorInfo: ErrorInfo.fromJSONError(error, content)
      };
    }
  }

  /**
   * Gets validation statistics for content
   * @param {string} content - JSON content to analyze
   * @returns {Object} Validation statistics
   */
  getValidationStats(content) {
    const result = this.validateJSON(content);

    return {
      isValid: result.isValid,
      size: result.size,
      sizeValid: result.sizeValid,
      parseTime: result.parseTime,
      hasError: !!result.error,
      errorType: result.errorInfo ? result.errorInfo.type : null,
      lineCount: content.split('\n').length,
      characterCount: content.length,
      wordCount: content.split(/\s+/).filter(word => word.length > 0).length
    };
  }

  /**
   * Sets the maximum allowed size for validation
   * @param {number} maxSize - Maximum size in bytes
   */
  setMaxSize(maxSize) {
    this.maxSize = Math.max(0, maxSize);
  }

  /**
   * Gets the current maximum allowed size
   * @returns {number} Maximum size in bytes
   */
  getMaxSize() {
    return this.maxSize;
  }

  /**
   * Formats bytes into human-readable string
   * @param {number} bytes - Number of bytes
   * @returns {string} Formatted string
   * @private
   */
  _formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Import ErrorInfo for error handling
import { ErrorInfo } from './ErrorInfo.js';
