# Directory structure and naming

<!-- Based on https://github.com/mitodl/mit-learn/blob/main/docs/architecture/front-end-component-structure.md -->

```text
Directory Hierarchy, import sidways or downwards

─────────────────────────────────────────────
                    app
─────────────────────────────────────────────
 page-components       services       common
─────────────────────────────────────────────
         components
─────────────────────────────────────────────
```

Here:

- `app`: The NextJS App Router directory for [file-based routing](https://nextjs.org/docs/app/building-your-application/routing/defining-routes). Each page will have a folder here, e.g., `/cart/page.tsx`, and shared layout can be put in [`layout.tsx`](https://nextjs.org/docs/app/building-your-application/routing/layouts-and-templates) files.

- `page-components`: These are sub-page components responsible for a significant piece of logic (e.g., a dialog or form). May include API calls and routing logic. If the component is not reused throughout the app, it can be co-located with its parent.

- `components`: UI display components, no API calls. If a display-only component is not reused throughout the app, it can be co-located with its parent.

- `services` - any over network dependencies (notably the adaptor for the backend api) and any library initialization.

- `common`: app-specific utility code, e.g., feature-flags or routing helpers

Additionally:

- Files can only import sideways or down the hierarchy

- Each reusable React component lives in its own directory and contains any dependencies specific to the component.

- The entrypoint file for each React component has the same name as the directory (e.g., `page-components/Header/Header.tsx`).
  - This is the only file that should be imported from outside this directory (_not_ page-components/Header/UserIndicator.tsx).
  - An exception - sometimes it is useful to group similar components. Where there is no single entrypoint, an index.ts file is useful for single line imports and each component should have its own unit test file, see for example the ErrorPages/ below.
