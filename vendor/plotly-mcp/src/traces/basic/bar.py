"""
Bar Trace Builder
Creates bar charts with full customization support
"""

import plotly.graph_objects as go
from typing import List, Union, Optional, Any

async def create_bar_trace(
    x_data: List[Union[str, float, int]],
    y_data: List[Union[float, int]],
    colors: Union[str, List[str]] = "blue",
    opacity: float = 1.0,
    orientation: str = "v",
    text: Optional[Union[List[str], str]] = None,
    name: str = "bar",
    show_legend: bool = True,
    hover_template: Optional[str] = None,
    **kwargs
) -> str:
    """
    Create a bar chart trace with comprehensive customization
    
    Args:
        x_data: X-axis categories or values
        y_data: Y-axis values for bar heights
        colors: Color(s) for bars - single color or list
        opacity: Bar opacity (0-1)
        orientation: Bar orientation - 'v' (vertical) or 'h' (horizontal)
        text: Text labels to display on bars
        name: Trace name for legend
        show_legend: Whether to show in legend
        hover_template: Custom hover template
        **kwargs: Additional Plotly bar parameters
        
    Returns:
        HTML string of the complete figure
    """
    
    try:
        # Validate data
        if len(x_data) != len(y_data):
            raise ValueError("x_data and y_data must have the same length")
        
        # Create the bar trace
        trace = go.Bar(
            x=x_data if orientation == "v" else y_data,
            y=y_data if orientation == "v" else x_data,
            name=name,
            showlegend=show_legend,
            opacity=opacity,
            marker=dict(
                color=colors,
                opacity=opacity
            ),
            text=text,
            textposition="auto" if text else None,
            hovertemplate=hover_template,
            orientation=orientation,
            **kwargs
        )
        
        # Create figure with the trace
        fig = go.Figure(data=[trace])
        
        # Update layout based on orientation
        if orientation == "v":
            fig.update_layout(
                title=f"Bar Chart: {name}",
                xaxis_title="Categories",
                yaxis_title="Values"
            )
        else:
            fig.update_layout(
                title=f"Horizontal Bar Chart: {name}",
                xaxis_title="Values", 
                yaxis_title="Categories"
            )
        
        fig.update_layout(
            width=800,
            height=600,
            template="plotly_white"
        )
        
        # Generate HTML
        html_content = fig.to_html(
            include_plotlyjs="cdn",
            div_id="bar-chart",
            config={
                'displayModeBar': True,
                'displaylogo': False,
                'modeBarButtonsToRemove': ['pan2d', 'lasso2d']
            }
        )
        
        return html_content
        
    except Exception as e:
        raise ValueError(f"Error creating bar trace: {str(e)}")
