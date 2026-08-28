# Architecture Context - Gracefield Montessori School Portal

## Stack

| Layer | Technology | Role |
| --- | --- | --- |
| **Runtime & Build** | Vite + React 18 + TypeScript | Client-side Single Page Application bundling and strict typing |
| **State & Business Logic** | React Context API (`SchoolPortalContext`) | Global reactive state, session persistence, CRUD handlers, and toast notifications |
| **Backend & Database** | Supabase (PostgreSQL) + `@supabase/supabase-js` | Cloud relational database with Row Level Security (RLS) policies |
| **Styling & Design System** | Tailwind CSS + Custom CSS Variables | Design tokens, responsive layouts, glassmorphism surfaces, and atomic UI styling |
| **Iconography** | Lucide React | Modern SVG stroke icon set |
| **Local Persistence** | Web Storage API (`localStorage`) | Offline caching, session recovery, and fallback state synchronization |
| **Reference Prototype** | Standalone Single-File HTML5/JS/Tailwind CDN | Lightweight demo prototype (`index.prototype.html`) kept in parity |

---

## System Boundaries

```
src/
├── components/
│   ├── atoms/          # Atomic primitives: Button, Input, Select, Badge, Typography, ProgressBar, Skeleton
│   ├── molecules/      # Composed elements: Modal, FormField, MetricCard, TabNavigation, Toast
│   ├── organisms/      # Feature units: Header, LoginModal, ActionModal, DeleteConfirmModal, Admin/*, Teacher/*, Parent/*
│   ├── templates/      # Layout shells: DashboardShell
│   └── views/          # Route/Role views: LandingView, AdminDashboardView, TeacherDashboardView, ParentDashboardView
├── context/            # SchoolPortalContext: Central state, auth verification, CRUD methods, Supabase & localStorage bridge
├── lib/                # Third-party initializers: supabase.ts (client configuration and URL sanitizer)
├── services/           # Data layer: supabaseService.ts (typed asynchronous queries, insertions, updates, and deletes)
└── types/              # Domain models: portal.ts (TypeScript interfaces for all entities)
```

---

## Storage Model

### 1. Supabase Cloud Database (PostgreSQL)
- **`classes`**: `id (PK)`, `name`, `level_range`, `teacher`, `created_at`.
- **`staff`**: `id (PK)`, `name`, `role`, `phone`, `status`, `created_at`.
- **`activities`**: `id (PK)`, `name`, `classes`, `date`, `status`, `created_at`.
- **`subjects`**: `id (PK)`, `name`, `class_assigned`, `curriculum`, `created_at`.
- **`families`**: `parent_id (PK)`, `parent_name`, `phone`, `created_at`.
- **`students`**: `id (PK)`, `parent_id (FK)`, `name`, `grade`, `default_tuition`, `paid_amount`, `manual_outstanding`, `override_reason`, `t1`, `t2`, `proj`, `exam`, `created_at`.
- **`student_grades`**: `id (BIGSERIAL PK)`, `student_id (FK)`, `subject`, `t1`, `t2`, `proj`, `exam`, `total`, `remark`, `created_at`.

### 2. Browser LocalStorage Keys
- `school_portal_role`: Currently authenticated user role (`admin`, `teacher`, `parent`).
- `school_portal_user_email`: Currently signed-in email address.
- `school_portal_active_class`: Active classroom selected in Teacher Portal.
- `school_portal_active_child`: Active ward ID selected in Parent Gateway.
- `school_portal_users`: User credentials store mapping normalized emails to hashed/saved passwords and `mustChangePassword` status.
- `school_portal_classes`, `school_portal_staff`, `school_portal_activities`, `school_portal_subjects`, `school_portal_students`, `school_portal_families`: Local snapshots for immediate optimistic loading.
- `school_portal_admin_tab`, `school_portal_teacher_tab`: Preserved active tab indices across page reloads.

---

## Auth & Access Model

1. **Role-Based Authorization**:
   - `admin`: Full access to school overview metrics, class allocations, staff directory, event planner, fee ledger, and fee discount overrides.
   - `teacher`: Access to classroom subjects, scheme of work breakdown, pupil enrollment, and continuous assessment gradebook.
   - `parent`: Read-only access to enrolled wards' academic results and dynamic tuition fee ledger with simulated installment payment processing.
2. **Credential Lifecycle**:
   - Initial generic default password: `1234567890`.
   - First-time login intercepts generic password and routes to private password creation.
   - Once updated, only custom individual password unlocks the account.
3. **Database Security (RLS)**:
   - Row Level Security enabled across all public tables with public demo access policies for SELECT, INSERT, UPDATE, and DELETE.

---

## Invariants

1. **Optimistic Updates with Dual Persistence**: Any state change in `SchoolPortalContext` must update local React state immediately, write to `localStorage`, and asynchronously push to Supabase.
2. **Fee Calculation Consistency**: Outstanding balance must never be negative (`Math.max(0, ...)`). Effective Total is always `paidAmount + manualOutstanding`. Completion % is `(paidAmount / effectiveTotal) * 100`.
3. **Atomic Component Separation**: Atoms must not import molecules or organisms. Business logic lives in context or view containers, not low-level presentational atoms.
4. **Zero Unhandled Promise Rejections**: Supabase network failures or unconfigured `.env` variables must gracefully fall back to local store without crashing the UI.
5. **Dual Codebase Parity**: Major workflow additions to the React application must be mirrored in `index.prototype.html`.
