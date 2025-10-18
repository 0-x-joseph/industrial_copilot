#!/usr/bin/env python3
"""
Plotly MCP Server - Phase 1 Foundation
Complete coverage of 49+ Plotly trace types with natural language interface
Built using MCP Python SDK 1.2.0+
"""

import asyncio
import json
import logging
import os
import webbrowser
import subprocess
import threading
import time
from typing import Any, Dict, List, Optional, Union

# MCP imports - using current SDK pattern  
from mcp.server.fastmcp import FastMCP
import mcp.server.stdio

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
logger = logging.getLogger("plotly-mcp")

# Initialize FastMCP server
mcp = FastMCP("plotly-mcp-server")

# Create output directory for HTML files
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "..", "output")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Global server state
server_process = None
server_running = False
server_start_time = None

def start_background_server():
    """Start the MCP server in the background"""
    global server_process, server_running, server_start_time
    
    if server_running:
        logger.info("Server already running")
        return True
    
    try:
        # Get the path to the background server script
        server_script = os.path.join(os.path.dirname(__file__), "background_server.py")
        python_executable = "/Users/arshad/Desktop/personal/code/plotly-mcp-claude/venv-new/bin/python3"
        
        # Start server in background
        server_process = subprocess.Popen(
            [python_executable, server_script],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            cwd=os.path.dirname(__file__)
        )
        
        server_running = True
        server_start_time = time.time()
        
        # Wait a moment for server to start
        time.sleep(2)
        
        logger.info(f"Background server started (PID: {server_process.pid})")
        return True
        
    except Exception as e:
        logger.error(f"Failed to start background server: {e}")
        return False

def check_server_status():
    """Check if the background server is still running"""
    global server_process, server_running
    
    if server_process is None:
        server_running = False
        return False
    
    # Check if process is still alive
    if server_process.poll() is None:
        return True
    else:
        server_running = False
        server_process = None
        return False

def ensure_server_running():
    """Ensure the background server is running, start if needed"""
    if not check_server_status():
        logger.info("Starting background server...")
        return start_background_server()
    return True

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

# Phase 1: Basic Trace Builders

@mcp.tool()
async def create_scatter_plot(
    x_data: List[Union[float, int, str]],
    y_data: List[Union[float, int]],
    colors: str = "blue",
    sizes: int = 10,
    opacity: float = 1.0,
    mode: str = "markers",
    name: str = "scatter",
    show_legend: bool = True,
    hover_template: Optional[str] = None
) -> str:
    """
    Create a scatter plot with full customization
    
    Args:
        x_data: X-axis data points
        y_data: Y-axis data points  
        colors: Color for points
        sizes: Size of points
        opacity: Point opacity (0-1)
        mode: Display mode - 'markers', 'lines', 'markers+lines'
        name: Trace name for legend
        show_legend: Show in legend
        hover_template: Custom hover template
        
    Returns:
        HTML string of the complete scatter plot
    """
    try:
        # Ensure server is running
        ensure_server_running()
        
        result = await create_scatter_trace(
            x_data=x_data,
            y_data=y_data,
            colors=colors,
            sizes=sizes,
            opacity=opacity,
            mode=mode,
            name=name,
            show_legend=show_legend,
            hover_template=hover_template
        )
        
        # Save and open the HTML
        filepath = save_and_open_html(result, f"scatter_{name.replace(' ', '_')}.html")
        
        return f"Scatter plot created and opened in browser: {filepath}\n\nHTML Content:\n{result}"
    except Exception as e:
        logger.error(f"Error creating scatter plot: {e}")
        return f"Error creating scatter plot: {str(e)}"

@mcp.tool()
async def create_bar_chart(
    x_data: List[Union[str, float, int]],
    y_data: List[Union[float, int]],
    colors: str = "blue",
    opacity: float = 1.0,
    orientation: str = "v",
    text: Optional[Union[List[str], str]] = None,
    name: str = "bar",
    show_legend: bool = True,
    hover_template: Optional[str] = None
) -> str:
    """
    Create a bar chart with full customization
    
    Args:
        x_data: X-axis categories or values
        y_data: Y-axis values for bar heights
        colors: Color for bars
        opacity: Bar opacity (0-1)
        orientation: Bar orientation - 'v' (vertical) or 'h' (horizontal)
        text: Text labels on bars
        name: Trace name for legend
        show_legend: Show in legend
        hover_template: Custom hover template
        
    Returns:
        HTML string of the complete bar chart
    """
    try:
        # Ensure server is running
        ensure_server_running()
        
        result = await create_bar_trace(
            x_data=x_data,
            y_data=y_data,
            colors=colors,
            opacity=opacity,
            orientation=orientation,
            text=text,
            name=name,
            show_legend=show_legend,
            hover_template=hover_template
        )
        
        # Save and open the HTML
        filepath = save_and_open_html(result, f"bar_{name.replace(' ', '_')}.html")
        
        return f"Bar chart created and opened in browser: {filepath}\n\nHTML Content:\n{result}"
    except Exception as e:
        logger.error(f"Error creating bar chart: {e}")
        return f"Error creating bar chart: {str(e)}"

@mcp.tool()
async def create_line_chart(
    x_data: List[Union[float, int, str]],
    y_data: List[Union[float, int]],
    color: str = "blue",
    width: float = 2,
    dash: str = "solid",
    fill: Optional[str] = None,
    name: str = "line",
    show_legend: bool = True,
    hover_template: Optional[str] = None
) -> str:
    """
    Create a line chart with full customization
    
    Args:
        x_data: X-axis data points
        y_data: Y-axis data points
        color: Line color
        width: Line width in pixels
        dash: Line style - 'solid', 'dash', 'dot', 'dashdot'
        fill: Fill area - None, 'tozeroy', 'tonexty', 'toself'
        name: Trace name for legend
        show_legend: Show in legend
        hover_template: Custom hover template
        
    Returns:
        HTML string of the complete line chart
    """
    try:
        # Ensure server is running
        ensure_server_running()
        
        result = await create_line_trace(
            x_data=x_data,
            y_data=y_data,
            color=color,
            width=width,
            dash=dash,
            fill=fill,
            name=name,
            show_legend=show_legend,
            hover_template=hover_template
        )
        
        # Save and open the HTML
        filepath = save_and_open_html(result, f"line_{name.replace(' ', '_')}.html")
        
        return f"Line chart created and opened in browser: {filepath}\n\nHTML Content:\n{result}"
    except Exception as e:
        logger.error(f"Error creating line chart: {e}")
        return f"Error creating line chart: {str(e)}"

@mcp.tool()
async def create_pie_chart(
    labels: List[str],
    values: List[Union[float, int]],
    colors: Optional[List[str]] = None,
    hole: float = 0,
    textinfo: str = "label+percent",
    textposition: str = "auto",
    name: str = "pie",
    show_legend: bool = True
) -> str:
    """
    Create a pie chart with full customization
    
    Args:
        labels: Slice labels
        values: Slice values
        colors: Custom colors for slices
        hole: Hole size for donut chart (0-1, 0 = full pie)
        textinfo: Text display - 'label', 'percent', 'value', 'label+percent'
        textposition: Text position - 'inside', 'outside', 'auto'
        name: Trace name for legend
        show_legend: Show in legend
        
    Returns:
        HTML string of the complete pie chart
    """
    try:
        # Ensure server is running
        ensure_server_running()
        
        result = await create_pie_trace(
            labels=labels,
            values=values,
            colors=colors,
            hole=hole,
            textinfo=textinfo,
            textposition=textposition,
            name=name,
            show_legend=show_legend
        )
        
        # Save and open the HTML
        filepath = save_and_open_html(result, f"pie_{name.replace(' ', '_')}.html")
        
        return f"Pie chart created and opened in browser: {filepath}\n\nHTML Content:\n{result}"
    except Exception as e:
        logger.error(f"Error creating pie chart: {e}")
        return f"Error creating pie chart: {str(e)}"

@mcp.tool()
async def create_histogram(
    x_data: List[Union[float, int]],
    nbins: Optional[int] = None,
    color: str = "blue",
    opacity: float = 0.7,
    histnorm: Optional[str] = None,
    cumulative: bool = False,
    name: str = "histogram",
    show_legend: bool = True
) -> str:
    """
    Create a histogram with full customization
    
    Args:
        x_data: Data to create histogram from
        nbins: Number of bins (auto-calculated if None)
        color: Bar color
        opacity: Bar opacity (0-1)
        histnorm: Normalization - None, 'percent', 'probability', 'density'
        cumulative: Whether to create cumulative histogram
        name: Trace name for legend
        show_legend: Show in legend
        
    Returns:
        HTML string of the complete histogram
    """
    try:
        # Ensure server is running
        ensure_server_running()
        
        result = await create_histogram_trace(
            x_data=x_data,
            nbins=nbins,
            color=color,
            opacity=opacity,
            histnorm=histnorm,
            cumulative=cumulative,
            name=name,
            show_legend=show_legend
        )
        
        # Save and open the HTML
        filepath = save_and_open_html(result, f"histogram_{name.replace(' ', '_')}.html")
        
        return f"Histogram created and opened in browser: {filepath}\n\nHTML Content:\n{result}"
    except Exception as e:
        logger.error(f"Error creating histogram: {e}")
        return f"Error creating histogram: {str(e)}"

# Server Management Tools

@mcp.tool()
async def server_status() -> str:
    """
    Check the status of the background server
    
    Returns:
        Status information about the server
    """
    global server_process, server_running, server_start_time
    
    if check_server_status():
        uptime = time.time() - server_start_time if server_start_time else 0
        return f"✅ Server is running (PID: {server_process.pid}, Uptime: {uptime:.1f}s)"
    else:
        return "❌ Server is not running"

@mcp.tool()
async def stop_server() -> str:
    """
    Stop the background server
    
    Returns:
        Confirmation message
    """
    global server_process, server_running
    
    if server_process and server_process.poll() is None:
        server_process.terminate()
        server_process.wait()
        server_running = False
        server_process = None
        return "✅ Server stopped"
    else:
        return "❌ No server running to stop"

# Figure Assembly Tool

@mcp.tool()
async def create_multi_trace_figure(
    title: Optional[str] = None,
    xaxis_title: Optional[str] = None,
    yaxis_title: Optional[str] = None,
    width: int = 800,
    height: int = 600,
    theme: str = "plotly_white"
) -> str:
    """
    Create a figure ready for multiple traces
    
    Args:
        title: Figure title
        xaxis_title: X-axis title
        yaxis_title: Y-axis title
        width: Figure width
        height: Figure height
        theme: Plotly theme
        
    Returns:
        Instructions for adding traces to the figure
    """
    try:
        result = await create_figure(
            title=title,
            xaxis_title=xaxis_title,
            yaxis_title=yaxis_title,
            width=width,
            height=height,
            theme=theme
        )
        return result
    except Exception as e:
        logger.error(f"Error creating figure: {e}")
        return f"Error creating figure: {str(e)}"

# Development and Testing Tools

@mcp.tool()
async def generate_sample_data(
    data_type: str = "linear",
    size: int = 50,
    noise: float = 0.1
) -> Dict[str, List]:
    """
    Generate sample data for testing charts
    
    Args:
        data_type: Type of data - 'linear', 'sine', 'random', 'categories'
        size: Number of data points
        noise: Amount of noise to add (0-1)
        
    Returns:
        Dictionary with x_data and y_data lists
    """
    import random
    import math
    
    try:
        if data_type == "linear":
            x_data = list(range(size))
            y_data = [x + random.uniform(-noise*10, noise*10) for x in x_data]
        elif data_type == "sine":
            x_data = [i/10 for i in range(size)]
            y_data = [math.sin(x) + random.uniform(-noise, noise) for x in x_data]
        elif data_type == "random":
            x_data = list(range(size))
            y_data = [random.uniform(0, 100) for _ in range(size)]
        elif data_type == "categories":
            categories = ["A", "B", "C", "D", "E"][:min(size, 5)]
            x_data = categories
            y_data = [random.uniform(10, 100) for _ in categories]
        else:
            raise ValueError(f"Unsupported data_type: {data_type}")
            
        return {"x_data": x_data, "y_data": y_data}
        
    except Exception as e:
        logger.error(f"Error generating sample data: {e}")
        return {"error": str(e)}

if __name__ == "__main__":
    logger.info("Starting Plotly MCP Server - Phase 1 Foundation")
    logger.info("Available trace types: scatter, bar, line, pie, histogram")
    logger.info("Built with MCP Python SDK 1.2.0+")
    logger.info(f"HTML output directory: {OUTPUT_DIR}")
    
    # Run the FastMCP server
    mcp.run()
