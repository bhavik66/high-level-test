# Dynamic Layout – Architecture & Logic

This document explains how the **dynamic layout** system works in the project – from the API that serves layout definitions to the React components that render them at runtime.

---

## 1. High-level idea

- The UI is split into self-contained **feature views** (`ContactView`, `ConversationsView`, `NotesView`, …).
- A **layout configuration** – fetched from the server – describes **which view goes where** in a responsive CSS grid.
- The client lazily imports only the views that are required, places them on the grid and handles per-component error boundaries, retries and caching.

> Result: you can rearrange or replace major UI sections by editing a JSON layout on the server – no redeploy required.

---

## 2. Data flow

```mermaid
flowchart TD
  A[Client asks for /layout/:name] --> B(LayoutService.getLayout)
  B --> C[React-Query cache]
  C --> D[useLayout hook]
  D --> E[ConfigurableGridLayout]
  E --> F[componentRegistry]<br/>lazy() imports
```

1. **Server route** returns hard-coded (or DB-backed) layout JSON.
   ```34:50:server/routes/layoutRoutes.js
   // GET /api/layout
   router.get('/', …) => res.json({ layout: mainLayout, … })
   ```
2. **LayoutService** wraps the REST call and isolates API concerns.
   ```26:29:src/api/services/layoutService.ts
   static async getLayout(name: string): Promise<LayoutItem[]> {
     const response = await apiClient.get(`/layout/${name}`);
     return response.layout;
   }
   ```
3. **useLayout** hook calls the service via **React-Query**. Caching, retry and stale-while-revalidate are handled here.
   ```8:22:src/hooks/useLayout.ts
   useQuery({ queryKey: ['layout', name], queryFn: () => LayoutService.getLayout(name), … })
   ```
4. **ConfigurableGridLayout** receives the array of `LayoutItem`s and renders a CSS grid.
   ```54:58:src/components/layout/ConfigurableGridLayout.tsx
   {layoutConfig?.map(item => {
     const Component = componentRegistry[item.component];
     const classes = composeClasses(item);
   ```
5. Each view is wrapped in an **ErrorBoundary** and loaded through React’s `lazy`/`Suspense` mechanism, ensuring that:
   - loading states are shown per component (`LoadingFallback`)
   - a crash in one view does **not** bring down the entire page

---

## 3. Key building blocks

| Piece                   | File                                               | Responsibility                                       |
| ----------------------- | -------------------------------------------------- | ---------------------------------------------------- |
| **Types**               | `src/types/layoutTypes.ts`                         | Strongly-typed `LayoutItem`, responsive map, presets |
| **API layer**           | `src/api/services/layoutService.ts`                | Fetches and cleans layout JSON                       |
| **Data hook**           | `src/hooks/useLayout.ts`                           | React Query wrapper (cache, retries, staleTime)      |
| **Component registry**  | `src/config/componentRegistry.ts`                  | Maps string keys → lazy React components             |
| **Grid renderer**       | `src/components/layout/ConfigurableGridLayout.tsx` | Turns config into a responsive CSS grid              |
| **Utility**             | `src/utils/layoutUtils.ts`                         | `composeClasses` merges base & breakpoint classes    |
| **Server route** (mock) | `server/routes/layoutRoutes.js`                    | Serves layout JSON during dev                        |

---

## 4. LayoutItem structure

```ts
interface LayoutItem {
  id?: string; // Optional stable key
  component: ComponentKey; // Must exist in componentRegistry
  className?: string; // Extra Tailwind classes
  responsive?: ResponsiveMap; // "base", "md", "lg" → classes
  visible?: boolean; // Feature-flagging
  order?: number; // Explicit order override
  title?: string; // Human friendly name
  description?: string; // Tooltip / docs
}
```

### Example payload returned by `/layout/main`

```json
[
  {
    "component": "ContactView",
    "className": "h-full",
    "responsive": {
      "base": "col-span-12 mb-4 md:col-span-4 lg:col-span-3"
    }
  },
  { "component": "ConversationsView", … },
  { "component": "NotesView", … }
]
```

---

## 5. Responsive class composition

`composeClasses` merges **static** `className` with **breakpoint-specific** classes while de-duplicating tokens:

```11:24:src/utils/layoutUtils.ts
export function composeClasses({ className = '', responsive }: LayoutItem): string {
  const baseClasses = responsive?.base || '';
  const responsiveClasses = Object.entries(responsive ?? {})
    .filter(([bp]) => bp !== 'base')
    .map(([bp, cls]) => `${bp}:${cls}`)
    .join(' ');
  return [...new Set(`${className} ${baseClasses} ${responsiveClasses}`.split(' '))].join(' ');
}
```

---

## 6. Adding a new view to the layout

1. **Create the feature component** under `src/features/<feature>/index.tsx`.
2. **Register** it:
   ```8:11:src/config/componentRegistry.ts
   export const componentRegistry = {
     …,
     MyNewFeatureView: lazy(() => import('@/features/my-new-feature')),
   } as const;
   ```
3. **Return** it from the server layout JSON with appropriate classes.
4. The client will lazy-load & render it automatically – no further changes required.

---

## 7. Error handling strategy

- Each view is isolated by `ErrorBoundary`; a crash shows a friendly button allowing retry.
- Network errors are retried up to three times (`useLayout`), except for **4xx** client errors.

---

## 8. Extensibility & presets

`LayoutPreset` ( `default`, `chat-focus`, …) allows the client to switch between pre-defined grid templates. You can:

1. Return `preset` in the JSON, **or**
2. Pass `customConfig` directly to `<ConfigurableGridLayout>` for full control.

---

## 9. Summary

The dynamic layout system cleanly separates **data (layout JSON)**, **presentation (CSS grid & Tailwind classes)** and **functionality (lazy-loaded feature views)**. This modular approach enables:

- Runtime re-configuration without redeploys
- Independent development of feature views
- Fine-grained error boundaries & loading states
- Strong TypeScript safety from backend to frontend

> Tweaking a single JSON file can now reshape the entire interface – while keeping the codebase maintainable and type-safe.
