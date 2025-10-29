/**
 * UserPreferences - Stores user interface preferences and settings
 */
export class UserPreferences {
  constructor() {
    this.indentationSize = 2;
    this.outputFormat = 'formatted';
    this.theme = 'auto';
    this.autoFormat = false;
    this.showLineNumbers = false;
    this.fontSize = 14;
  }

  /**
   * Creates UserPreferences from a data object
   * @param {Object} data - Preference data
   * @returns {UserPreferences} New instance with loaded data
   */
  static fromData(data) {
    const preferences = new UserPreferences();

    if (data) {
      preferences.indentationSize = UserPreferences._validateIndentationSize(data.indentationSize);
      preferences.outputFormat = UserPreferences._validateOutputFormat(data.outputFormat);
      preferences.theme = UserPreferences._validateTheme(data.theme);
      preferences.autoFormat = Boolean(data.autoFormat);
      preferences.showLineNumbers = Boolean(data.showLineNumbers);
      preferences.fontSize = UserPreferences._validateFontSize(data.fontSize);
    }

    return preferences;
  }

  /**
   * Converts preferences to a plain object for storage
   * @returns {Object} Plain object representation
   */
  toData() {
    return {
      indentationSize: this.indentationSize,
      outputFormat: this.outputFormat,
      theme: this.theme,
      autoFormat: this.autoFormat,
      showLineNumbers: this.showLineNumbers,
      fontSize: this.fontSize
    };
  }

  /**
   * Sets indentation size with validation
   * @param {number} size - Number of spaces (1-8)
   */
  setIndentationSize(size) {
    this.indentationSize = UserPreferences._validateIndentationSize(size);
  }

  /**
   * Sets output format with validation
   * @param {string} format - 'formatted' or 'minified'
   */
  setOutputFormat(format) {
    this.outputFormat = UserPreferences._validateOutputFormat(format);
  }

  /**
   * Sets theme with validation
   * @param {string} theme - 'light', 'dark', or 'auto'
   */
  setTheme(theme) {
    this.theme = UserPreferences._validateTheme(theme);
  }

  /**
   * Sets font size with validation
   * @param {number} size - Font size (10-24)
   */
  setFontSize(size) {
    this.fontSize = UserPreferences._validateFontSize(size);
  }

  /**
   * Toggles auto format setting
   */
  toggleAutoFormat() {
    this.autoFormat = !this.autoFormat;
  }

  /**
   * Toggles line numbers setting
   */
  toggleLineNumbers() {
    this.showLineNumbers = !this.showLineNumbers;
  }

  /**
   * Gets the effective theme (resolves 'auto' to actual theme)
   * @returns {string} 'light' or 'dark'
   */
  getEffectiveTheme() {
    if (this.theme === 'auto') {
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return this.theme;
  }

  /**
   * Checks if preferences have changed from defaults
   * @returns {boolean} True if any preference differs from default
   */
  hasCustomSettings() {
    const defaults = new UserPreferences();
    return (
      this.indentationSize !== defaults.indentationSize ||
      this.outputFormat !== defaults.outputFormat ||
      this.theme !== defaults.theme ||
      this.autoFormat !== defaults.autoFormat ||
      this.showLineNumbers !== defaults.showLineNumbers ||
      this.fontSize !== defaults.fontSize
    );
  }

  /**
   * Resets all preferences to defaults
   */
  resetToDefaults() {
    this.indentationSize = 2;
    this.outputFormat = 'formatted';
    this.theme = 'auto';
    this.autoFormat = false;
    this.showLineNumbers = false;
    this.fontSize = 14;
  }

  /**
   * Validates indentation size
   * @param {number} size - Size to validate
   * @returns {number} Valid size (1-8)
   * @private
   */
  static _validateIndentationSize(size) {
    const num = parseInt(size, 10);
    return (num >= 1 && num <= 8) ? num : 2;
  }

  /**
   * Validates output format
   * @param {string} format - Format to validate
   * @returns {string} Valid format
   * @private
   */
  static _validateOutputFormat(format) {
    return ['formatted', 'minified'].includes(format) ? format : 'formatted';
  }

  /**
   * Validates theme
   * @param {string} theme - Theme to validate
   * @returns {string} Valid theme
   * @private
   */
  static _validateTheme(theme) {
    return ['light', 'dark', 'auto'].includes(theme) ? theme : 'auto';
  }

  /**
   * Validates font size
   * @param {number} size - Size to validate
   * @returns {number} Valid size (10-24)
   * @private
   */
  static _validateFontSize(size) {
    const num = parseInt(size, 10);
    return (num >= 10 && num <= 24) ? num : 14;
  }
}
