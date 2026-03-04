# Contributing

Thanks for your interest in contributing to Gray UI CRM.

## Before You Start

- Search existing issues/PRs to avoid duplicates.
- Keep changes focused and scoped.
- Use clear commit messages.

## Local Development

```bash
pnpm install
pnpm dev
```

## Pull Request Checklist

- [ ] Code is formatted and readable
- [ ] `pnpm lint` passes
- [ ] `pnpm typecheck` passes
- [ ] `pnpm build` passes
- [ ] PR description explains problem, solution, and impact

## Reporting Bugs

When opening a bug report, include:

- Environment details (OS, Node version, pnpm version)
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots or logs when applicable

## Feature Requests

Please describe:

- The problem you want to solve
- Proposed UX/behavior
- Alternatives considered

## Code Style

- Use TypeScript
- Follow existing component and naming conventions
- Prefer reusable UI primitives in `components/ui`
- Keep feature logic in feature folders (for example `components/companies`)
