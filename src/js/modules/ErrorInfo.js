/**
 * ErrorInfo - Detailed error information for JSON parsing failures
 */
export class ErrorInfo {
  constructor(message, type = 'unknown', position = 0) {
    this.message = message || 'Unknown error';
    this.type = ErrorInfo._validateType(type);
    this.position = Math.max(0, position);
    this.line = null;
    this.column = null;
    this.suggestion = null;
  }

  /**
   * Creates ErrorInfo from a JSON parsing error
   * @param {Error} error - The parsing error
   * @param {string} content - The content that caused the error
   * @returns {ErrorInfo} New ErrorInfo instance
   */
  static fromJSONError(error, content = '') {
    const errorInfo = new ErrorInfo(error.message, 'syntax');

    // Try to extract position information from error message
    const positionMatch = error.message.match(/position (\d+)/i);
    if (positionMatch) {
      errorInfo.position = parseInt(positionMatch[1], 10);
    }

    // Calculate line and column from position
    if (content && errorInfo.position > 0) {
      const { line, column } = ErrorInfo._calculateLineColumn(content, errorInfo.position);
      errorInfo.line = line;
      errorInfo.column = column;
    }

    // Generate suggestion based on error type
    errorInfo.suggestion = ErrorInfo._generateSuggestion(error.message, errorInfo.type);

    return errorInfo;
  }

  /**
   * Creates ErrorInfo for validation errors
   * @param {string} message - Error message
   * @param {number} position - Character position
   * @returns {ErrorInfo} New ErrorInfo instance
   */
  static fromValidationError(message, position = 0) {
    const errorInfo = new ErrorInfo(message, 'validation', position);
    errorInfo.suggestion = ErrorInfo._generateSuggestion(message, 'validation');
    return errorInfo;
  }

  /**
   * Creates ErrorInfo for size limit errors
   * @param {number} actualSize - Actual size in bytes
   * @param {number} maxSize - Maximum allowed size in bytes
   * @returns {ErrorInfo} New ErrorInfo instance
   */
  static fromSizeError(actualSize, maxSize) {
    const message = `File size (${ErrorInfo._formatBytes(actualSize)}) exceeds limit (${ErrorInfo._formatBytes(maxSize)})`;
    const errorInfo = new ErrorInfo(message, 'size');
    errorInfo.suggestion = 'Try reducing the file size or breaking it into smaller parts';
    return errorInfo;
  }

  /**
   * Sets line and column information
   * @param {number} line - Line number
   * @param {number} column - Column number
   */
  setLineColumn(line, column) {
    this.line = Math.max(1, line);
    this.column = Math.max(1, column);
  }

  /**
   * Gets a formatted error message with position information
   * @returns {string} Formatted error message
   */
  getFormattedMessage() {
    let message = this.message;

    if (this.line && this.column) {
      message += ` (line ${this.line}, column ${this.column})`;
    } else if (this.position > 0) {
      message += ` (position ${this.position})`;
    }

    return message;
  }

  /**
   * Gets error details for display
   * @returns {Object} Error details object
   */
  getDetails() {
    return {
      message: this.message,
      type: this.type,
      position: this.position,
      line: this.line,
      column: this.column,
      suggestion: this.suggestion,
      formattedMessage: this.getFormattedMessage()
    };
  }

  /**
   * Checks if this is a syntax error
   * @returns {boolean} True if syntax error
   */
  isSyntaxError() {
    return this.type === 'syntax';
  }

  /**
   * Checks if this is a validation error
   * @returns {boolean} True if validation error
   */
  isValidationError() {
    return this.type === 'validation';
  }

  /**
   * Checks if this is a size error
   * @returns {boolean} True if size error
   */
  isSizeError() {
    return this.type === 'size';
  }

  /**
   * Validates error type
   * @param {string} type - Type to validate
   * @returns {string} Valid type
   * @private
   */
  static _validateType(type) {
    const validTypes = ['syntax', 'validation', 'size', 'unknown'];
    return validTypes.includes(type) ? type : 'unknown';
  }

  /**
   * Calculates line and column from position
   * @param {string} content - Content to analyze
   * @param {number} position - Character position
   * @returns {Object} Line and column information
   * @private
   */
  static _calculateLineColumn(content, position) {
    let line = 1;
    let column = 1;

    for (let i = 0; i < Math.min(position, content.length); i++) {
      if (content[i] === '\n') {
        line++;
        column = 1;
      } else {
        column++;
      }
    }

    return { line, column };
  }

  /**
   * Generates suggestion based on error message and type
   * @param {string} message - Error message
   * @param {string} type - Error type
   * @returns {string|null} Suggestion or null
   * @private
   */
  static _generateSuggestion(message, type) {
    const lowerMessage = message.toLowerCase();

    if (type === 'syntax') {
      if (lowerMessage.includes('unexpected token')) {
        return 'Check for missing commas, brackets, or quotes';
      }
      if (lowerMessage.includes('unexpected end')) {
        return 'Check for missing closing brackets or quotes';
      }
      if (lowerMessage.includes('unexpected string')) {
        return 'Check for unescaped quotes or special characters';
      }
      return 'Check JSON syntax for common errors like missing commas or brackets';
    }

    if (type === 'validation') {
      return 'Ensure the JSON structure is valid and complete';
    }

    if (type === 'size') {
      return 'Try reducing the file size or breaking it into smaller parts';
    }

    return null;
  }

  /**
   * Formats bytes into human-readable string
   * @param {number} bytes - Number of bytes
   * @returns {string} Formatted string
   * @private
   */
  static _formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
