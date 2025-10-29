# Data Model: JSON Formatter Web App

## Core Entities

### JSONDocument
**Purpose:** Represents the JSON data being processed by the application

**Fields:**
- `rawContent` (string): The original unformatted JSON input
- `formattedContent` (string): The formatted JSON output with proper indentation
- `minifiedContent` (string): The minified JSON output without whitespace
- `isValid` (boolean): Whether the JSON is syntactically valid
- `errorMessage` (string|null): Error message if JSON is invalid
- `errorPosition` (number|null): Character position where error occurred
- `size` (number): Size of the JSON content in bytes
- `lastModified` (Date): Timestamp of last modification

**Validation Rules:**
- `rawContent` must be a non-empty string
- `size` must be less than 1MB (1,048,576 bytes)
- `isValid` must be true if `errorMessage` is null
- `errorPosition` must be null if `isValid` is true

**State Transitions:**
- `Empty` → `Processing` → `Valid` | `Invalid`
- `Valid` → `Processing` → `Valid` | `Invalid`
- `Invalid` → `Processing` → `Valid` | `Invalid`

### UserPreferences
**Purpose:** Stores user interface preferences and settings

**Fields:**
- `indentationSize` (number): Number of spaces for indentation (default: 2)
- `outputFormat` (string): Current output format ('formatted' | 'minified')
- `theme` (string): UI theme preference ('light' | 'dark' | 'auto')
- `autoFormat` (boolean): Whether to auto-format on input change
- `showLineNumbers` (boolean): Whether to display line numbers in output
- `fontSize` (number): Font size for text areas (default: 14)

**Validation Rules:**
- `indentationSize` must be between 1 and 8
- `outputFormat` must be one of the allowed values
- `theme` must be one of the allowed values
- `fontSize` must be between 10 and 24

### ProcessingState
**Purpose:** Tracks the current state of JSON processing operations

**Fields:**
- `isProcessing` (boolean): Whether processing is currently active
- `processingType` (string|null): Type of processing ('format' | 'minify' | 'validate')
- `progress` (number): Processing progress (0-100)
- `startTime` (Date|null): When processing started
- `endTime` (Date|null): When processing completed

**Validation Rules:**
- `progress` must be between 0 and 100
- `endTime` must be null if `isProcessing` is true
- `startTime` must be null if `isProcessing` is false

### ErrorInfo
**Purpose:** Detailed error information for JSON parsing failures

**Fields:**
- `message` (string): Human-readable error message
- `type` (string): Error type ('syntax' | 'validation' | 'size' | 'unknown')
- `position` (number): Character position where error occurred
- `line` (number|null): Line number where error occurred
- `column` (number|null): Column number where error occurred
- `suggestion` (string|null): Suggested fix for the error

**Validation Rules:**
- `message` must be non-empty
- `type` must be one of the allowed values
- `position` must be non-negative
- `line` and `column` must be positive if not null

## Data Relationships

### JSONDocument ↔ UserPreferences
- **Relationship:** One-to-One
- **Description:** Each JSON document uses the current user preferences for formatting
- **Implementation:** JSONDocument references UserPreferences for formatting options

### JSONDocument ↔ ProcessingState
- **Relationship:** One-to-One
- **Description:** Each JSON document has an associated processing state
- **Implementation:** ProcessingState tracks the processing of a specific JSONDocument

### JSONDocument ↔ ErrorInfo
- **Relationship:** One-to-Zero-or-One
- **Description:** A JSON document may have error information if it's invalid
- **Implementation:** ErrorInfo is only created when JSONDocument.isValid is false

## State Management

### Application State
The application maintains a single state object containing:
- `currentDocument` (JSONDocument): The currently active JSON document
- `userPreferences` (UserPreferences): User's UI preferences
- `processingState` (ProcessingState): Current processing status
- `clipboardState` (object): Clipboard operation status and feedback

### State Updates
- **Document Changes:** Triggered by user input in the textarea
- **Preference Changes:** Triggered by user interactions with UI controls
- **Processing Updates:** Triggered by JSON processing operations
- **Error Updates:** Triggered by JSON validation failures

## Data Persistence

### Local Storage
- `userPreferences` persisted in localStorage
- `recentDocuments` array (last 5 documents) for quick access
- `applicationVersion` for migration handling

### Session Storage
- `currentDocument` persisted during browser session
- `processingState` for maintaining state across page refreshes

## Validation Rules Summary

### JSONDocument Validation
1. Content size must not exceed 1MB
2. Raw content must be a valid string
3. Error state consistency (error fields null when valid)
4. Content integrity (formatted/minified derived from raw)

### UserPreferences Validation
1. Numeric values within defined ranges
2. Enum values must match allowed options
3. Boolean values for toggle options
4. Default value fallbacks for missing preferences

### ProcessingState Validation
1. Progress values between 0-100
2. Time consistency (end after start)
3. State consistency (processing flags match timestamps)
4. Type validation for processing operations
