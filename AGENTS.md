# AGENTS.md

## Dev environment tips

- Use the package manager selected by the repository lockfile; do not replace it.
- Check `package.json` scripts and `.github/workflows` before inventing commands or adding tooling.
- Use `rg` and targeted file reads instead of scanning the whole repository.
- Check the nearest applicable `AGENTS.md` before working inside a module.
- Run `git status` before editing and preserve existing user changes.
- Follow the repository's existing structure, naming, imports, and error-handling patterns.
- Do not add or upgrade production dependencies without approval.

## Systematic development flow

1. Understand the requested outcome and define acceptance criteria.
2. Inspect the current implementation, related tests, and nearby patterns.
3. For a small isolated change, implement directly; for risky or multi-part work, present a short plan first.
4. Split broad work into small, dependency-ordered, independently verifiable tasks.
5. Implement one logical change at a time.
6. Run the narrowest relevant check after each change.
7. Inspect the result and `git diff`; revise only from new evidence.
8. Run the broader required checks before completion.
9. Report what changed, verification results, and remaining risks.

- Do not repeat the same failed approach without new evidence.
- After three unsuccessful attempts on the same issue, stop and report the blocker.

## Context instructions

- Read only files and documentation relevant to the current task.
- Do not load the whole repository or every Markdown file by default.
- Treat current code, tests, Git, and project documentation as the source of truth.
- Prefer concise error output; retain the failing command, exact error, and exit status.
- Do not create memory or progress files unless work must continue across sessions.

## Development instructions

- Make the smallest complete change required by the task.
- Modify only files needed for the requested behavior and its tests.
- Do not perform unrelated refactors, formatting, renaming, or cleanup.
- Preserve public APIs and existing behavior unless a change is explicitly requested.
- If the required scope expands, stop and explain why before continuing.

## Testing instructions

- Run relevant existing tests before changing unfamiliar code when practical.
- For bug fixes, add a regression test that fails before the fix and passes after it when practical.
- Add or update tests for changed behavior.
- Run the affected package's test, type-check, lint, and build scripts that exist in `package.json`.
- Fix failures caused by the change; report unrelated pre-existing failures separately.
- Never remove, skip, or weaken tests merely to make the suite pass.
- For UI changes, verify the rendered result and check console or network errors when tools are available.
- Review the final diff even when all automated checks pass.

## Safety instructions

- Never expose or commit secrets, credentials, or sensitive user data.
- Do not weaken authentication, authorization, validation, encryption, or payment controls.
- Ask before destructive actions, risky migrations, production changes, deployments, or external side effects.
- Do not discard user changes or use destructive Git commands.

## PR instructions

- Keep each commit and pull request focused on one logical change.
- Use the repository's existing commit and PR title format.
- Run the required tests, type checks, lint, and build before committing.
- Do not commit, push, merge, open a PR, or deploy unless explicitly requested.
- Before completion, confirm that the final diff has no accidental or unrelated changes.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
