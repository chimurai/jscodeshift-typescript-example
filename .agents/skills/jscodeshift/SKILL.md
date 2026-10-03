---
name: jscodeshift
description: 'Create or update TypeScript jscodeshift codemods.'
argument-hint: 'Outline the code to be transformed with the desired output.'
---

# When to use SKILL

Create new or update existing jscodeshift codemod.

## Output artifact

Always produce or update these files for the target codemod transformer:
- `src/[transformer].PRD.md`
- `src/[transformer].spec.ts`
- `src/[transformer].ts`

### Reference artifacts

Use these reference assets when creating or updating transformer files:

- [references/[transformer].PRD.md](./references/[transformer].PRD.md)
- [references/[transformer].spec.ts](./references/[transformer].spec.ts)
- [references/[transformer].ts](./references/[transformer].ts)

When updating an existing transformer, ensure these files exist and stay aligned.
Update the PRD, PRD changelog, and tests before updating the transformer implementation.

## Optional Context Gathering

When unsure about AST nodes, parser behavior, or framework/library APIs:
- Use #context7-mcp to fetch authoritive documentation.
- Use authoritative docs for jscodeshift and typescript-eslint AST node definitions, instead of guessing.

## Workflow

scope → requirements → prd → implement → review → retro

### Scope
- Determine whether this is a new codemod or update to an existing one.
- Identify candidate transformer name.

### Requirements

#### Clarify requirements without assumptions
- Do not assume behavior.
- Ask one question at a time.
- Prioritize questions with highest implementation impact first.
- Continue until all critical and important questions are answered.
- Clarify with user when conflicting, ambiguous, or incorrect requirements remain.

#### Clarify edge cases explicitly
- Ask about aliasing, mixed import forms, comments/format preservation, idempotency, unsupported syntax, and safety boundaries.
- Confirm out-of-scope cases.

### PRD
- Create or update `src/[transformer].PRD.md`.
- Ensure each requirement and edge case is uniquely labeled.
- Include relevant [learnings](./docs/LEARNINGS.md) to prevent the same mistakes in implementation.

### Implement

Implement with TDD.
Flow: Write transformer tests → Implement transformer → Validate implementation

#### Write Tests
- Start from tests in `src/[transformer].spec.ts`:
  - Add failing tests for core requirements.
  - Add failing tests for confirmed edge cases.
  - Add tests for out-of-scope behavior (no-op or preserved behavior).

#### Implement
- Implement transformer in `src/[transformer].ts` to make tests pass.
- Implement helper functions at the bottom of the transformer file.
- Use code comments to explain the code so that future maintainers can understand the intent.
- Fix all Typescript errors and warnings.
- Preserve repository conventions and parser setting.

#### Validate
- Run relevant tests.
- Ensure formatting/output style is consistent.
- Verify idempotency where applicable.

### Review

- Use sub agent to run a read-only Adversary Review subagent with a different model. (provide PRD, tests and implementation)
- Ask reviewer to challenge tests and implementation for gaps, regressions, and false confidence.
- Report findings and provide several fix options.
- Always clarify with the user when deviating from the original PRD or edge-case behavior before implementing fixes.
- Apply chosen fixes and re-run tests.

### Retro

Capture learnings
- Update `.agents/skills/jscodeshift/docs/LEARNINGS.md` with short, generic lessons.
- Update outdated or conflicting learnings with new insights.
- Do not capture codemod-specific product details.

## Clarification Protocol

Ask one question at a time, in this order of priority:
1. Transform boundary: exactly what should and should not change?
2. Safety: what must never be modified?
3. Edge-case behavior: what should happen for ambiguous syntax?
4. Output style and ordering constraints
5. Backward compatibility and rollout assumptions

Stop asking only when all critical and important unknowns are resolved.

## Completion Checklist

A codemod task is complete only if all are true:
- PRD exists and reflects confirmed requirements.
- Tests were written first (or updated first) and cover requirements plus edge cases.
- Transformer passes tests.
- Final transformer JSDoc is present and accurate.
- Adversary review was executed (read-only, different model), findings reported, and chosen fixes applied.
- LEARNINGS file updated with generic lessons.

## Output Reporting Format

At the end of each codemod run, provide:
- What was clarified
- Requirements and edge cases covered
- Test additions/changes
- Adversary findings
- Fix options considered
- Final implemented behavior
- LEARNINGS updates
