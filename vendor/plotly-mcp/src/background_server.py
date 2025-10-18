#!/usr/bin/env python3
"""
Background Plotly Server
Handles chart generation and HTML file management
"""

import asyncio
import json
import logging
import os
import webbrowser
import time
from typing import Any, Dict, List, Optional, Union

import plotly.graph_objects as go
import plotly.offline as pyo
from plotly.subplots import make_subplots
import pandas as pd

# Import our trace builders
from traces.basic.scatter import create_scatter_trace
from traces.basic.bar import create_bar_trace  
from traces.basic.line import create_line_trace
from traces.basic.pie import create_pie_trace
from traces.basic.histogram import create_histogram_trace

# Import layout and assembly systems
from layouts.axes import configure_xaxis, configure_yaxis
from layouts.styling import set_margins, configure_legend
from assembly.builder import create_figure

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("plotly-background-server")

# Create output directory for HTML files
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "output")
os.makedirs(OUTPUT_DIR, exist_ok=True)

def save_and_open_html(html_content: str, filename: str = "chart.html") -> str:
    """
    Save HTML content to file and open in browser
    
    Args:
        html_content: The HTML string to save
        filename: Name of the file to save
        
    Returns:
        File path of the saved HTML file
    """
    try:
        filepath = os.path.join(OUTPUT_DIR, filename)
        
        # Save HTML to file
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(html_content)
        
        # Open in browser
        webbrowser.open(f"file://{os.path.abspath(filepath)}")
        
        logger.info(f"Chart saved and opened: {filepath}")
        return filepath
        
    except Exception as e:
        logger.error(f"Error saving/opening HTML: {e}")
        return html_content

async def create_chart(chart_type: str, **kwargs) -> str:
    """
    Create a chart based on type and parameters
    
    Args:
        chart_type: Type of chart to create
        **kwargs: Chart parameters
        
    Returns:
        File path of the created chart
    """
    try:
        if chart_type == "scatter":
            result = await create_scatter_trace(**kwargs)
            filename = f"scatter_{kwargs.get('name', 'chart').replace(' ', '_')}.html"
        elif chart_type == "bar":
            result = await create_bar_trace(**kwargs)
            filename = f"bar_{kwargs.get('name', 'chart').replace(' ', '_')}.html"
        elif chart_type == "line":
            result = await create_line_trace(**kwargs)
            filename = f"line_{kwargs.get('name', 'chart').replace(' ', '_')}.html"
        elif chart_type == "pie":
            result = await create_pie_trace(**kwargs)
            filename = f"pie_{kwargs.get('name', 'chart').replace(' ', '_')}.html"
        elif chart_type == "histogram":
            result = await create_histogram_trace(**kwargs)
            filename = f"histogram_{kwargs.get('name', 'chart').replace(' ', '_')}.html"
        else:
            raise ValueError(f"Unsupported chart type: {chart_type}")
        
        # Save and open the HTML
        filepath = save_and_open_html(result, filename)
        
        return f"{chart_type.title()} chart created and opened in browser: {filepath}"
        
    except Exception as e:
        logger.error(f"Error creating {chart_type} chart: {e}")
        return f"Error creating {chart_type} chart: {str(e)}"

def main():
    """Main function for background server"""
    logger.info("Starting Background Plotly Server")
    logger.info(f"HTML output directory: {OUTPUT_DIR}")
    logger.info("Server is ready to handle chart requests")
    
    # Keep the server running
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        logger.info("Background server shutting down...")

if __name__ == "__main__":
    main() 
