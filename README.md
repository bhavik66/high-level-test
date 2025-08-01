# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR, ESLint, and Prettier for code formatting.

## Code Formatting Setup

This project is configured with **Prettier** and **ESLint** for consistent code formatting and linting. The setup includes:

- **Prettier**: Code formatter with consistent style rules
- **ESLint**: Code linting with TypeScript and React support
- **VS Code Integration**: Automatic formatting on save and recommended extensions

### Available Scripts

```bash
# Format all files with Prettier
npm run format

# Check if files are properly formatted (useful for CI)
npm run format:check

# Run ESLint to check for issues
npm run lint

# Run ESLint and automatically fix issues
npm run lint:fix
```

### VS Code Setup

The project includes VS Code workspace settings that will:

- Format code automatically on save using Prettier
- Run ESLint fixes on save
- Organize imports automatically
- Provide recommended extensions for the best development experience

Make sure you have the following VS Code extensions installed:

- Prettier - Code formatter
- ESLint
- TypeScript and JavaScript Language Features

### Configuration Files

- `.prettierrc`: Prettier configuration with common React/TypeScript settings
- `.prettierignore`: Files to exclude from formatting
- `eslint.config.js`: ESLint configuration with Prettier integration
- `.vscode/settings.json`: VS Code workspace settings
- `.vscode/extensions.json`: Recommended VS Code extensions

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
