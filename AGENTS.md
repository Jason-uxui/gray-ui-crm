# AGENTS.md instructions for /Users/xinhpham/CascadeProjects/gray-ui-crm

<INSTRUCTIONS>
## Skills
A skill is a set of local instructions to follow that is stored in a `SKILL.md` file.

### Available skills
- crm-feature-to-shadcn-page: Convert a CRM feature spec into a production-ready Next.js + shadcn page implementation with concrete layout, components, states, folder structure, and final code. Trigger when the user asks to build or implement a CRM feature page. Do not trigger for generic UI brainstorming. (file: /Users/xinhpham/CascadeProjects/gray-ui-crm/skills/crm-feature-to-shadcn-page/SKILL.md)

### How to use skills
- Trigger rules: If the user names a skill (with `$SkillName` or plain text) OR the task clearly matches a skill description above, use that skill for that turn.
- Missing/blocked: If a named skill path cannot be read, say so briefly and continue with the best fallback.
- Progressive disclosure:
  1) Open `SKILL.md` and read only enough to execute the workflow.
  2) If `SKILL.md` references relative paths, resolve them relative to the skill directory first.
  3) Load extra files only when needed.
  4) Prefer bundled scripts/assets when available.
</INSTRUCTIONS>
