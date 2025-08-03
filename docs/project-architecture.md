# Project Architecture & Folder Structure

This document provides an overview of the project's architecture and the purpose of each folder and key files within the `src` directory. The backend/server-side code is **not** included in this overview.

## Top-Level Structure

```
src/
  api/
  components/
  config/
  features/
  hooks/
  lib/
  pages/
  providers/
  router/
  styles/
  types/
  utils/
  App.tsx
  main.tsx
  vite-env.d.ts
```

---

## Folder & File Descriptions

### `api/`

- **Purpose:** Contains API client logic, service layers, and type definitions for API interactions.
- **Subfolders:**
  - `clients/`: API client implementations (e.g., `ApiClient.ts`).
  - `services/`: Service logic for specific domains (e.g., `layoutService.ts`).
  - `types/`: Shared API-related TypeScript types.
- **Other Files:** `index.ts`, `README.md`.

---

### `components/`

- **Purpose:** Houses all reusable and feature-specific UI components.
- **Subfolders:**
  - `dynamic-forms/`: Components for rendering configurable/dynamic forms (e.g., `ConfigurableFormRenderer.tsx`, `FormField.tsx`).
  - `layout/`: Layout-related components (e.g., `ConfigurableGridLayout.tsx`).
  - `ui/`: Generic, reusable UI primitives (e.g., `button.tsx`, `input.tsx`, `card.tsx`, etc.).
  - `containers/`: Higher-level container components (e.g., `FeatureCard.tsx`).
  - `fallbacks/`: Fallback UI components (e.g., `LoadingFallback.tsx`).
  - `error-boundary/`: Error boundary and fallback components.
- **Other Files:** `index.ts` (exports for easier imports).

---

### `config/`

- **Purpose:** Project configuration files and constants.
- **Files:** `componentRegistry.ts`, `constants.ts`, `env.ts`, `index.ts`.

---

### `features/`

- **Purpose:** Feature-based organization for domain-specific logic, UI, and data.
- **Subfolders:**
  - `contact/`: Contact management feature.
    - `api/`: Contact API service (`ContactService.ts`).
    - `components/`: UI components for contacts (e.g., `ContactCard.tsx`, `ContactContent.tsx`).
    - `hooks/`: Custom hooks for contact data and form definitions.
  - `conversations/`: Conversations/messaging feature.
    - `api/`: Conversation API service.
    - `components/`: UI components for conversations (e.g., `ConversationContent.tsx`, `MessageInput.tsx`).
  - `notes/`: Notes feature.
    - `api/`: Notes API service.
    - `components/`: UI components for notes (e.g., `Note.tsx`, `NotesView.tsx`).
    - `data/`: Data generation utilities (e.g., `generateNotes.ts`).
- **Other Files:** `index.ts`, `types.ts`/`type.ts` for feature-specific types.

---

### `hooks/`

- **Purpose:** Shared React hooks for cross-cutting concerns (e.g., `useDynamicForm.ts`, `useLayout.ts`, `useContentParser.tsx`).

---

### `lib/`

- **Purpose:** General-purpose libraries and utilities (e.g., `utils.ts`).

---

### `pages/`

- **Purpose:** Top-level page components for routing (e.g., `HomePage.tsx`, `NotFoundPage.tsx`).

---

### `providers/`

- **Purpose:** React context providers and related logic (e.g., `QueryProvider.tsx`).

---

### `router/`

- **Purpose:** Application routing logic and types (e.g., `navigation.ts`, `types.ts`, `index.tsx`).

---

### `styles/`

- **Purpose:** Global and shared CSS (e.g., `globals.css`).

---

### `types/`

- **Purpose:** Shared TypeScript types and type definitions (e.g., `formTypes.ts`, `layoutTypes.ts`, `errorTypes.ts`, `json.d.ts`).

---

### `utils/`

- **Purpose:** Utility functions and helpers (e.g., `debounce.ts`, `layoutUtils.ts`, `performanceMonitor.ts`, `zodSchemaGenerator.ts`).

---

### Root Files

- **`App.tsx`**: Main React application component.
- **`main.tsx`**: Entry point for the React app.
- **`vite-env.d.ts`**: Vite environment type definitions.

---

## Example: Feature Structure

```
src/features/contact/
  api/
    ContactService.ts
  components/
    ContactCard.tsx
    ContactContent.tsx
    ...
  hooks/
    useContactData.ts
    useFormDefinition.ts
  index.ts
```

---

## Notes

- **Barrel files** (`index.ts`) are used throughout for easier imports.
- **Feature-based structure**: Each major domain (contacts, conversations, notes) is self-contained with its own API, components, hooks, and types.
- **UI primitives** are centralized in `components/ui` for reusability.

---

This structure supports scalability, maintainability, and clear separation of concerns for a modern React application.
