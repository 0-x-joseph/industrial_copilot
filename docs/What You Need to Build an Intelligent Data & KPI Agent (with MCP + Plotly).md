
# **_What You Need to Build an Intelligent Data & KPI Agent (with MCP + Plotly)_**

To build or use a system that supports CSV data, KPI extraction, and Plotly visualizations under a context-aware (MCP) framework, these are the essentials:

1. **Data ingestion & parsing (CSV, dataframes)**
    - Import CSVs into a structured form (e.g. `pandas.DataFrame` in Python).
    - Validate, clean, handle missing values, unify schemas, parse dates, numeric types, etc.
2. **KPI calculation logic / metrics layer**
    - Define functions (or APIs) to compute key metrics from the data (e.g. sums, averages, growth rates, conversion rates, ratios, trends).
    - Provide filters (time windows, dimensions, categories) so that KPIs can be relative (e.g. “sales last month vs prior month”).
3. **Context / memory (the MCP part)**
    - Track which dataset is being used, what filters or transformations have been applied, what the user’s “focus” is (e.g. region, product line).
    - Enable chained queries (the user can ask: “Show me KPI for product A last month; then break it down by region; then compare to same period last year,” without re-specifying everything).
    - Resolve ambiguities, manage default behaviors, and apply safety rules (e.g. don’t allow queries that exceed data bounds).
4. **Visualization layer (Plotly / Dash / similar)**
    - Use Plotly (or Plotly + Dash) to render interactive charts, KPI cards, sparklines, trend lines, gauge charts, etc.
    - Use callbacks and interactivity so that when the user changes a filter, the KPI cards and charts update.
    - Use layout and design best practices (e.g. KPI cards at top, charts below, consistent color scales) [Medium+3Medium+3learnpython.com+3](https://medium.com/%40Modexa/8-plotly-altair-patterns-for-interactive-reports-db6fdc743fcc?utm_source=chatgpt.com)
5. **Deployment / interface**
    - Either in a notebook interface (for exploration), or as a web app/dashboard (e.g. with Dash, Streamlit, FastAPI + front end).
    - Possibly tie into the MCP framework so the UI and the agent can share context.
6. **Error handling, validation, and user feedback**
    - Guard against bad queries, missing data, ambiguous filters.
    - If the user asks something out-of-bounds, prompt for clarifications.
    - Logging, observability, and auditability (e.g. track what KPI formula was used, which data slice was visualized).