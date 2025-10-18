"""
Line Trace Builder
Creates line charts with full customization support
"""

import plotly.graph_objects as go
from typing import List, Union, Optional, Any

async def create_line_trace(
    x_data: List[Union[float, int, str]],
    y_data: List[Union[float, int]],
    color: str = "blue",
    width: float = 2,
    dash: str = "solid",
    fill: Optional[str] = None,
    name: str = "line",
    show_legend: bool = True,
    hover_template: Optional[str] = None,
    **kwargs
) -> str:
    """
    Create a line chart trace with comprehensive customization
    
    Args:
        x_data: X-axis data points
        y_data: Y-axis data points
        color: Line color
        width: Line width in pixels
        dash: Line style - 'solid', 'dash', 'dot', 'dashdot'
        fill: Fill area - None, 'tozeroy', 'tonexty', 'toself'
        name: Trace name for legend
        show_legend: Whether to show in legend
        hover_template: Custom hover template
        **kwargs: Additional Plotly scatter parameters
        
    Returns:
        HTML string of the complete figure
    """
    
    try:
        # Validate data
        if len(x_data) != len(y_data):
            raise ValueError("x_data and y_data must have the same length")
        
        # Create the line trace
        trace = go.Scatter(
            x=x_data,
            y=y_data,
            mode="lines",
            name=name,
            showlegend=show_legend,
            line=dict(
                color=color,
                width=width,
                dash=dash
            ),
            fill=fill,
            hovertemplate=hover_template,
            **kwargs
        )
        
        # Create figure with the trace
        fig = go.Figure(data=[trace])
        
        # Update layout for better appearance
        fig.update_layout(
            title=f"Line Chart: {name}",
            xaxis_title="X Values",
            yaxis_title="Y Values",
            width=800,
            height=600,
            template="plotly_white"
        )
        
        # Generate HTML
        html_content = fig.to_html(
            include_plotlyjs="cdn",
            div_id="line-chart",
            config={
                'displayModeBar': True,
                'displaylogo': False,
                'modeBarButtonsToRemove': ['pan2d', 'lasso2d']
            }
        )
        
        return html_content
        
    except Exception as e:
        raise ValueError(f"Error creating line trace: {str(e)}")
