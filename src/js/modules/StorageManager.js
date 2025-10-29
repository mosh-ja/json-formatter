/**
 * StorageManager - Handles localStorage operations and data persistence
 */
export class StorageManager {
  constructor() {
    this.storageKey = 'json-formatter';
    this.preferencesKey = `${this.storageKey}-preferences`;
    this.recentDocsKey = `${this.storageKey}-recent-docs`;
    this.versionKey = `${this.storageKey}-version`;
    this.maxRecentDocs = 5;
    this.maxDocSize = 10000; // 10KB max per recent doc
  }

  /**
   * Saves user preferences to localStorage
   * @param {UserPreferences} preferences - Preferences to save
   * @returns {boolean} True if saved successfully
   */
  savePreferences(preferences) {
    try {
      const data = preferences.toData();
      localStorage.setItem(this.preferencesKey, JSON.stringify(data));
      return true;
    } catch (error) {
      console.warn('Failed to save preferences:', error);
      return false;
    }
  }

  /**
   * Loads user preferences from localStorage
   * @returns {UserPreferences} Loaded preferences or default preferences
   */
  loadPreferences() {
    try {
      const data = localStorage.getItem(this.preferencesKey);
      if (data) {
        const parsed = JSON.parse(data);
        return UserPreferences.fromData(parsed);
      }
    } catch (error) {
      console.warn('Failed to load preferences:', error);
    }

    return new UserPreferences();
  }

  /**
   * Saves a recent document to localStorage
   * @param {JSONDocument} document - Document to save
   * @returns {boolean} True if saved successfully
   */
  saveRecentDocument(document) {
    try {
      // Don't save if document is too large or empty
      if (document.isEmpty() || document.size > this.maxDocSize) {
        return false;
      }

      const recentDocs = this.getRecentDocuments();

      // Remove existing document if it's the same
      const existingIndex = recentDocs.findIndex(doc => doc.rawContent === document.rawContent);
      if (existingIndex !== -1) {
        recentDocs.splice(existingIndex, 1);
      }

      // Add new document to the beginning
      const docData = {
        rawContent: document.rawContent,
        lastModified: document.lastModified.toISOString(),
        size: document.size
      };

      recentDocs.unshift(docData);

      // Keep only the most recent documents
      if (recentDocs.length > this.maxRecentDocs) {
        recentDocs.splice(this.maxRecentDocs);
      }

      localStorage.setItem(this.recentDocsKey, JSON.stringify(recentDocs));
      return true;
    } catch (error) {
      console.warn('Failed to save recent document:', error);
      return false;
    }
  }

  /**
   * Gets recent documents from localStorage
   * @returns {Array} Array of recent document data
   */
  getRecentDocuments() {
    try {
      const data = localStorage.getItem(this.recentDocsKey);
      if (data) {
        return JSON.parse(data);
      }
    } catch (error) {
      console.warn('Failed to load recent documents:', error);
    }

    return [];
  }

  /**
   * Clears recent documents from localStorage
   * @returns {boolean} True if cleared successfully
   */
  clearRecentDocuments() {
    try {
      localStorage.removeItem(this.recentDocsKey);
      return true;
    } catch (error) {
      console.warn('Failed to clear recent documents:', error);
      return false;
    }
  }

  /**
   * Removes a specific recent document
   * @param {string} rawContent - Raw content of document to remove
   * @returns {boolean} True if removed successfully
   */
  removeRecentDocument(rawContent) {
    try {
      const recentDocs = this.getRecentDocuments();
      const filteredDocs = recentDocs.filter(doc => doc.rawContent !== rawContent);

      if (filteredDocs.length !== recentDocs.length) {
        localStorage.setItem(this.recentDocsKey, JSON.stringify(filteredDocs));
        return true;
      }

      return false;
    } catch (error) {
      console.warn('Failed to remove recent document:', error);
      return false;
    }
  }

  /**
   * Saves application version to localStorage
   * @param {string} version - Version string
   * @returns {boolean} True if saved successfully
   */
  saveVersion(version) {
    try {
      localStorage.setItem(this.versionKey, version);
      return true;
    } catch (error) {
      console.warn('Failed to save version:', error);
      return false;
    }
  }

  /**
   * Gets saved application version
   * @returns {string|null} Version string or null
   */
  getVersion() {
    try {
      return localStorage.getItem(this.versionKey);
    } catch (error) {
      console.warn('Failed to get version:', error);
      return null;
    }
  }

  /**
   * Checks if storage is available and has space
   * @returns {Object} Storage availability information
   */
  checkStorageAvailability() {
    try {
      // Test if localStorage is available
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);

      // Estimate available space
      const usedSpace = this._estimateUsedSpace();
      const availableSpace = this._estimateAvailableSpace();

      return {
        available: true,
        usedSpace,
        availableSpace,
        usagePercentage: (usedSpace / (usedSpace + availableSpace)) * 100
      };
    } catch (error) {
      return {
        available: false,
        error: error.message
      };
    }
  }

  /**
   * Clears all application data from localStorage
   * @returns {boolean} True if cleared successfully
   */
  clearAllData() {
    try {
      localStorage.removeItem(this.preferencesKey);
      localStorage.removeItem(this.recentDocsKey);
      localStorage.removeItem(this.versionKey);
      return true;
    } catch (error) {
      console.warn('Failed to clear all data:', error);
      return false;
    }
  }

  /**
   * Gets storage usage statistics
   * @returns {Object} Storage usage information
   */
  getStorageStats() {
    const recentDocs = this.getRecentDocuments();
    const preferences = this.loadPreferences();

    return {
      recentDocumentsCount: recentDocs.length,
      recentDocumentsSize: recentDocs.reduce((total, doc) => total + (doc.size || 0), 0),
      hasCustomPreferences: preferences.hasCustomSettings(),
      version: this.getVersion(),
      availability: this.checkStorageAvailability()
    };
  }

  /**
   * Estimates used space in localStorage
   * @returns {number} Estimated used space in bytes
   * @private
   */
  _estimateUsedSpace() {
    let total = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return total;
  }

  /**
   * Estimates available space in localStorage
   * @returns {number} Estimated available space in bytes
   * @private
   */
  _estimateAvailableSpace() {
    // Most browsers have a 5-10MB limit for localStorage
    // This is a rough estimate
    const estimatedLimit = 5 * 1024 * 1024; // 5MB
    const usedSpace = this._estimateUsedSpace();
    return Math.max(0, estimatedLimit - usedSpace);
  }
}

// Import UserPreferences for type checking
import { UserPreferences } from './UserPreferences.js';
