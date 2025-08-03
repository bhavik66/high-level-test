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

## Technologies Used

The project leverages the following main technologies and libraries:

- **React 19** – UI library
- **TypeScript 5** – static typing
- **Vite 7** – lightning-fast build tool and dev server
- **Tailwind CSS 4** – utility-first styling
- **Radix UI** – accessible primitive components
- **TanStack React Query 5** – data-fetching & caching
- **React Router 7** – client-side routing
- **React Hook Form** – form state management
- **Zod** – schema validation
- **Express 4** – lightweight mock API server
- **ESLint & Prettier** – linting and code formatting

Feel free to inspect `package.json` for the full list of dependencies.

## Running the Project Locally

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the Vite dev server:

   ```bash
   npm run dev
   ```

3. In a separate terminal, start the mock API server (optional but required for full functionality):

   ```bash
   npm run server:dev
   ```

4. Open http://localhost:5173 in your browser (default port). The Express server runs on http://localhost:3001.

To create a production build and preview it locally:

```bash
npm run build      # build for production
npm run preview    # locally preview production build
```

---
