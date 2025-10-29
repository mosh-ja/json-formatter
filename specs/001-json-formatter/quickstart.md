# Quickstart Guide: JSON Formatter Web App

## Overview
This guide provides a quick start for developers working on the JSON Formatter web application. It covers setup, development workflow, and deployment procedures.

## Prerequisites
- Node.js 18+ and npm
- Git
- Modern web browser (Chrome, Firefox, Safari, Edge)
- GitHub account (for deployment)

## Project Setup

### 1. Clone and Install
```bash
git clone <repository-url>
cd json-formatter
npm install
```

### 2. Development Server
```bash
npm run dev
```
Opens the application at `http://localhost:5173` with hot module replacement.

### 3. Build for Production
```bash
npm run build
```
Creates optimized build in `dist/` directory.

### 4. Preview Production Build
```bash
npm run preview
```
Serves the production build locally for testing.

## Project Structure
```
json-formatter/
├── src/
│   ├── js/
│   │   ├── modules/          # Core JavaScript modules
│   │   │   ├── JSONProcessor.js
│   │   │   ├── JSONValidator.js
│   │   │   ├── JSONFormatter.js
│   │   │   ├── ClipboardManager.js
│   │   │   ├── StorageManager.js
│   │   │   ├── UIManager.js
│   │   │   └── PerformanceManager.js
│   │   ├── workers/          # Web Worker files
│   │   │   └── json-worker.js
│   │   └── main.js           # Application entry point
│   ├── css/
│   │   ├── styles.css        # Main stylesheet
│   │   └── themes/           # Theme variations
│   ├── index.html            # Main HTML file
│   └── assets/               # Static assets
├── tests/
│   ├── unit/                 # Unit tests
│   ├── integration/          # Integration tests
│   └── fixtures/             # Test data
├── dist/                     # Production build output
├── .github/
│   └── workflows/            # GitHub Actions
├── package.json
├── vite.config.js           # Vite configuration
└── README.md
```

## Development Workflow

### 1. Feature Development
1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes following the coding standards
3. Write tests for new functionality
4. Run tests: `npm test`
5. Test in multiple browsers
6. Commit changes with descriptive messages

### 2. Testing
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- JSONProcessor.test.js
```

### 3. Code Quality
```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

## Key Modules

### JSONProcessor
Main processing module that coordinates JSON validation and formatting.

```javascript
import { JSONProcessor } from './modules/JSONProcessor.js';

const processor = new JSONProcessor();
const result = await processor.processJSON(input, {
  indentation: 2,
  outputFormat: 'formatted',
  validateOnly: false
});
```

### UIManager
Handles all user interface updates and interactions.

```javascript
import { UIManager } from './modules/UIManager.js';

const ui = new UIManager();
ui.updateInputArea(jsonString);
ui.updateOutputArea(formattedJson, 'formatted');
ui.showError(errorInfo);
```

### StorageManager
Manages user preferences and recent documents.

```javascript
import { StorageManager } from './modules/StorageManager.js';

const storage = new StorageManager();
storage.savePreferences(preferences);
const prefs = storage.loadPreferences();
```

## Configuration

### Vite Configuration
The `vite.config.js` file contains build configuration:

```javascript
export default {
  base: '/json-formatter/',  // GitHub Pages subdirectory
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true
  },
  server: {
    port: 5173,
    open: true
  }
};
```

### Package.json Scripts
- `dev`: Start development server
- `build`: Build for production
- `preview`: Preview production build
- `test`: Run test suite
- `lint`: Run ESLint
- `format`: Format code with Prettier

## Deployment

### GitHub Pages Deployment

#### Automatic Deployment (Recommended)
1. Push changes to `main` branch
2. GitHub Actions automatically builds and deploys
3. Site available at `https://username.github.io/json-formatter/`

#### Manual Deployment
1. Build the project: `npm run build`
2. Copy `dist/` contents to `gh-pages` branch
3. Push `gh-pages` branch to GitHub

### GitHub Actions Workflow
The `.github/workflows/deploy.yml` file handles automatic deployment:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: actions/deploy-pages@v4
        with:
          artifact_name: github-pages
```

## Browser Testing

### Supported Browsers
- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

### Testing Checklist
- [ ] JSON formatting works correctly
- [ ] Error handling displays properly
- [ ] Copy to clipboard functions
- [ ] Responsive design on different screen sizes
- [ ] Keyboard navigation works
- [ ] Screen reader compatibility
- [ ] Performance with large JSON files

## Performance Guidelines

### Bundle Size
- Target total bundle size < 500KB
- Use dynamic imports for non-critical features
- Minimize external dependencies

### Large File Handling
- Use Web Workers for files > 100KB
- Implement progress indicators
- Provide cancellation options

### Memory Management
- Clean up event listeners
- Dispose of Web Workers when done
- Limit recent documents cache size

## Troubleshooting

### Common Issues

#### Build Failures
- Check Node.js version (requires 18+)
- Clear node_modules and reinstall
- Verify all dependencies are installed

#### GitHub Pages Not Updating
- Check GitHub Actions workflow status
- Verify repository settings for Pages
- Ensure build artifacts are generated

#### Browser Compatibility Issues
- Test in multiple browsers
- Check console for JavaScript errors
- Verify feature support with caniuse.com

### Debug Mode
Enable debug logging by setting `localStorage.debug = 'json-formatter'` in browser console.

## Contributing

### Code Standards
- Use ES6+ features
- Follow existing code style
- Write comprehensive tests
- Document public APIs
- Use meaningful variable names

### Pull Request Process
1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request with description
5. Address review feedback
6. Merge after approval

## Resources

### Documentation
- [Vite Documentation](https://vitejs.dev/)
- [GitHub Pages Documentation](https://docs.github.com/pages)
- [Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API)
- [Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)

### Tools
- [JSON Validator](https://jsonlint.com/) - For testing JSON validation
- [Can I Use](https://caniuse.com/) - Browser compatibility checking
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Performance auditing
