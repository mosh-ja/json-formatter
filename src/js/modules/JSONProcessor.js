/**
 * JSONProcessor - Main processor that integrates validation and formatting
 */
export class JSONProcessor {
  constructor() {
    this.validator = new JSONValidator();
    this.formatter = new JSONFormatter();
  }

  /**
   * Processes JSON content with validation and formatting
   * @param {string} content - JSON content to process
   * @param {Object} options - Processing options
   * @returns {Object} Processing result
   */
  processJSON(content, options = {}) {
    const result = {
      success: false,
      isValid: false,
      formatted: '',
      minified: '',
      error: null,
      errorInfo: null,
      processingTime: 0,
      stats: {}
    };

    const startTime = performance.now();

    try {
      // Validate JSON first
      const validationResult = this.validator.validateJSON(content, {
        maxSize: options.maxSize
      });

      result.isValid = validationResult.isValid;
      result.error = validationResult.error;
      result.errorInfo = validationResult.errorInfo;

      if (!validationResult.isValid) {
        const endTime = performance.now();
        result.processingTime = endTime - startTime;
        return result;
      }

      // Format JSON if validation passed
      const formatResult = this.formatter.formatJSON(content, {
        indentation: options.indentation || 2
      });

      if (!formatResult.success) {
        result.error = formatResult.error;
        const endTime = performance.now();
        result.processingTime = endTime - startTime;
        return result;
      }

      // Minify JSON
      const minifyResult = this.formatter.minifyJSON(content);

      if (!minifyResult.success) {
        result.error = minifyResult.error;
        const endTime = performance.now();
        result.processingTime = endTime - startTime;
        return result;
      }

      // Set results
      result.success = true;
      result.formatted = formatResult.formatted;
      result.minified = minifyResult.minified;

      // Calculate statistics
      result.stats = this._calculateStats(content, formatResult.formatted, minifyResult.minified);

      const endTime = performance.now();
      result.processingTime = endTime - startTime;

      return result;
    } catch (error) {
      const endTime = performance.now();
      result.processingTime = endTime - startTime;
      result.error = `Processing failed: ${error.message}`;
      return result;
    }
  }

  /**
   * Processes JSON with specific format preference
   * @param {string} content - JSON content to process
   * @param {string} format - 'formatted' or 'minified'
   * @param {Object} options - Processing options
   * @returns {Object} Processing result
   */
  processWithFormat(content, format, options = {}) {
    const result = this.processJSON(content, options);

    if (result.success) {
      result.output = format === 'minified' ? result.minified : result.formatted;
      result.selectedFormat = format;
    }

    return result;
  }

  /**
   * Validates JSON without formatting
   * @param {string} content - JSON content to validate
   * @param {Object} options - Validation options
   * @returns {Object} Validation result
   */
  validateOnly(content, options = {}) {
    return this.validator.validateJSON(content, options);
  }

  /**
   * Formats JSON without validation (assumes valid JSON)
   * @param {string} content - JSON content to format
   * @param {Object} options - Formatting options
   * @returns {Object} Formatting result
   */
  formatOnly(content, options = {}) {
    return this.formatter.formatJSON(content, options);
  }

  /**
   * Minifies JSON without validation (assumes valid JSON)
   * @param {string} content - JSON content to minify
   * @returns {Object} Minification result
   */
  minifyOnly(content) {
    return this.formatter.minifyJSON(content);
  }

  /**
   * Gets processing statistics for content
   * @param {string} content - JSON content to analyze
   * @param {Object} options - Processing options
   * @returns {Object} Processing statistics
   */
  getProcessingStats(content, options = {}) {
    const validationStats = this.validator.getValidationStats(content);
    const formattingStats = this.formatter.getFormattingStats(content, options);

    return {
      ...validationStats,
      ...formattingStats,
      processingEfficiency: validationStats.parseTime + formattingStats.formatTime + formattingStats.minifyTime
    };
  }

  /**
   * Sets processing options
   * @param {Object} options - Processing options
   */
  setOptions(options) {
    if (options.maxSize !== undefined) {
      this.validator.setMaxSize(options.maxSize);
    }

    if (options.indentation !== undefined) {
      this.formatter.setDefaultIndentation(options.indentation);
    }
  }

  /**
   * Gets current processing options
   * @returns {Object} Current processing options
   */
  getOptions() {
    return {
      maxSize: this.validator.getMaxSize(),
      indentation: this.formatter.getDefaultIndentation()
    };
  }

  /**
   * Calculates processing statistics
   * @param {string} original - Original content
   * @param {string} formatted - Formatted content
   * @param {string} minified - Minified content
   * @returns {Object} Statistics object
   * @private
   */
  _calculateStats(original, formatted, minified) {
    const originalSize = new Blob([original]).size;
    const formattedSize = new Blob([formatted]).size;
    const minifiedSize = new Blob([minified]).size;

    return {
      originalSize,
      formattedSize,
      minifiedSize,
      compressionRatio: (1 - minifiedSize / originalSize) * 100,
      expansionRatio: (formattedSize / originalSize - 1) * 100,
      lineCount: formatted.split('\n').length,
      characterCount: original.length
    };
  }
}

// Import dependencies
import { JSONValidator } from './JSONValidator.js';
import { JSONFormatter } from './JSONFormatter.js';
