# HRM System

Human Resource Management System built with React and Vite.

## Technologies Used

- **React 19**: JavaScript framework for building UI
- **Vite**: Fast build tool for modern web applications
- **React Router v7**: Routing for React applications
- **Tailwind CSS v4**: Utility-first CSS framework
- **React Toastify**: Notification display for applications

## Directory Structure

```
src/
├── assets/         # Images, fonts, and other static files
├── components/     # Reusable components
│   ├── ui/         # UI components (Button, Input, etc.)
│   ├── auth/       # Authentication related components
│   ├── employee/   # Employee management components
│   ├── vacation/   # Vacation management components
│   ├── calendar/   # Calendar related components
│   └── config/     # Configuration components
├── config/         # Configuration files
├── constants/      # Constants, Enums
├── context/        # React Context
├── hooks/          # Custom React hooks
├── layouts/        # Layout components
├── pages/          # Application pages
├── repositories/   # Repository pattern for data access
├── services/       # API services
├── styles/         # Global styles and theme
├── types/          # Type definitions
└── utils/          # Utility functions
```

## Clean Code Principles

1. **Organized Project Structure**: 
   - Files and directories are logically arranged by function.
   - Everything has a specific and predictable location.

2. **Separation of Concerns**:
   - Components only handle UI and user interactions.
   - Services handle API calls and business logic.
   - Repositories handle data access.
   - Hooks handle reusable logic.
   - Context manages the global state of the application.

3. **Component-Based Architecture**:
   - Small, independent, and reusable components.
   - Components are designed according to the Single Responsibility principle.

4. **Conventions**:
   - PascalCase for Component file names (Button.jsx)
   - camelCase for utilities and services (apiService.js)
   - camelCase for function names describing actions (getUserData)
   - camelCase for variable names describing values (userProfile)

5. **Documentation**:
   - Comments and JSDoc for functions and components.
   - README.md provides installation and usage instructions.

## Installation

```bash
# Clone repository
git clone <repository-url>

# Navigate to project directory
cd hrm

# Install dependencies
npm install

# Run development server
npm run dev
```

## Scripts

- `npm run dev`: Run development server
- `npm run build`: Build production version
- `npm run preview`: Preview production build
- `npm run lint`: Check for errors with ESLint