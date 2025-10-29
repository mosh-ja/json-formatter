import { JSONDocument } from '../../src/js/modules/JSONDocument.js';

describe('JSONDocument', () => {
  let document;

  beforeEach(() => {
    document = new JSONDocument();
  });

  describe('constructor', () => {
    test('should initialize with empty content', () => {
      expect(document.rawContent).toBe('');
      expect(document.formattedContent).toBe('');
      expect(document.minifiedContent).toBe('');
      expect(document.isValid).toBe(false);
      expect(document.errorMessage).toBe(null);
      expect(document.errorPosition).toBe(null);
      expect(document.size).toBe(0);
    });
  });

  describe('setRawContent', () => {
    test('should update raw content and reset state', () => {
      const content = '{"test": "value"}';
      document.setRawContent(content);

      expect(document.rawContent).toBe(content);
      expect(document.formattedContent).toBe('');
      expect(document.minifiedContent).toBe('');
      expect(document.isValid).toBe(false);
      expect(document.errorMessage).toBe(null);
      expect(document.errorPosition).toBe(null);
    });

    test('should handle empty content', () => {
      document.setRawContent('');
      expect(document.rawContent).toBe('');
      expect(document.size).toBe(0);
    });
  });

  describe('setFormattedContent', () => {
    test('should set formatted content', () => {
      const formatted = '{\n  "test": "value"\n}';
      document.setFormattedContent(formatted);
      expect(document.formattedContent).toBe(formatted);
    });
  });

  describe('setMinifiedContent', () => {
    test('should set minified content', () => {
      const minified = '{"test":"value"}';
      document.setMinifiedContent(minified);
      expect(document.minifiedContent).toBe(minified);
    });
  });

  describe('setValidationState', () => {
    test('should set valid state', () => {
      document.setValidationState(true);
      expect(document.isValid).toBe(true);
      expect(document.errorMessage).toBe(null);
      expect(document.errorPosition).toBe(null);
    });

    test('should set invalid state with error', () => {
      document.setValidationState(false, 'Invalid JSON', 10);
      expect(document.isValid).toBe(false);
      expect(document.errorMessage).toBe('Invalid JSON');
      expect(document.errorPosition).toBe(10);
    });
  });

  describe('getContent', () => {
    test('should return formatted content by default', () => {
      document.setFormattedContent('{\n  "test": "value"\n}');
      expect(document.getContent()).toBe('{\n  "test": "value"\n}');
    });

    test('should return minified content when requested', () => {
      document.setMinifiedContent('{"test":"value"}');
      expect(document.getContent('minified')).toBe('{"test":"value"}');
    });

    test('should fallback to raw content if formatted not available', () => {
      document.setRawContent('{"test":"value"}');
      expect(document.getContent('formatted')).toBe('{"test":"value"}');
    });
  });

  describe('hasProcessedContent', () => {
    test('should return false for unprocessed document', () => {
      expect(document.hasProcessedContent()).toBe(false);
    });

    test('should return true when formatted content exists', () => {
      document.setFormattedContent('{\n  "test": "value"\n}');
      expect(document.hasProcessedContent()).toBe(true);
    });

    test('should return true when minified content exists', () => {
      document.setMinifiedContent('{"test":"value"}');
      expect(document.hasProcessedContent()).toBe(true);
    });
  });

  describe('isEmpty', () => {
    test('should return true for empty content', () => {
      expect(document.isEmpty()).toBe(true);
    });

    test('should return true for whitespace only', () => {
      document.setRawContent('   \n\t  ');
      expect(document.isEmpty()).toBe(true);
    });

    test('should return false for content', () => {
      document.setRawContent('{"test": "value"}');
      expect(document.isEmpty()).toBe(false);
    });
  });

  describe('validateSize', () => {
    test('should validate size within limit', () => {
      document.setRawContent('{"test": "value"}');
      expect(document.validateSize(1000)).toBe(true);
    });

    test('should reject size over limit', () => {
      const largeContent = 'x'.repeat(2000);
      document.setRawContent(largeContent);
      expect(document.validateSize(1000)).toBe(false);
    });
  });

  describe('clone', () => {
    test('should create identical copy', () => {
      document.setRawContent('{"test": "value"}');
      document.setFormattedContent('{\n  "test": "value"\n}');
      document.setMinifiedContent('{"test":"value"}');
      document.setValidationState(true);

      const cloned = document.clone();

      expect(cloned.rawContent).toBe(document.rawContent);
      expect(cloned.formattedContent).toBe(document.formattedContent);
      expect(cloned.minifiedContent).toBe(document.minifiedContent);
      expect(cloned.isValid).toBe(document.isValid);
      expect(cloned.errorMessage).toBe(document.errorMessage);
      expect(cloned.errorPosition).toBe(document.errorPosition);
    });
  });
});
