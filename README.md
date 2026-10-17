# Certify - Certificate Issuance & Verification Platform

A modern web application to issue and verify certificates for institutes.

## Project Structure
```text
certificates/
├── docs/
│   └── specs/
│       └── LOGIN_PAGE.md       # Login page design & architecture specification
├── frontend/                   # React + Vite frontend application
│   ├── src/
│   │   ├── Login.jsx           # Main sign-in view (Tailwind CSS v4 + Ant Design)
│   │   ├── index.css           # Global styles and Tailwind theme variables
│   │   └── main.jsx            # React root entry point
│   ├── package.json
│   └── vite.config.js
├── backend/                    # Go backend service
│   ├── cmd/
│   │   └── server/             # Application entry point
│   ├── internal/               # Private application library
│   │   ├── auth/               # OAuth & authentication logic
│   │   ├── config/             # Environment configuration
│   │   ├── handler/            # HTTP API route handlers
│   │   ├── middleware/         # CORS, recovery, logging
│   │   ├── model/              # Domain data structures
│   │   └── repository/         # Data access & database layer
│   ├── pkg/                    # Public shared utilities
│   ├── .env.example            # Environment variables template
│   └── go.mod
├── CHANGELOG.md                # Project changelog
└── README.md
```

## Dependencies

### Frontend
- **React**: `^19.2.8`
- **React DOM**: `^19.2.8`
- **Ant Design (antd)**: `^6.6.6`
- **Bootstrap Icons**: `^1.13.1`
- **Tailwind CSS**: `^4.0.0`
- **@tailwindcss/vite**: Vite plugin for Tailwind CSS v4
- **Vite**: `^8.3.0`

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm / yarn / pnpm

### Running Frontend Locally
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```
5. Run linting:
   ```bash
   npm run lint
   ```