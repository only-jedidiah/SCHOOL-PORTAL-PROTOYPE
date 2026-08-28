# AI Workflow Rules - Gracefield Montessori School Portal

## Approach

Development on the Gracefield Montessori School Portal follows a spec-driven, incremental methodology. All modifications, feature additions, and fixes must conform to the project specifications and maintain integrity across the React codebase, Supabase database schema, and standalone prototype.

---

## Scoping & Step Rules

1. **One Feature or Fix at a Time**: Complete a single operational increment, test it, verify build passes, and document before advancing.
2. **Dual File Parity**: When functional or copy updates occur (e.g., school address, default password rules, new tables, or show/hide password buttons), update both:
   - React app under `src/`
   - Standalone prototype in `index.prototype.html`
3. **Database Schema Parity**: If a feature requires new database fields, tables, or policies:
   - Update `supabase/schema.sql`
   - Create an incremental migration under `supabase/migrations/` (e.g. `01_enable_full_crud.sql`)
   - Update `src/services/supabaseService.ts`

---

## When to Split Tasks

Split an implementation step if it combines:
- Database schema changes with extensive UI refactoring.
- Modifying multiple unrelated portal views simultaneously.
- Complex auth overhauls with visual redesigns.

---

## Protected Invariants & Files

1. **School Address**:
   - `HOUSE 8, 12 CRESENT KADO ESTATE, PHASE 1, ABUJA.`
2. **Default Password Rule**:
   - Initial generic password must always be `1234567890`.
   - First-time login must prompt for a custom personal password (minimum 6 characters, cannot be `1234567890`).
3. **Session Persistence**:
   - Refreshing the browser must never log the user out or reset their active tab, class selection, or active child view.

---

## Definition of Done for any Change

Before concluding any implementation turn:
1. The requested feature or fix is fully implemented and tested.
2. `cmd.exe /c "npm run build"` compiles with 0 TypeScript or bundling errors.
3. `context/progress-tracker.md` is updated with completed tasks and new notes.
