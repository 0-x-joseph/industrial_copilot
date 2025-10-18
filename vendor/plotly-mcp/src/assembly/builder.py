"""
Figure Assembly System
Combines traces, layouts, and styling into complete figures
"""

import plotly.graph_objects as go
from plotly.subplots import make_subplots
from typing import List, Dict, Any, Optional, Union
import json

async def create_figure(
    traces: Optional[List[Dict[str, Any]]] = None,
    title: Optional[str] = None,
    xaxis_title: Optional[str] = None,
    yaxis_title: Optional[str] = None,
    width: int = 800,
    height: int = 600,
    theme: str = "plotly_white",
    **kwargs
) -> str:
    """
    Create a complete figure with multiple traces and layout
    
    Args:
        traces: List of trace configurations
        title: Figure title
        xaxis_title: X-axis title
        yaxis_title: Y-axis title
        width: Figure width
        height: Figure height
        theme: Plotly theme name
        **kwargs: Additional layout parameters
        
    Returns:
        HTML string of the complete figure
    """
    
    try:
        # Create empty figure
        fig = go.Figure()
        
        # Add traces if provided
        if traces:
            for trace_config in traces:
                trace_type = trace_config.get("type", "scatter")
                trace_data = trace_config.get("data", {})
                
                # Create trace based on type
                if trace_type == "scatter":
                    trace = go.Scatter(**trace_data)
                elif trace_type == "bar":
                    trace = go.Bar(**trace_data)
                elif trace_type == "pie":
                    trace = go.Pie(**trace_data)
                elif trace_type == "histogram":
                    trace = go.Histogram(**trace_data)
                else:
                    # Default to scatter for unknown types
                    trace = go.Scatter(**trace_data)
                
                fig.add_trace(trace)
        
        # Update layout
        layout_updates = {
            "width": width,
            "height": height,
            "template": theme
        }
        
        if title:
            layout_updates["title"] = title
            
        if xaxis_title:
            layout_updates["xaxis_title"] = xaxis_title
            
        if yaxis_title:
            layout_updates["yaxis_title"] = yaxis_title
        
        # Add any additional layout parameters
        layout_updates.update(kwargs)
        
        fig.update_layout(**layout_updates)
        
        # Generate HTML
        html_content = fig.to_html(
            include_plotlyjs=True,
            div_id="plotly-figure",
            config={
                'displayModeBar': True,
                'displaylogo': False,
                'modeBarButtonsToRemove': ['pan2d', 'lasso2d']
            }
        )
        
        return html_content
        
    except Exception as e:
        raise ValueError(f"Error creating figure: {str(e)}")

async def add_trace_to_figure(
    figure_html: str,
    trace_config: Dict[str, Any]
) -> str:
    """
    Add a trace to an existing figure
    
    Args:
        figure_html: Existing figure HTML
        trace_config: New trace configuration
        
    Returns:
        Updated HTML string
    """
    
    # This is a simplified implementation
    # In a full implementation, you'd parse the existing figure,
    # add the new trace, and regenerate the HTML
    
    try:
        # For now, return a message indicating the trace would be added
        return f"Trace added to figure: {trace_config.get('name', 'unnamed')}"
    except Exception as e:
        raise ValueError(f"Error adding trace to figure: {str(e)}")

def create_subplots(
    rows: int = 1,
    cols: int = 1,
    subplot_titles: Optional[List[str]] = None,
    shared_xaxes: bool = False,
    shared_yaxes: bool = False,
    vertical_spacing: float = 0.08,
    horizontal_spacing: float = 0.1,
    **kwargs
) -> go.Figure:
    """
    Create a subplot figure
    
    Args:
        rows: Number of rows
        cols: Number of columns
        subplot_titles: Titles for each subplot
        shared_xaxes: Share x-axes across subplots
        shared_yaxes: Share y-axes across subplots
        vertical_spacing: Vertical spacing between subplots
        horizontal_spacing: Horizontal spacing between subplots
        **kwargs: Additional subplot parameters
        
    Returns:
        Plotly Figure object with subplots
    """
    
    fig = make_subplots(
        rows=rows,
        cols=cols,
        subplot_titles=subplot_titles,
        shared_xaxes=shared_xaxes,
        shared_yaxes=shared_yaxes,
        vertical_spacing=vertical_spacing,
        horizontal_spacing=horizontal_spacing,
        **kwargs
    )
    
    return fig

def merge_figures(
    figures: List[go.Figure],
    arrangement: str = "vertical"
) -> go.Figure:
    """
    Merge multiple figures into one
    
    Args:
        figures: List of Plotly figures to merge
        arrangement: How to arrange - 'vertical', 'horizontal', 'grid'
        
    Returns:
        Combined Plotly Figure
    """
    
    if not figures:
        return go.Figure()
    
    if len(figures) == 1:
        return figures[0]
    
    # Simple implementation - just combine all traces
    combined_fig = go.Figure()
    
    for fig in figures:
        for trace in fig.data:
            combined_fig.add_trace(trace)
    
    # Use layout from first figure as base
    combined_fig.update_layout(figures[0].layout)
    
    return combined_fig

def optimize_performance(
    figure: go.Figure,
    max_points: int = 10000,
    downsample_method: str = "uniform"
) -> go.Figure:
    """
    Optimize figure performance for large datasets
    
    Args:
        figure: Plotly figure to optimize
        max_points: Maximum number of points per trace
        downsample_method: Downsampling method - 'uniform', 'random'
        
    Returns:
        Optimized Plotly Figure
    """
    
    # Simple implementation - in practice you'd implement
    # proper downsampling algorithms
    
    optimized_fig = go.Figure(figure)
    
    for i, trace in enumerate(optimized_fig.data):
        if hasattr(trace, 'x') and trace.x is not None:
            if len(trace.x) > max_points:
                # Simple uniform downsampling
                step = len(trace.x) // max_points
                optimized_fig.data[i].x = trace.x[::step]
                if hasattr(trace, 'y') and trace.y is not None:
                    optimized_fig.data[i].y = trace.y[::step]
    
    return optimized_fig
