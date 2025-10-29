# API Contract: JSON Formatter Web App

## Overview
This document defines the internal API contracts for the JSON Formatter web application. Since this is a client-side only application, these contracts define the JavaScript module interfaces and function signatures.

## Core Module: JSONProcessor

### `processJSON(input: string, options: ProcessingOptions): ProcessingResult`

**Purpose:** Main function for processing JSON input with formatting options

**Parameters:**
- `input` (string): Raw JSON string to process
- `options` (ProcessingOptions): Configuration for processing

**Returns:** `ProcessingResult` object

**ProcessingOptions Interface:**
```typescript
interface ProcessingOptions {
  indentation: number;        // Number of spaces for indentation (1-8)
  outputFormat: 'formatted' | 'minified';
  validateOnly: boolean;      // If true, only validate without formatting
  maxSize: number;           // Maximum file size in bytes (default: 1048576)
}
```

**ProcessingResult Interface:**
```typescript
interface ProcessingResult {
  success: boolean;
  content?: string;          // Formatted or minified JSON
  error?: ErrorInfo;         // Error details if processing failed
  processingTime: number;    // Processing time in milliseconds
  size: number;             // Size of processed content in bytes
}
```

**Error Handling:**
- Throws `ValidationError` for invalid JSON syntax
- Throws `SizeError` for files exceeding size limit
- Throws `ProcessingError` for other processing failures

## Module: JSONValidator

### `validateJSON(input: string): ValidationResult`

**Purpose:** Validates JSON syntax and returns detailed error information

**Parameters:**
- `input` (string): JSON string to validate

**Returns:** `ValidationResult` object

**ValidationResult Interface:**
```typescript
interface ValidationResult {
  isValid: boolean;
  error?: ErrorInfo;
  position?: number;         // Character position of error
  line?: number;            // Line number of error
  column?: number;          // Column number of error
}
```

**ErrorInfo Interface:**
```typescript
interface ErrorInfo {
  message: string;           // Human-readable error message
  type: 'syntax' | 'validation' | 'size' | 'unknown';
  position: number;         // Character position
  line?: number;           // Line number (if available)
  column?: number;         // Column number (if available)
  suggestion?: string;     // Suggested fix
}
```

## Module: JSONFormatter

### `formatJSON(input: string, indentation: number): string`

**Purpose:** Formats JSON with specified indentation

**Parameters:**
- `input` (string): Valid JSON string
- `indentation` (number): Number of spaces for indentation (1-8)

**Returns:** Formatted JSON string

**Throws:**
- `ValidationError` if input is not valid JSON
- `FormatError` if formatting fails

### `minifyJSON(input: string): string`

**Purpose:** Minifies JSON by removing unnecessary whitespace

**Parameters:**
- `input` (string): Valid JSON string

**Returns:** Minified JSON string

**Throws:**
- `ValidationError` if input is not valid JSON
- `FormatError` if minification fails

## Module: ClipboardManager

### `copyToClipboard(text: string): Promise<ClipboardResult>`

**Purpose:** Copies text to system clipboard

**Parameters:**
- `text` (string): Text to copy

**Returns:** Promise resolving to `ClipboardResult`

**ClipboardResult Interface:**
```typescript
interface ClipboardResult {
  success: boolean;
  error?: string;           // Error message if copy failed
}
```

**Browser Compatibility:**
- Uses modern Clipboard API when available
- Falls back to legacy `document.execCommand` for older browsers
- Handles permission errors gracefully

## Module: StorageManager

### `savePreferences(preferences: UserPreferences): void`

**Purpose:** Saves user preferences to localStorage

**Parameters:**
- `preferences` (UserPreferences): User preference object

**Throws:**
- `StorageError` if localStorage is unavailable or quota exceeded

### `loadPreferences(): UserPreferences`

**Purpose:** Loads user preferences from localStorage

**Returns:** UserPreferences object with defaults if none saved

**Throws:**
- `StorageError` if localStorage is unavailable

### `saveRecentDocument(document: JSONDocument): void`

**Purpose:** Saves document to recent documents list

**Parameters:**
- `document` (JSONDocument): Document to save

**Behavior:**
- Maintains list of last 5 documents
- Removes oldest when limit exceeded
- Stores only essential data (rawContent, lastModified)

## Module: UIManager

### `updateInputArea(content: string): void`

**Purpose:** Updates the input textarea content

**Parameters:**
- `content` (string): Content to display

**Side Effects:**
- Triggers input validation
- Updates character count display
- Enables/disables format button

### `updateOutputArea(content: string, format: string): void`

**Purpose:** Updates the output area with formatted content

**Parameters:**
- `content` (string): Formatted content to display
- `format` (string): Format type ('formatted' | 'minified')

**Side Effects:**
- Updates syntax highlighting
- Enables copy button
- Updates line numbers if enabled

### `showError(error: ErrorInfo): void`

**Purpose:** Displays error information to user

**Parameters:**
- `error` (ErrorInfo): Error details to display

**Side Effects:**
- Highlights error position in input
- Shows error message
- Disables format button

### `showSuccess(message: string, duration: number): void`

**Purpose:** Shows temporary success message

**Parameters:**
- `message` (string): Success message
- `duration` (number): Display duration in milliseconds

**Side Effects:**
- Displays temporary notification
- Auto-hides after duration

## Module: PerformanceManager

### `processWithWorker(input: string, options: ProcessingOptions): Promise<ProcessingResult>`

**Purpose:** Processes large JSON files using Web Worker

**Parameters:**
- `input` (string): JSON input
- `options` (ProcessingOptions): Processing configuration

**Returns:** Promise resolving to ProcessingResult

**Usage:**
- Automatically used for files > 100KB
- Falls back to synchronous processing if Web Worker unavailable
- Provides progress updates via callback

### `shouldUseWorker(input: string): boolean`

**Purpose:** Determines if Web Worker should be used

**Parameters:**
- `input` (string): JSON input to check

**Returns:** Boolean indicating if worker should be used

**Criteria:**
- File size > 100KB
- Web Worker support available
- Not in development mode

## Error Types

### `ValidationError`
- **Inherits:** Error
- **Properties:** `position`, `line`, `column`, `suggestion`
- **Usage:** JSON syntax validation failures

### `SizeError`
- **Inherits:** Error
- **Properties:** `maxSize`, `actualSize`
- **Usage:** File size limit exceeded

### `ProcessingError`
- **Inherits:** Error
- **Properties:** `operation`, `originalError`
- **Usage:** General processing failures

### `StorageError`
- **Inherits:** Error
- **Properties:** `operation`, `quotaExceeded`
- **Usage:** localStorage operation failures

## Event Contracts

### Custom Events
- `jsonProcessed`: Fired when JSON processing completes
- `errorOccurred`: Fired when an error occurs
- `preferencesChanged`: Fired when user preferences change
- `clipboardCopied`: Fired when copy operation completes

### Event Data
All custom events include relevant data in the `detail` property of the CustomEvent object.
