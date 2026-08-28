# Gracefield Montessori School Portal - Project Overview

## Overview

The **Gracefield Montessori School Portal** is a modern, unified web application and management platform designed for administrators, teachers, and parents of Gracefield Montessori School located at **HOUSE 8, 12 CRESENT KADO ESTATE, PHASE 1, ABUJA**.

It provides real-time academic management, continuous assessment grade recording, dynamic fee calculations with installment tracking and manual overrides, extracurricular activity coordination, staff directory management, and multi-child parent dashboards.

---

## Goals

1. **Role-Based Workspaces**: Provide dedicated, secure, and intuitive interfaces for Administrators, Teachers, and Parents.
2. **Dual-Layer Persistence**: Offer seamless real-time synchronization with cloud-hosted PostgreSQL (Supabase) while maintaining offline-capable `localStorage` fallbacks with refresh session persistence.
3. **Comprehensive CA & Financial Tracking**: Empower teachers to record 4-component continuous assessments (Test 1, Test 2, Project, Exam) and allow administrators to manage tuition, dynamic fee overrides, and installment payments.
4. **Fast Prototyping & Production Parity**: Maintain synchronized alignment between the production React/TypeScript web app and the standalone single-file prototype.

---

## Core User Flow

1. **Sign-In & Authentication**:
   - User chooses role (Administrator, Teacher, or Parent Gateway).
   - User signs in with email/username and initial generic password (`1234567890`) or private personal password.
   - First-time users are prompted to set an individual password before entering.
   - Password fields feature an interactive Show/Hide toggle.
2. **Administrator Flow**:
   - Manages academic classes and assigns lead teachers.
   - Manages teaching and non-academic staff directory.
   - Schedules extracurricular activities and field excursions.
   - Applies dynamic tuition fee overrides with audit reasons and logs installment payments.
   - Full CRUD (Create, Edit, Delete) across all entity tables.
3. **Teacher Flow**:
   - Selects designated classroom level (e.g., Grade 3B, Kindergarten 1).
   - Defines curriculum subjects and edits weekly schemes of work.
   - Enrolls new pupils and links them to new or existing parent accounts.
   - Enters test, project, and exam scores into the live continuous assessment gradebook.
4. **Parent Flow**:
   - Views academic progress, terminal CA grades, and remarks for their wards.
   - Switches between multiple enrolled children seamlessly.
   - Inspects real-time fee breakdowns, dynamic adjustments, and completeness progress bars.
   - Makes simulated fee installment payments with instant receipt balance updates.

---

## Features

### 1. Authentication & Security
- Role-based portal routing (`admin`, `teacher`, `parent`).
- Initial generic default password (`1234567890`) with mandatory first-time custom password setup.
- Individual password registry stored in state and persisted across sessions.
- Show / Hide password visibility toggles on all password fields.
- Session restoration preserving active role, email, active tab, teacher class, and active child upon browser refresh.

### 2. Administrator Portal
- **Class Management**: Create, edit name/level, allocate lead teachers, and delete classes.
- **Staff Directory**: Add, update roles, phone contacts, status (`Active` / `On Leave`), and remove staff.
- **Activities & Excursions**: Plan field trips, inter-house sports, set target classrooms, date, and status.
- **Dynamic Fee Overrides & Ledger**: Modify outstanding balances with documented reasons, record payments, and view completion rates.

### 3. Teacher Portal
- **Subjects & Scheme of Work**: Register course subjects per class and update weekly syllabi with auto-save.
- **Student Enrollment**: Register pupils, assign tuition, and associate with new or existing parent accounts.
- **Continuous Assessment Gradebook**: Record Test 1 (10), Test 2 (10), Project (20), and Exam (60) with auto-computed total scores and qualitative remarks.
- **Student Record Management**: Edit pupil information or remove student profiles with confirmation.

### 4. Parent Portal
- **Multi-Ward Switcher**: Easily toggle between siblings enrolled in different classes.
- **Academic CA Scorecard**: View subject breakdown and remarks.
- **Financial Ledger & Installments**: Transparent view of standard tuition, dynamic reductions, paid amounts, remaining balance, and installment payments.

---

## Scope

### In Scope
- React 18 + TypeScript + Vite modern web application.
- Supabase cloud PostgreSQL integration with Row-Level Security policies.
- Full offline-first `localStorage` resilience.
- Standalone HTML prototype (`index.prototype.html`) maintained in sync for rapid presentation.
- Complete CRUD operations with modal workflows and delete confirmations.

### Out of Scope
- Direct payment gateway webhook processing (e.g. Paystack / Flutterwave live API keys are mocked/simulated for instant feedback).
- SMS gateway dispatch (phone numbers recorded in directory).

---

## Success Criteria

1. Administrator can add, edit, and delete classes, staff, events, and student fee records without page reload.
2. Teacher can enroll students, update weekly schemes of work, and record test/exam scores with real-time total recalculations.
3. Refreshing any portal page retains user role, active tab, classroom, and student selection.
4. All Supabase tables support read, write, update, and delete actions with zero RLS permission errors.
5. Production bundle builds with 0 TypeScript compilation errors (`npm run build`).
