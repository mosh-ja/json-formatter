/**
 * Main application entry point
 */
import { JSONDocument } from './modules/JSONDocument.js';
import { UserPreferences } from './modules/UserPreferences.js';
import { ProcessingState } from './modules/ProcessingState.js';
import { JSONProcessor } from './modules/JSONProcessor.js';
import { ClipboardManager } from './modules/ClipboardManager.js';
import { StorageManager } from './modules/StorageManager.js';
import { UIManager } from './modules/UIManager.js';

class JSONFormatterApp {
  constructor() {
    this.document = new JSONDocument();
    this.preferences = new UserPreferences();
    this.processingState = new ProcessingState();
    this.processor = new JSONProcessor();
    this.clipboardManager = new ClipboardManager();
    this.storageManager = new StorageManager();
    this.uiManager = new UIManager();

    this.init();
  }

  /**
   * Initializes the application
   */
  async init() {
    try {
      // Load user preferences
      this.preferences = this.storageManager.loadPreferences();

      // Set up UI
      this.uiManager.setupEventListeners();
      this.setupEventListeners();

      // Apply preferences to UI
      this.applyPreferences();

      // Check clipboard support
      if (!this.clipboardManager.isClipboardSupported()) {
        console.warn('Clipboard operations not supported');
      }

      console.log('JSON Formatter app initialized');
    } catch (error) {
      console.error('Failed to initialize app:', error);
      this.uiManager.showError('Failed to initialize application');
    }
  }

  /**
   * Sets up application event listeners
   */
  setupEventListeners() {
    // Format button
    const formatBtn = document.getElementById('format-btn');
    if (formatBtn) {
      formatBtn.addEventListener('click', () => this.handleFormat());
    }

    // Copy button
    const copyBtn = document.getElementById('copy-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => this.handleCopy());
    }

    // Format toggle
    const formatInputs = document.querySelectorAll('input[name="format"]');
    formatInputs.forEach(input => {
      input.addEventListener('change', () => this.handleFormatChange());
    });

    // Indentation change
    const indentSelect = document.getElementById('indent-size');
    if (indentSelect) {
      indentSelect.addEventListener('change', () => this.handleIndentationChange());
    }

    // Input change (for auto-format if enabled)
    const jsonInput = document.getElementById('json-input');
    if (jsonInput) {
      jsonInput.addEventListener('input', () => {
        this.handleInputChange();
      });
    }
  }

  /**
   * Handles format button click
   */
  async handleFormat() {
    const inputContent = this.uiManager.getInputContent();

    if (!inputContent.trim()) {
      this.uiManager.showError('Please enter some JSON to format');
      return;
    }

    try {
      this.uiManager.updateProcessingState(true, 'format');
      this.processingState.startProcessing('format');

      // Update document with new content
      this.document.setRawContent(inputContent);

      // Process JSON
      const result = this.processor.processWithFormat(
        inputContent,
        this.uiManager.getSelectedFormat(),
        {
          indentation: this.uiManager.getSelectedIndentation(),
          maxSize: this.processor.getOptions().maxSize
        }
      );

      if (result.success) {
        // Update document with results
        this.document.setFormattedContent(result.formatted);
        this.document.setMinifiedContent(result.minified);
        this.document.setValidationState(true);

        // Update UI
        this.uiManager.updateOutputArea(result.output, this.uiManager.getSelectedFormat());
        this.uiManager.setCopyButtonEnabled(true);

        // Save to recent documents
        this.storageManager.saveRecentDocument(this.document);

        this.uiManager.showSuccess('JSON formatted successfully!');
      } else {
        // Handle error
        this.document.setValidationState(false, result.error);
        this.uiManager.showError(result.error, result.errorInfo);
        this.uiManager.updateOutputArea('');
        this.uiManager.setCopyButtonEnabled(false);
      }
    } catch (error) {
      console.error('Format error:', error);
      this.uiManager.showError('Formatting failed: ' + error.message);
      this.uiManager.setCopyButtonEnabled(false);
    } finally {
      this.uiManager.updateProcessingState(false);
      this.processingState.completeProcessing();
    }
  }

  /**
   * Handles copy button click
   */
  async handleCopy() {
    const outputContent = this.uiManager.getOutputContent();

    if (!outputContent.trim()) {
      this.uiManager.showError('No content to copy');
      return;
    }

    try {
      const result = await this.clipboardManager.copyToClipboard(outputContent);

      if (result.success) {
        this.uiManager.showSuccess('Copied to clipboard!');
        this.clipboardManager.showNotification('Copied to clipboard!');
      } else {
        this.uiManager.showError('Failed to copy: ' + result.error);
      }
    } catch (error) {
      console.error('Copy error:', error);
      this.uiManager.showError('Copy failed: ' + error.message);
    }
  }

  /**
   * Handles format change
   */
  handleFormatChange() {
    const selectedFormat = this.uiManager.getSelectedFormat();
    const outputContent = this.document.getContent(selectedFormat);

    if (outputContent) {
      this.uiManager.updateOutputArea(outputContent, selectedFormat);
    }
  }

  /**
   * Handles indentation change
   */
  handleIndentationChange() {
    // If we have formatted content, reformat with new indentation
    if (this.document.hasProcessedContent() && this.document.isValid) {
      const inputContent = this.document.rawContent;
      const result = this.processor.formatOnly(inputContent, {
        indentation: this.uiManager.getSelectedIndentation()
      });

      if (result.success) {
        this.document.setFormattedContent(result.formatted);
        this.uiManager.updateOutputArea(
          this.document.getContent(this.uiManager.getSelectedFormat()),
          this.uiManager.getSelectedFormat()
        );
      }
    }
  }

  /**
   * Handles input change
   */
  handleInputChange() {
    // Auto-format if enabled
    if (this.preferences.autoFormat) {
      // Debounce auto-format
      clearTimeout(this.autoFormatTimeout);
      this.autoFormatTimeout = setTimeout(() => {
        this.handleFormat();
      }, 1000);
    }
  }

  /**
   * Applies user preferences to UI
   */
  applyPreferences() {
    // Set indentation
    const indentSelect = document.getElementById('indent-size');
    if (indentSelect) {
      indentSelect.value = this.preferences.indentationSize;
    }

    // Set format
    const formatInputs = document.querySelectorAll('input[name="format"]');
    formatInputs.forEach(input => {
      input.checked = input.value === this.preferences.outputFormat;
    });

    // Set font size
    const textareas = document.querySelectorAll('textarea, pre');
    textareas.forEach(element => {
      element.style.fontSize = this.preferences.fontSize + 'px';
    });

    // Apply theme
    this.applyTheme();
  }

  /**
   * Applies theme to the application
   */
  applyTheme() {
    const effectiveTheme = this.preferences.getEffectiveTheme();
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    document.body.classList.add(`theme-${effectiveTheme}`);
  }

  /**
   * Saves current preferences
   */
  savePreferences() {
    this.storageManager.savePreferences(this.preferences);
  }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.jsonFormatterApp = new JSONFormatterApp();
});

// Export for testing
export { JSONFormatterApp };
