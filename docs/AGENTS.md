# AGENTS.md

## Build, Lint, and Test Commands
- Build: Use your project's build tool (e.g., `npm run build`, `make build`, or `python setup.py build`).
- Lint: Run linter with `npm run lint`, `flake8 .`, or `eslint .` as appropriate.
- Test: Run all tests with `npm test`, `pytest`, or `make test`.
- Single test: Use `npm test -- <test-name>`, `pytest <test_file>::<test_func>`, or similar.

## Code Style Guidelines
- **Imports**: Group standard library, third-party, and local imports. Use absolute imports when possible.
- **Formatting**: Follow Prettier, Black, or your language's formatter. Indent with 2 or 4 spaces, no tabs.
- **Types**: Use explicit types (TypeScript, Python type hints) for function signatures and variables.
- **Naming**: Use descriptive, camelCase for variables/functions, PascalCase for classes, UPPER_SNAKE_CASE for constants.
- **Error Handling**: Always handle errors with try/catch or equivalent. Log errors with context.
- **Comments**: Write clear, concise comments for complex logic. Use docstrings for functions/classes.
- **Functions**: Prefer pure functions. Limit function length to 30 lines. Use single responsibility principle.
- **Files**: Keep files under 300 lines. Split large modules.
- **PRs/Commits**: Write clear commit messages and PR descriptions focused on the "why".

## Agentic Coding
- Always run lint and tests before submitting changes.
- Follow code style strictly to ensure consistency.
- If Cursor or Copilot rules are added, update this file to include them.
