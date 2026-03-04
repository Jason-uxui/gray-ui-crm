# Gray UI CRM

A CRM UI showcase built with Next.js App Router, shadcn/ui primitives, and a reusable data-grid architecture.

The project focuses on practical CRM workflows (company list, detail views, editable cells, task board interactions) with local mock data so it runs out of the box.

## Highlights

- Companies dashboard with configurable table columns, sorting, filtering, and inline editing
- Company detail route with drawer/workspace layout and linked entities
- Reusable `DataGrid` system split into composable table parts and hooks
- Task board interactions for account workflows (in-progress, review, blocked, todo, done)
- TypeScript-first codebase with App Router conventions

## Tech Stack

- Next.js 16
- React 19
- TypeScript 5
- Tailwind CSS 4
- shadcn/ui + Base UI
- dnd-kit

## Quick Start

### Prerequisites

- Node.js 20+
- pnpm 10+

### Install and run

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

```bash
pnpm dev        # Start local dev server
pnpm lint       # Run ESLint
pnpm typecheck  # Run TypeScript checks
pnpm build      # Create production build
pnpm start      # Start production server
```

## Project Structure

```text
app/                    # App Router routes and layouts
components/             # Reusable UI and feature components
components/data-grid/   # Generic data-grid engine
components/companies/   # Companies feature modules
lib/                    # Mock domain data + helpers
public/                 # Static assets
```

## Data and Demo Content

- The repository uses mock in-memory data from `lib/*`.
- Company names/logos are used for UI demonstration only.
- This is not an official product of those brands.

## Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening issues or PRs.

## Security

If you discover a security issue, please follow [SECURITY.md](./SECURITY.md).

## License

This project is licensed under the [MIT License](./LICENSE).
