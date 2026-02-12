---
name: crm-feature-to-shadcn-page
description: Use this skill when implementing a CRM feature into a production-ready Next.js page using shadcn/ui. Do not use for generic UI brainstorming.
---

# CRM Feature to shadcn Page

Implement a CRM feature page.

Follow this structure strictly:

1. Define feature goal (1-2 lines).
2. Define page layout hierarchy.
3. List required components (shadcn-based).
4. Define all states:
- loading
- empty
- error
- success
5. Define folder structure.
6. Generate final page code.
7. Ensure:
- Responsive
- Accessible
- No inline styling
- Consistent spacing scale

## Execution rules

- Default to Next.js App Router conventions and TypeScript.
- Use server components for data loading shells and client components only for interactivity.
- Use shadcn/ui primitives for all UI building blocks.
- Keep state and permission handling explicit.
- Keep output implementation-ready with concrete file names and code that can run with minimal edits.

## Output contract

Always return output in exactly 7 numbered sections matching the structure above.

In section 6, provide complete page code, not pseudocode.

In section 7, explicitly verify all four constraints and call out any assumption.

Do not switch to high-level brainstorming mode.
