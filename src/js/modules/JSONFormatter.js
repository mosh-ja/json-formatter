/**
 * JSONFormatter - Handles JSON formatting and minification
 */
export class JSONFormatter {
  constructor() {
    this.defaultIndentation = 2;
    this.maxIndentation = 8;
  }

  /**
   * Formats JSON with specified indentation
   * @param {string} content - JSON content to format
   * @param {Object} options - Formatting options
   * @returns {Object} Formatting result
   */
  formatJSON(content, options = {}) {
    const result = {
      success: false,
      formatted: '',
      error: null,
      formatTime: 0
    };

    // Validate input
    if (!content || typeof content !== 'string') {
      result.error = 'No content provided';
      return result;
    }

    if (!content.trim()) {
      result.error = 'Content is empty';
      return result;
    }

    // Parse and format
    const startTime = performance.now();
    try {
      const parsed = JSON.parse(content);
      const indentation = this._validateIndentation(options.indentation || this.defaultIndentation);

      result.formatted = JSON.stringify(parsed, null, indentation);
      result.success = true;

      const endTime = performance.now();
      result.formatTime = endTime - startTime;

      return result;
    } catch (error) {
      const endTime = performance.now();
      result.formatTime = endTime - startTime;
      result.error = `JSON parsing failed: ${error.message}`;
      return result;
    }
  }

  /**
   * Minifies JSON by removing whitespace
   * @param {string} content - JSON content to minify
   * @returns {Object} Minification result
   */
  minifyJSON(content) {
    const result = {
      success: false,
      minified: '',
      error: null,
      minifyTime: 0
    };

    // Validate input
    if (!content || typeof content !== 'string') {
      result.error = 'No content provided';
      return result;
    }

    if (!content.trim()) {
      result.error = 'Content is empty';
      return result;
    }

    // Parse and minify
    const startTime = performance.now();
    try {
      const parsed = JSON.parse(content);
      result.minified = JSON.stringify(parsed);
      result.success = true;

      const endTime = performance.now();
      result.minifyTime = endTime - startTime;

      return result;
    } catch (error) {
      const endTime = performance.now();
      result.minifyTime = endTime - startTime;
      result.error = `JSON parsing failed: ${error.message}`;
      return result;
    }
  }

  /**
   * Formats JSON with custom indentation character
   * @param {string} content - JSON content to format
   * @param {Object} options - Formatting options
   * @returns {Object} Formatting result
   */
  formatWithCustomIndentation(content, options = {}) {
    const result = {
      success: false,
      formatted: '',
      error: null,
      formatTime: 0
    };

    // Validate input
    if (!content || typeof content !== 'string') {
      result.error = 'No content provided';
      return result;
    }

    if (!content.trim()) {
      result.error = 'Content is empty';
      return result;
    }

    const startTime = performance.now();
    try {
      const parsed = JSON.parse(content);
      const indentation = options.indentation || this.defaultIndentation;
      const indentChar = options.indentChar || ' ';

      // Create custom indentation string
      const indentString = indentChar.repeat(indentation);

      result.formatted = JSON.stringify(parsed, null, indentString);
      result.success = true;

      const endTime = performance.now();
      result.formatTime = endTime - startTime;

      return result;
    } catch (error) {
      const endTime = performance.now();
      result.formatTime = endTime - startTime;
      result.error = `JSON parsing failed: ${error.message}`;
      return result;
    }
  }

  /**
   * Gets formatting statistics
   * @param {string} content - JSON content to analyze
   * @param {Object} options - Formatting options
   * @returns {Object} Formatting statistics
   */
  getFormattingStats(content, options = {}) {
    const formatResult = this.formatJSON(content, options);
    const minifyResult = this.minifyJSON(content);

    return {
      originalSize: new Blob([content]).size,
      formattedSize: formatResult.success ? new Blob([formatResult.formatted]).size : 0,
      minifiedSize: minifyResult.success ? new Blob([minifyResult.minified]).size : 0,
      formatTime: formatResult.formatTime,
      minifyTime: minifyResult.minifyTime,
      compressionRatio: minifyResult.success ?
        (1 - minifyResult.minified.length / content.length) * 100 : 0,
      canFormat: formatResult.success,
      canMinify: minifyResult.success
    };
  }

  /**
   * Validates indentation value
   * @param {number} indentation - Indentation value to validate
   * @returns {number} Valid indentation value
   * @private
   */
  _validateIndentation(indentation) {
    const num = parseInt(indentation, 10);
    return (num >= 1 && num <= this.maxIndentation) ? num : this.defaultIndentation;
  }

  /**
   * Sets the default indentation
   * @param {number} indentation - Default indentation (1-8)
   */
  setDefaultIndentation(indentation) {
    this.defaultIndentation = this._validateIndentation(indentation);
  }

  /**
   * Gets the default indentation
   * @returns {number} Default indentation value
   */
  getDefaultIndentation() {
    return this.defaultIndentation;
  }

  /**
   * Sets the maximum allowed indentation
   * @param {number} maxIndentation - Maximum indentation (1-8)
   */
  setMaxIndentation(maxIndentation) {
    this.maxIndentation = Math.max(1, Math.min(8, maxIndentation));
  }

  /**
   * Gets the maximum allowed indentation
   * @returns {number} Maximum indentation value
   */
  getMaxIndentation() {
    return this.maxIndentation;
  }
}
