# HR & Classroom Management

A frontend-only React + TypeScript application for managing teachers, students, rooms, and courses. Data is persisted in `localStorage`, requiring no backend.

## Requirements

- Node.js 18+
- npm

## Installation

```bash
npm install
```

## Run Development Server

```bash
npm run dev
```

Open:

```
http://localhost:5173
```

## Build

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

## Architecture

The project follows a modular structure:

- `components/` – Reusable UI components
- `pages/` – Feature pages
- `services/` – Business logic & localStorage
- `store/` – Global state (Zustand)
- `types/` – TypeScript interfaces
- `utils/` – Shared utilities
- `hooks/` – Custom React hooks

Business rules (status management, conflict validation, and CRUD operations) are separated from UI to improve maintainability and reusability.
