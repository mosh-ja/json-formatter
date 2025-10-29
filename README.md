# json-formatter

A clean, intuitive JSON formatter and validator web application built with vanilla JavaScript and Vite. Format, validate, and copy JSON with ease - no registration required.

## Features

- ✨ **Format JSON** - Pretty print with customizable indentation (2, 4, or 8 spaces)
- 🗜️ **Minify JSON** - Compress JSON to single line
- ✅ **Validate JSON** - Real-time validation with detailed error messages
- 📋 **Copy to Clipboard** - One-click copying of formatted output
- 💾 **Persistent Settings** - Your preferences are saved locally
- 📱 **Responsive Design** - Works on desktop and mobile devices
- ♿ **Accessible** - Built with ARIA labels and keyboard navigation

## Quick Start

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/json-formatter.git
   cd json-formatter
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000` and will automatically open in your browser.

4. **Build for production**
   ```bash
   npm run build
   ```

   The built files will be in the `dist/` directory.

5. **Preview the production build**
   ```bash
   npm run preview
   ```

### Testing

Run the test suite using Jest:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

Test coverage reports will be generated in the `coverage/` directory.

## Deployment

### GitHub Pages (Recommended)

This project is configured for automatic deployment to GitHub Pages:

1. **Enable GitHub Pages**
   - Go to your repository settings
   - Navigate to "Pages" section
   - Set source to "Deploy from a branch"
   - Select `main` branch and `/ (root)` folder
   - Click "Save"

2. **Set up GitHub Actions** (if not already present)

   Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: [ main ]
     pull_request:
       branches: [ main ]

   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest

       steps:
       - name: Checkout
         uses: actions/checkout@v4

       - name: Setup Node.js
         uses: actions/setup-node@v4
         with:
           node-version: '18'
           cache: 'npm'

       - name: Install dependencies
         run: npm ci

       - name: Run tests
         run: npm test

       - name: Build
         run: npm run build

       - name: Deploy to GitHub Pages
         uses: peaceiris/actions-gh-pages@v3
         if: github.ref == 'refs/heads/main'
         with:
           github_token: ${{ secrets.GITHUB_TOKEN }}
           publish_dir: ./dist
   ```

3. **Manual deployment**
   ```bash
   # Build the project
   npm run build

   # Deploy to GitHub Pages (requires gh-pages package)
   npx gh-pages -d dist
   ```

### Other Hosting Platforms

The built files in the `dist/` directory can be deployed to any static hosting service:

- **Netlify**: Drag and drop the `dist/` folder to Netlify
- **Vercel**: Connect your GitHub repository or upload the `dist/` folder
- **Firebase Hosting**: Use `firebase deploy` after building
- **AWS S3**: Upload the `dist/` contents to an S3 bucket with static website hosting

## Project Structure

```
json-formatter/
├── src/                    # Source files
│   ├── css/               # Stylesheets
│   ├── js/                # JavaScript modules
│   │   ├── modules/       # Core application modules
│   │   └── workers/       # Web Workers (if any)
│   └── index.html         # Main HTML file
├── dist/                  # Built files (generated)
├── tests/                 # Test files
├── specs/                 # Project specifications
├── package.json           # Dependencies and scripts
├── vite.config.js         # Vite configuration
└── jest.config.js         # Jest test configuration
```

## Configuration

### Vite Configuration

The app uses Vite for development and building. Key configurations:

- **Base path**: Set to `/json-formatter/` for GitHub Pages
- **Source directory**: `src/`
- **Output directory**: `dist/`
- **Development server**: Runs on port 3000

### Browser Support

The app supports modern browsers with ES6+ support:
- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage

### Adding Features

1. Create new modules in `src/js/modules/`
2. Import and use in `src/js/main.js`
3. Add corresponding tests in `tests/`
4. Update this README if needed

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-username/json-formatter/issues) page
2. Create a new issue with detailed information
3. Include steps to reproduce any bugs

---

## Spec-Kit Steps

1. Install/upgrade the tool.
```
uv tool install specify-cli --force --from git+https://github.com/github/spec-kit.git
```

2. Specify init
```
specify init --here --ai cursor-agent  --script sh
```

3. Constitution prompt
```
/speckit.constitution Keep it simple and follow best practices
```

4. Specify prompt (describe the goal)
```
/speckit.specify Build a JSON formatting app that will be deployed on GitHub Pages
```

5. Clarify prompt
```
/speckit.clarify Anything that needs clarification?
```

6. Plan prompt
```
/speckit.plan Use a common and straightforward approach. Include the deployment to Github pages.
```

7. Tasks prompt
```
/speckit.tasks
```

8. Implement prompt
```
/speckit.implement Implement the tasks. If there's a problem and you find yourself going in circles, stop and talk to me.
```

9. Update the README
```
Update the @README.md with instructions on how to deploy, test, and run the app both locally and remotely
```

Built with ❤️ for developers who need a simple, reliable JSON formatter.
