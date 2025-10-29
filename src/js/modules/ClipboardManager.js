/**
 * ClipboardManager - Handles clipboard operations with fallback support
 */
export class ClipboardManager {
  constructor() {
    this.isSupported = this._checkClipboardSupport();
    this.fallbackSupported = this._checkFallbackSupport();
  }

  /**
   * Copies text to clipboard
   * @param {string} text - Text to copy
   * @returns {Promise<Object>} Copy result
   */
  async copyToClipboard(text) {
    const result = {
      success: false,
      method: null,
      error: null
    };

    if (!text || typeof text !== 'string') {
      result.error = 'No text provided';
      return result;
    }

    // Try modern Clipboard API first
    if (this.isSupported) {
      try {
        await navigator.clipboard.writeText(text);
        result.success = true;
        result.method = 'clipboard-api';
        return result;
      } catch (error) {
        console.warn('Clipboard API failed:', error);
        // Fall through to fallback method
      }
    }

    // Try fallback method
    if (this.fallbackSupported) {
      try {
        const success = this._fallbackCopyToClipboard(text);
        if (success) {
          result.success = true;
          result.method = 'fallback';
          return result;
        }
      } catch (error) {
        console.warn('Fallback copy failed:', error);
      }
    }

    result.error = 'Clipboard access not supported or failed';
    return result;
  }

  /**
   * Reads text from clipboard
   * @returns {Promise<Object>} Read result
   */
  async readFromClipboard() {
    const result = {
      success: false,
      text: '',
      method: null,
      error: null
    };

    // Try modern Clipboard API first
    if (this.isSupported) {
      try {
        const text = await navigator.clipboard.readText();
        result.success = true;
        result.text = text;
        result.method = 'clipboard-api';
        return result;
      } catch (error) {
        console.warn('Clipboard API read failed:', error);
        // Fall through to fallback method
      }
    }

    result.error = 'Clipboard read not supported or failed';
    return result;
  }

  /**
   * Checks if clipboard operations are supported
   * @returns {boolean} True if clipboard is supported
   */
  isClipboardSupported() {
    return this.isSupported || this.fallbackSupported;
  }

  /**
   * Gets clipboard support information
   * @returns {Object} Support information
   */
  getSupportInfo() {
    return {
      clipboardAPI: this.isSupported,
      fallback: this.fallbackSupported,
      overall: this.isClipboardSupported()
    };
  }

  /**
   * Requests clipboard permission (if needed)
   * @returns {Promise<boolean>} True if permission granted
   */
  async requestPermission() {
    if (!this.isSupported) {
      return false;
    }

    try {
      const permission = await navigator.permissions.query({ name: 'clipboard-write' });
      return permission.state === 'granted' || permission.state === 'prompt';
    } catch (error) {
      console.warn('Permission check failed:', error);
      return false;
    }
  }

  /**
   * Checks if modern Clipboard API is supported
   * @returns {boolean} True if supported
   * @private
   */
  _checkClipboardSupport() {
    return !!(navigator.clipboard &&
              navigator.clipboard.writeText &&
              navigator.clipboard.readText);
  }

  /**
   * Checks if fallback copy method is supported
   * @returns {boolean} True if supported
   * @private
   */
  _checkFallbackSupport() {
    return !!(document.execCommand &&
              document.queryCommandSupported &&
              document.queryCommandSupported('copy'));
  }

  /**
   * Fallback copy method using document.execCommand
   * @param {string} text - Text to copy
   * @returns {boolean} True if successful
   * @private
   */
  _fallbackCopyToClipboard(text) {
    try {
      // Create a temporary textarea element
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);

      // Select and copy
      textArea.focus();
      textArea.select();

      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);

      return successful;
    } catch (error) {
      console.warn('Fallback copy failed:', error);
      return false;
    }
  }

  /**
   * Shows a temporary notification
   * @param {string} message - Message to show
   * @param {number} duration - Duration in milliseconds
   */
  showNotification(message, duration = 2000) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'clipboard-notification';
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 12px 20px;
      border-radius: 4px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.2);
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      opacity: 0;
      transform: translateY(-20px);
      transition: all 0.3s ease;
    `;

    document.body.appendChild(notification);

    // Animate in
    requestAnimationFrame(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateY(0)';
    });

    // Remove after duration
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateY(-20px)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, duration);
  }
}
