# UI Context - Gracefield Montessori School Portal

## Theme

The design language of the Gracefield Montessori School Portal is a clean, modern, educational workspace with refined typography, glassmorphism surface cards, smooth micro-interactions, responsive grids, and distinct status color coding.

---

## Colors & Tokens

The color system is defined via Tailwind tokens and CSS custom variables:

| Role | Token / Class | Hex / HSL | Usage |
| --- | --- | --- | --- |
| **Brand Primary** | `bg-brand-700`, `text-brand-700` | `#1e40af` / Blue-800 | Primary buttons, headers, active tabs, brand accents |
| **Brand Hover** | `bg-brand-800` | `#1e3a8a` / Blue-900 | Button hover states |
| **Brand Subtle** | `bg-brand-50`, `border-brand-200` | `#eff6ff`, `#bfdbfe` | Selected chips, notice banners, active sidebar pills |
| **Page Base** | `bg-surface-base` | `#f8fafc` / Slate-50 | Main viewport background |
| **Card Surface** | `bg-surface-card` | `#ffffff` / Pure White | Elevated cards, tables, modal containers |
| **Subtle Surface** | `bg-surface-subtle` | `#f1f5f9` / Slate-100 | Table hover states, input backgrounds |
| **Primary Text** | `text-text-primary` | `#0f172a` / Slate-900 | Headings, bold labels, table row titles |
| **Secondary Text**| `text-text-secondary` | `#475569` / Slate-600 | Body text, descriptive subtitles |
| **Muted Text** | `text-text-muted` | `#94a3b8` / Slate-400 | Helper hints, timestamps, icon placeholders |
| **Success / Emerald** | `text-accent-emerald`, `bg-emerald-50` | `#059669` / Emerald-600 | Completed payments, active status, high grades (80%+) |
| **Warning / Amber** | `text-accent-amber`, `bg-amber-50` | `#d97706` / Amber-600 | Partial payments, scheduled events, medium scores |
| **Danger / Rose** | `text-accent-rose`, `bg-rose-50` | `#e11d48` / Rose-600 | Outstanding balances, deletion warnings, error alerts |
| **Purple / Special** | `bg-purple-100`, `text-purple-700` | `#7e22ce` / Purple-700 | Non-academic staff, special excursions, calculated totals |

---

## Typography

| Role | Font Family | Tailwind / CSS Class | Notes |
| --- | --- | --- | --- |
| **Display Headings** | Outfit, sans-serif | `font-outfit`, `font-bold` | Page titles, modal titles, portal branding |
| **UI Body & Labels** | Inter, sans-serif | `font-sans`, `text-xs`, `text-sm` | Form fields, tables, button labels, descriptions |
| **Monospace Data** | Fira Code / JetBrains Mono | `font-mono`, `text-xs` | Currency values (₦), IDs (`CLS-001`), percentages, scores |

---

## Border Radius & Spacing

| Context | Tailwind Class | Pixel Value |
| --- | --- | --- |
| **Action Buttons & Inputs** | `rounded-xl` | `12px` |
| **Badges, Pills & Code** | `rounded-lg`, `rounded-full` | `8px` / `9999px` |
| **Cards, Modals & Panels** | `rounded-2xl` | `16px` |
| **Standard Card Padding** | `p-6` | `24px` |
| **Inner Spacing / Gaps** | `gap-4`, `space-y-4` | `16px` |

---

## Component Hierarchy

```
Components
├── Atoms
│   ├── Button: variants ['primary', 'secondary', 'outline', 'danger', 'emerald', 'ghost'], sizes ['sm', 'md', 'lg']
│   ├── Input: support for leftIcon, rightElement (for password toggle), isMono, hasError
│   ├── Select: consistent styled select dropdown
│   ├── Badge: variants ['brand', 'emerald', 'amber', 'rose', 'purple', 'neutral'], with optional live dot indicator
│   ├── Typography: variants ['h1', 'h2', 'h3', 'h4', 'body-sm', 'body-xs', 'label', 'mono']
│   ├── ProgressBar: animated progress bar with colorVariant ['brand', 'emerald', 'amber', 'rose']
│   └── Skeleton: placeholder loading pulse animations
├── Molecules
│   ├── Modal: accessible dialog overlay with backdrop blur, exit transitions, title/subtitle header
│   ├── FormField: structured form input with required asterisk, helper hint, and error message
│   ├── MetricCard: top KPI stat tile with icon, theme coloring, and comparison badge
│   ├── TabNavigation: responsive pill-based tab bar with icons and badge indicators
│   └── Toast: auto-dismissing floating notification alerts (success, error, info, warning)
└── Organisms
    ├── Header: school identity, active address, user badge, and logout action
    ├── LoginModal: multi-step login with generic password setup & eye toggles
    ├── ActionModal: entity creation and editing modal for classes, staff, events, subjects, students
    ├── DeleteConfirmModal: safety confirmation dialog for deleting items
    ├── AdminDashboardView: class allocation, fee override & payment ledger, staff directory, activities
    ├── TeacherDashboardView: schemes of work, ward enrollment, continuous assessment gradebook
    └── ParentDashboardView: multi-child switcher, terminal report card, fee breakdown, installment payment
```

---

## Icons

- **Library**: `lucide-react` (React) & `FontAwesome 6` (`index.prototype.html`).
- **Standard Sizing**: `size={16}` for inline actions/tabs; `size={20}` to `size={22}` for metric tiles; `size={14}` for micro-buttons.
