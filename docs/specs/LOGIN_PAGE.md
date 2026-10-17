# Specification: Login Page (Certify)

## 1. Overview
The goal is to implement the `Login.jsx` component by translating `Main.dc.html` from the design specs into a modern React application using **Tailwind CSS v4** and **Ant Design (antd)**.

## 2. Requirements & Visual Language
Based on `/Users/himanshurajaman/Downloads/files (1)/Main.dc.html` and user input:
- **Layout**: Centered login card (`400px` width) vertically and horizontally on a `#fafaf8` background.
- **Typography**: Google Font `'IBM Plex Sans'`, weights 400, 500, 600.
- **Brand Colors**:
  - Primary Accent: `#1f5f5b` (Deep Teal)
  - Hover: `#174744`
  - Active: `#113533`
  - Soft Teal / Badge: `#eef3f2`
  - Page Background: `#fafaf8`
  - Card Background: `#ffffff`
  - Card Border: `#e6e6e1`
  - Primary Text: `#1c1c1a`
  - Muted Text: `#6b6b66`
  - Input / Element Border: `#d9d9d3`
- **Components**:
  - Ant Design `ConfigProvider` configured with custom theme tokens (primary color `#1f5f5b`, font family `IBM Plex Sans`, border radius 8px).
  - Ant Design `Card` / `Button` components for high accessibility and interactive feedback.
  - Authentic Google SVG logo inside the "Continue with Google" button.
  - Interactive states: `isLoading` state handling with loading spinner.
  - Notification / alert message handling via Ant Design `message`.

## 3. Technology Stack & Integration
- **Framework**: React 19 + Vite 8
- **UI Library**: Ant Design (`antd` ^6.6.6)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite` + `tailwindcss`)
- **Code Standards**:
  - Strict Functional Components and Hooks.
  - Prefixed booleans (`isLoading`, `isHovered`, etc.).
  - Memoized callbacks (`useCallback`).
  - Try/catch wrapped async handlers.
  - ESLint compliant with zero warnings.

## 4. File Changes
- `frontend/package.json`: Add `tailwindcss`, `@tailwindcss/vite`, and `bootstrap-icons`.
- `frontend/vite.config.js`: Integrate `@tailwindcss/vite` plugin.
- `frontend/src/index.css`: Import `@import "tailwindcss";` and load `'IBM Plex Sans'` font tokens.
- `frontend/src/main.jsx`: Wrap the application with `ConfigProvider` and Ant Design `<App>` for global theme distribution.
- `frontend/src/Login.jsx`: Implement the clean Login view using Ant Design components, Tailwind CSS, and Bootstrap 5 icons.
- `README.md`: Document Tailwind CSS v4 addition and component usage.
- `CHANGELOG.md`: Record change under `[FEAT]`.
