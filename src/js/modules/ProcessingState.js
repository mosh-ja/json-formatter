/**
 * ProcessingState - Tracks the current state of JSON processing operations
 */
export class ProcessingState {
  constructor() {
    this.isProcessing = false;
    this.processingType = null;
    this.progress = 0;
    this.startTime = null;
    this.endTime = null;
  }

  /**
   * Starts a processing operation
   * @param {string} type - Type of processing ('format' | 'minify' | 'validate')
   */
  startProcessing(type) {
    this.isProcessing = true;
    this.processingType = type;
    this.progress = 0;
    this.startTime = new Date();
    this.endTime = null;
  }

  /**
   * Updates processing progress
   * @param {number} progress - Progress percentage (0-100)
   */
  updateProgress(progress) {
    if (this.isProcessing) {
      this.progress = Math.max(0, Math.min(100, progress));
    }
  }

  /**
   * Completes the processing operation
   */
  completeProcessing() {
    this.isProcessing = false;
    this.progress = 100;
    this.endTime = new Date();
  }

  /**
   * Cancels the processing operation
   */
  cancelProcessing() {
    this.isProcessing = false;
    this.processingType = null;
    this.progress = 0;
    this.endTime = new Date();
  }

  /**
   * Resets the processing state
   */
  reset() {
    this.isProcessing = false;
    this.processingType = null;
    this.progress = 0;
    this.startTime = null;
    this.endTime = null;
  }

  /**
   * Gets the processing duration in milliseconds
   * @returns {number|null} Duration in ms, or null if not completed
   */
  getDuration() {
    if (!this.startTime) return null;

    const endTime = this.endTime || new Date();
    return endTime.getTime() - this.startTime.getTime();
  }

  /**
   * Gets the processing duration as a formatted string
   * @returns {string} Formatted duration string
   */
  getFormattedDuration() {
    const duration = this.getDuration();
    if (duration === null) return 'Not started';

    if (duration < 1000) {
      return `${duration}ms`;
    } else if (duration < 60000) {
      return `${(duration / 1000).toFixed(1)}s`;
    } else {
      const minutes = Math.floor(duration / 60000);
      const seconds = Math.floor((duration % 60000) / 1000);
      return `${minutes}m ${seconds}s`;
    }
  }

  /**
   * Checks if processing is taking too long
   * @param {number} timeoutMs - Timeout threshold in milliseconds
   * @returns {boolean} True if processing has exceeded timeout
   */
  isTimedOut(timeoutMs = 10000) {
    if (!this.isProcessing || !this.startTime) return false;

    const elapsed = new Date().getTime() - this.startTime.getTime();
    return elapsed > timeoutMs;
  }

  /**
   * Gets the current processing status
   * @returns {Object} Status information
   */
  getStatus() {
    return {
      isProcessing: this.isProcessing,
      processingType: this.processingType,
      progress: this.progress,
      startTime: this.startTime,
      endTime: this.endTime,
      duration: this.getDuration(),
      formattedDuration: this.getFormattedDuration()
    };
  }

  /**
   * Creates a copy of the processing state
   * @returns {ProcessingState} New ProcessingState instance
   */
  clone() {
    const cloned = new ProcessingState();
    cloned.isProcessing = this.isProcessing;
    cloned.processingType = this.processingType;
    cloned.progress = this.progress;
    cloned.startTime = this.startTime ? new Date(this.startTime) : null;
    cloned.endTime = this.endTime ? new Date(this.endTime) : null;
    return cloned;
  }
}
