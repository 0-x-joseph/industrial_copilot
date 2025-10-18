# Dash Minimal Example

This directory contains a minimal Dash web application for interactive data visualization.

## What does the code do?
- **Loads Data:** Reads the Gapminder dataset (country/year/population) from a public CSV URL using pandas.
- **Creates App:** Initializes a Dash app instance.
- **App Layout:**
  - Displays a title.
  - Shows a dropdown menu to select a country (default: Canada).
  - Shows a graph area for plotting.
- **Interactivity:**
  - When a country is selected from the dropdown, the app updates the graph to show that country's population over time (line chart).
- **How to Run:**
  - Run `python app.py` inside this directory.
  - Open the provided local URL in your browser to view the app.

## Requirements
- Python 3.8+
- dash
- plotly
- pandas

All dependencies can be installed using the Nix flake in the project root, or manually with pip.
