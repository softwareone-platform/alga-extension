# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Start development server**: `npm run dev` - Runs Vite dev server with HMR
- **Build for production**: `npm run build` - TypeScript compilation followed by Vite build
- **Lint code**: `npm run lint` - ESLint with TypeScript and React rules
- **Preview production build**: `npm run preview` - Preview the built application

## Project Architecture

This is a React 19 + TypeScript + Vite application with a minimal setup:

- **Frontend Framework**: React 19 with TypeScript
- **Routing**: React Router v7 in declarative mode
- **Build Tool**: Vite with React plugin
- **Linting**: ESLint with TypeScript, React Hooks, and React Refresh plugins
- **Entry Point**: `src/main.tsx` renders the main `App` component
- **TypeScript Config**: Uses project references with separate configs for app (`tsconfig.app.json`) and node (`tsconfig.node.json`)

### Source Structure

- `src/main.tsx` - Application entry point with React StrictMode
- `src/App.tsx` - Main application component (currently a Vite + React demo)
- `src/index.css` & `src/App.css` - Global and component styles
- `public/` - Static assets served by Vite
- `dist/` - Build output directory (ignored by ESLint)

### Key Configuration Files

- `vite.config.ts` - Vite configuration with React plugin
- `eslint.config.js` - ESLint configuration with TypeScript and React rules
- `tsconfig.json` - TypeScript project references configuration
- `package.json` - Project dependencies and scripts

## Development Notes

- Uses modern ESLint flat config format with TypeScript support
- CSS files are imported directly in components
- No testing framework is currently configured
- HMR (Hot Module Replacement) is enabled for fast development

## Code Style Guidelines

- **TypeScript Types**: Prefer `type` over `interface` for type definitions

## External Libraries and Documentation

- **Always use Context7 tools**: When asked to use or implement features with external libraries, ALWAYS use the context7 MCP tools (`resolve-library-id` and `get-library-docs`) to fetch the latest documentation and code examples before implementation. This ensures you have access to up-to-date information and best practices for any library.