# AGENTS.md

## Build, Lint, and Test Commands
- **Lint:** Run `flake8 .` to check code style (install with `pip install flake8`).
- **Format:** Use `black .` for auto-formatting (install with `pip install black`).
- **Test:** Use `pytest` to run all tests (install with `pip install pytest`).
- **Single test:** Run `pytest path/to/test_file.py::test_func` to run a specific test.
- **Run app:** Start the Dash app with `python dash-minimal/app.py`.

## Code Style Guidelines
- **Imports:** Group as standard library, third-party, then local. Use absolute imports.
- **Formatting:** Follow PEP8. Use 4 spaces per indent. No tabs.
- **Types:** Use Python type hints for all functions and public variables.
- **Naming:** snake_case for functions/variables, PascalCase for classes, UPPER_SNAKE_CASE for constants.
- **Error Handling:** Use try/except. Log errors with context. Avoid bare excepts.
- **Comments:** Use docstrings for all public functions/classes. Comment complex logic.
- **Functions:** Keep functions short and focused (≤30 lines). One responsibility per function.
- **Files:** Keep files under 300 lines. Split large modules.
- **Commits/PRs:** Write clear, descriptive commit messages and PRs focused on the "why".

## Agentic Coding
- Always run lint and tests before submitting changes.
- Follow code style strictly for consistency.
- If Cursor or Copilot rules are added, update this file to include them.

