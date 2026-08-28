# Code Standards - Gracefield Montessori School Portal

## General Principles

1. **Small & Focused Modules**: Keep components, hooks, and services single-purpose and under 250 lines where possible.
2. **Type Safety Throughout**: Use strict TypeScript typing without using `any` unless absolutely necessary.
3. **No Dead Code or Unused Imports**: Always verify that declared variables, parameters, and icons are utilized.
4. **Resilient Data Access**: Never assume an entity exists in a collection without null-checks or fallback values.

---

## TypeScript Conventions

- Define all domain models and entities in `src/types/portal.ts`.
- Prefer strict interfaces (`SchoolClass`, `StaffMember`, `StudentAccount`, `ActivityEvent`, `UserCredential`).
- Use discriminated union string literals for fixed states (`'admin' | 'teacher' | 'parent'`, `'Active' | 'On Leave'`).
- Ensure all component props interfaces are exported (e.g. `export interface ClassManagementTableProps`).

---

## React & Context Conventions

- Use functional components with `React.FC<Props>` typing.
- Centralize shared mutations, auth state, and toast triggers within `SchoolPortalContext`.
- Use custom hook `useSchoolPortal()` to consume context values with runtime provider assertion.
- When mutating state arrays or records, always use immutable updates (`setItems(prev => [...prev, newItem])` or `setItems(prev => prev.map(...))`).

---

## Supabase & Data Persistence

- All network CRUD operations must reside in `src/services/supabaseService.ts`.
- Check `if (!isSupabaseConfigured || !supabase) return false;` before executing database calls to support offline/demo mode without throwing uncaught exceptions.
- Clean and normalize the Supabase project URL in `src/lib/supabase.ts` (stripping trailing `/rest/v1` or `/` slashes).
- Always persist critical state changes to `localStorage` concurrently with database operations.

---

## Styling & Tailwind Rules

- Use predefined semantic utility classes from Tailwind and custom CSS tokens (`bg-surface-card`, `border-border-default`, `text-text-primary`).
- Never hardcode arbitrary hex values directly in JSX when token equivalents exist.
- Merge classes using `clsx` and `twMerge` inside reusable atom components.
- Ensure all interactive buttons have clear hover and focus ring states (`focus:ring-2 focus:ring-brand-700/20`).

---

## Command Execution & Tool Rules

- On Windows hosts, always run npm/node commands via `cmd.exe /c "<command>"` to prevent PowerShell execution policy blocks (`npm.ps1 cannot be loaded`).
- Verify project compilation after changes by executing `cmd.exe /c "npm run build"`.
