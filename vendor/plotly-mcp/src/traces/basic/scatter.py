"""Scatter Trace Builder
Creates scatter plots with full customization support"""

import plotly.graph_objects as go
from typing import List, Union, Optional, Any, Dict

async def create_scatter_trace(
    x_data: List[Union[float, int, str]],
    y_data: List[Union[float, int]],
    colors: Union[str, List[str]] = "blue",
    sizes: Union[int, List[int]] = 10,
    opacity: float = 1.0,
    mode: str = "markers",
    name: str = "scatter",
    show_legend: bool = True,
    hover_template: Optional[str] = None,
    **kwargs) -> str:
    """
    Create a scatter plot trace with comprehensive customization
    
    Args:
        x_data: X-axis data points
        y_data: Y-axis data points  
        colors: Color(s) for points - single color or list
        sizes: Size(s) of points - single size or list
        opacity: Point opacity (0-1)
        mode: Display mode - 'markers', 'lines', 'markers+lines'
        name: Trace name for legend
        show_legend: Whether to show in legend
        hover_template: Custom hover template
        **kwargs: Additional Plotly scatter parameters
    
    Returns:
        HTML string of the complete figure
    """
    
    try:
        # Create the scatter trace
        trace = go.Scatter(
            x=x_data,
            y=y_data,
            mode=mode,
            name=name,
            showlegend=show_legend,
            opacity=opacity,
            marker=dict(
                color=colors,
                size=sizes,
                opacity=opacity
            ),
            hovertemplate=hover_template,
            **kwargs
        )
        
        # Create figure with the trace
        fig = go.Figure(data=[trace])
        
        # Update layout for better appearance
        fig.update_layout(
            title=f"Scatter Plot: {name}",
            xaxis_title="X Values",
            yaxis_title="Y Values",
            width=800,
            height=600,
            template="plotly_white"
        )
        
        # Generate HTML with CDN reference instead of embedding
        html_content = fig.to_html(
            include_plotlyjs="cdn",  # Use CDN instead of embedding
            div_id="scatter-plot",
            config={
                'displayModeBar': True,
                'displaylogo': False,
                'modeBarButtonsToRemove': ['pan2d', 'lasso2d']
            }
        )
        
        return html_content
        
    except Exception as e:
        raise ValueError(f"Error creating scatter trace: {str(e)}")

def validate_scatter_data(x_data: List, y_data: List) -> bool:
    """Validate scatter plot data"""
    if not x_data or not y_data:
        raise ValueError("Both x_data and y_data are required")
    
    if len(x_data) != len(y_data):
        raise ValueError("x_data and y_data must have the same length")
    
    return True
