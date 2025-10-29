/**
 * UIManager - Handles UI updates and user interactions
 */
export class UIManager {
  constructor() {
    this.elements = this._initializeElements();
    this.state = {
      isProcessing: false,
      currentFormat: 'formatted',
      hasError: false,
      hasSuccess: false
    };
  }

  /**
   * Initializes DOM element references
   * @returns {Object} Element references
   * @private
   */
  _initializeElements() {
    return {
      // Input elements
      jsonInput: document.getElementById('json-input'),
      inputStats: document.getElementById('input-stats'),
      clearInputBtn: document.getElementById('clear-input'),

      // Output elements
      jsonOutput: document.getElementById('json-output'),
      outputStats: document.getElementById('output-stats'),
      clearOutputBtn: document.getElementById('clear-output'),

      // Control elements
      formatFormatted: document.getElementById('format-formatted'),
      formatMinified: document.getElementById('format-minified'),
      indentSize: document.getElementById('indent-size'),
      formatBtn: document.getElementById('format-btn'),
      copyBtn: document.getElementById('copy-btn'),

      // Feedback elements
      errorSection: document.getElementById('error-section'),
      errorContent: document.getElementById('error-content'),
      closeErrorBtn: document.getElementById('close-error'),
      successMessage: document.getElementById('success-message'),
      successText: document.getElementById('success-text')
    };
  }

  /**
   * Updates the input area with new content
   * @param {string} content - Content to display
   */
  updateInputArea(content) {
    if (this.elements.jsonInput) {
      this.elements.jsonInput.value = content || '';
      this._updateInputStats();
    }
  }

  /**
   * Updates the output area with formatted JSON
   * @param {string} content - Formatted content to display
   * @param {string} format - Format type ('formatted' or 'minified')
   */
  updateOutputArea(content, format = 'formatted') {
    if (this.elements.jsonOutput) {
      this.elements.jsonOutput.textContent = content || '';
      this.state.currentFormat = format;
      this._updateOutputStats();
      this._updateFormatSelection(format);
    }
  }

  /**
   * Shows an error message
   * @param {string|Object} error - Error message or error object
   * @param {Object} errorInfo - Detailed error information
   */
  showError(error, errorInfo = null) {
    this.state.hasError = true;
    this.state.hasSuccess = false;

    let errorMessage = '';
    if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && error.message) {
      errorMessage = error.message;
    } else {
      errorMessage = 'An unknown error occurred';
    }

    // Add detailed error information if available
    if (errorInfo) {
      errorMessage = errorInfo.getFormattedMessage();

      if (errorInfo.suggestion) {
        errorMessage += `\n\nSuggestion: ${errorInfo.suggestion}`;
      }
    }

    if (this.elements.errorContent) {
      this.elements.errorContent.textContent = errorMessage;
    }

    if (this.elements.errorSection) {
      this.elements.errorSection.classList.remove('hidden');
    }

    this._hideSuccessMessage();
  }

  /**
   * Hides the error message
   */
  hideError() {
    this.state.hasError = false;

    if (this.elements.errorSection) {
      this.elements.errorSection.classList.add('hidden');
    }
  }

  /**
   * Shows a success message
   * @param {string} message - Success message to display
   * @param {number} duration - Duration in milliseconds
   */
  showSuccess(message, duration = 3000) {
    this.state.hasSuccess = true;
    this.state.hasError = false;

    if (this.elements.successText) {
      this.elements.successText.textContent = message;
    }

    if (this.elements.successMessage) {
      this.elements.successMessage.classList.remove('hidden');
    }

    this._hideError();

    // Auto-hide after duration
    if (duration > 0) {
      setTimeout(() => {
        this._hideSuccessMessage();
      }, duration);
    }
  }

  /**
   * Hides the success message
   * @private
   */
  _hideSuccessMessage() {
    this.state.hasSuccess = false;

    if (this.elements.successMessage) {
      this.elements.successMessage.classList.add('hidden');
    }
  }

  /**
   * Updates processing state
   * @param {boolean} isProcessing - Whether processing is active
   * @param {string} type - Type of processing
   */
  updateProcessingState(isProcessing, type = null) {
    this.state.isProcessing = isProcessing;

    if (this.elements.formatBtn) {
      this.elements.formatBtn.disabled = isProcessing;
      this.elements.formatBtn.textContent = isProcessing ? 'Processing...' : 'Format JSON';
    }

    if (this.elements.copyBtn) {
      this.elements.copyBtn.disabled = isProcessing;
    }

    // Add processing class to main container
    const mainContainer = document.querySelector('.app-main');
    if (mainContainer) {
      if (isProcessing) {
        mainContainer.classList.add('processing');
      } else {
        mainContainer.classList.remove('processing');
      }
    }
  }

  /**
   * Updates format selection UI
   * @param {string} format - Selected format ('formatted' or 'minified')
   * @private
   */
  _updateFormatSelection(format) {
    if (format === 'minified' && this.elements.formatMinified) {
      this.elements.formatMinified.checked = true;
    } else if (format === 'formatted' && this.elements.formatFormatted) {
      this.elements.formatFormatted.checked = true;
    }
  }

  /**
   * Updates input statistics
   * @private
   */
  _updateInputStats() {
    if (!this.elements.jsonInput || !this.elements.inputStats) return;

    const content = this.elements.jsonInput.value;
    const size = new Blob([content]).size;
    const lines = content.split('\n').length;
    const chars = content.length;

    this.elements.inputStats.textContent = `${chars} chars, ${lines} lines, ${this._formatBytes(size)}`;
  }

  /**
   * Updates output statistics
   * @private
   */
  _updateOutputStats() {
    if (!this.elements.jsonOutput || !this.elements.outputStats) return;

    const content = this.elements.jsonOutput.textContent;
    const size = new Blob([content]).size;
    const lines = content.split('\n').length;
    const chars = content.length;

    this.elements.outputStats.textContent = `${chars} chars, ${lines} lines, ${this._formatBytes(size)}`;
  }

  /**
   * Enables or disables the copy button
   * @param {boolean} enabled - Whether to enable the button
   */
  setCopyButtonEnabled(enabled) {
    if (this.elements.copyBtn) {
      this.elements.copyBtn.disabled = !enabled;
    }
  }

  /**
   * Gets the current input content
   * @returns {string} Current input content
   */
  getInputContent() {
    return this.elements.jsonInput ? this.elements.jsonInput.value : '';
  }

  /**
   * Gets the current output content
   * @returns {string} Current output content
   */
  getOutputContent() {
    return this.elements.jsonOutput ? this.elements.jsonOutput.textContent : '';
  }

  /**
   * Gets the selected format
   * @returns {string} Selected format ('formatted' or 'minified')
   */
  getSelectedFormat() {
    if (this.elements.formatMinified && this.elements.formatMinified.checked) {
      return 'minified';
    }
    return 'formatted';
  }

  /**
   * Gets the selected indentation size
   * @returns {number} Selected indentation size
   */
  getSelectedIndentation() {
    if (this.elements.indentSize) {
      return parseInt(this.elements.indentSize.value, 10);
    }
    return 2;
  }

  /**
   * Sets up event listeners
   */
  setupEventListeners() {
    // Input events
    if (this.elements.jsonInput) {
      this.elements.jsonInput.addEventListener('input', () => {
        this._updateInputStats();
        this.hideError();
        this._hideSuccessMessage();
      });
    }

    // Clear buttons
    if (this.elements.clearInputBtn) {
      this.elements.clearInputBtn.addEventListener('click', () => {
        this.updateInputArea('');
        this.hideError();
        this._hideSuccessMessage();
      });
    }

    if (this.elements.clearOutputBtn) {
      this.elements.clearOutputBtn.addEventListener('click', () => {
        this.updateOutputArea('');
        this.setCopyButtonEnabled(false);
      });
    }

    // Error close button
    if (this.elements.closeErrorBtn) {
      this.elements.closeErrorBtn.addEventListener('click', () => {
        this.hideError();
      });
    }

    // Format change events
    if (this.elements.formatFormatted) {
      this.elements.formatFormatted.addEventListener('change', () => {
        this.state.currentFormat = 'formatted';
      });
    }

    if (this.elements.formatMinified) {
      this.elements.formatMinified.addEventListener('change', () => {
        this.state.currentFormat = 'minified';
      });
    }
  }

  /**
   * Formats bytes into human-readable string
   * @param {number} bytes - Number of bytes
   * @returns {string} Formatted string
   * @private
   */
  _formatBytes(bytes) {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }
}
