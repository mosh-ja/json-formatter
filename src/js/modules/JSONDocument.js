/**
 * JSONDocument - Represents the JSON data being processed by the application
 */
export class JSONDocument {
  constructor(rawContent = '') {
    this.rawContent = rawContent;
    this.formattedContent = '';
    this.minifiedContent = '';
    this.isValid = false;
    this.errorMessage = null;
    this.errorPosition = null;
    this.size = 0;
    this.lastModified = new Date();

    this._updateSize();
  }

  /**
   * Updates the raw content and resets processing state
   * @param {string} content - The raw JSON content
   */
  setRawContent(content) {
    this.rawContent = content || '';
    this.formattedContent = '';
    this.minifiedContent = '';
    this.isValid = false;
    this.errorMessage = null;
    this.errorPosition = null;
    this.lastModified = new Date();
    this._updateSize();
  }

  /**
   * Sets the formatted content
   * @param {string} content - The formatted JSON content
   */
  setFormattedContent(content) {
    this.formattedContent = content || '';
  }

  /**
   * Sets the minified content
   * @param {string} content - The minified JSON content
   */
  setMinifiedContent(content) {
    this.minifiedContent = content || '';
  }

  /**
   * Sets validation state and error information
   * @param {boolean} isValid - Whether the JSON is valid
   * @param {string|null} errorMessage - Error message if invalid
   * @param {number|null} errorPosition - Character position of error
   */
  setValidationState(isValid, errorMessage = null, errorPosition = null) {
    this.isValid = isValid;
    this.errorMessage = errorMessage;
    this.errorPosition = errorPosition;
  }

  /**
   * Gets the current content based on format preference
   * @param {string} format - 'formatted' or 'minified'
   * @returns {string} The content in the requested format
   */
  getContent(format = 'formatted') {
    if (format === 'minified') {
      return this.minifiedContent || this.rawContent;
    }
    return this.formattedContent || this.rawContent;
  }

  /**
   * Checks if the document has been processed
   * @returns {boolean} True if document has formatted or minified content
   */
  hasProcessedContent() {
    return !!(this.formattedContent || this.minifiedContent);
  }

  /**
   * Checks if the document is empty
   * @returns {boolean} True if document has no content
   */
  isEmpty() {
    return !this.rawContent.trim();
  }

  /**
   * Gets document metadata
   * @returns {Object} Document metadata
   */
  getMetadata() {
    return {
      size: this.size,
      isValid: this.isValid,
      hasError: !!this.errorMessage,
      lastModified: this.lastModified,
      hasProcessedContent: this.hasProcessedContent()
    };
  }

  /**
   * Updates the size property based on raw content
   * @private
   */
  _updateSize() {
    this.size = new Blob([this.rawContent]).size;
  }

  /**
   * Validates the document size
   * @param {number} maxSize - Maximum allowed size in bytes (default: 1MB)
   * @returns {boolean} True if size is within limits
   */
  validateSize(maxSize = 1048576) {
    return this.size <= maxSize;
  }

  /**
   * Creates a copy of the document
   * @returns {JSONDocument} A new JSONDocument instance
   */
  clone() {
    const cloned = new JSONDocument(this.rawContent);
    cloned.formattedContent = this.formattedContent;
    cloned.minifiedContent = this.minifiedContent;
    cloned.isValid = this.isValid;
    cloned.errorMessage = this.errorMessage;
    cloned.errorPosition = this.errorPosition;
    cloned.lastModified = new Date(this.lastModified);
    return cloned;
  }
}
