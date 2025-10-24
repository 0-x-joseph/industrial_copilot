# AGENTS.md

## Build, Lint, and Test Commands
- **Environment:** Use `nix develop` to enter dev shell with all dependencies (Python 3.11, dash, plotly, pandas)
- **Lint:** Run `ruff check .` to check code style or `flake8 .` (both available in Nix shell)
- **Format:** Use `black .` for auto-formatting (88 char line length, follows pyproject.toml config)
- **Test:** Use `pytest` to run all tests. For plotly-mcp: `cd vendor/plotly-mcp && pytest tests/`
- **Single test:** Run `pytest tests/test_file.py::test_function` for specific tests
- **Run Dash app:** `python dash-minimal/app.py` (opens http://127.0.0.1:8050, debug mode enabled)
- **Run MCP server:** `cd vendor/plotly-mcp/src && python server.py` for development testing

## Code Style Guidelines
- **Imports:** Group stdlib, third-party, local. Use absolute imports. Follow server.py:8-26 pattern
- **Formatting:** PEP8 compliant, 88 char line length, 4 spaces, no tabs (black/ruff config in pyproject.toml)
- **Types:** Use type hints for all functions. Import from typing: Dict, List, Optional, Union, Any
- **Naming:** snake_case functions/vars, PascalCase classes, UPPER_SNAKE_CASE constants
- **Error Handling:** Use try/except with logging context. Import logging, avoid bare except clauses
- **Docstrings:** Triple quotes for public functions/classes. See server.py:2-6 docstring example
- **Async:** Use async/await for MCP tools, follow FastMCP patterns. Import from mcp.server.fastmcp
- **Functions:** Keep ≤30 lines, single responsibility principle. Modularize complex logic
- **Project Structure:** Follow vendor/plotly-mcp layout: traces/, layouts/, assembly/ subdirectories

