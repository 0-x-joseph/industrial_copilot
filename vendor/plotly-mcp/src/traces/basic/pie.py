"""
Pie Trace Builder
Creates pie charts with full customization support
"""

import plotly.graph_objects as go
from typing import List, Union, Optional, Any

async def create_pie_trace(
    labels: List[str],
    values: List[Union[float, int]],
    colors: Optional[List[str]] = None,
    hole: float = 0,
    textinfo: str = "label+percent",
    textposition: str = "auto",
    name: str = "pie",
    show_legend: bool = True,
    **kwargs
) -> str:
    """
    Create a pie chart trace with comprehensive customization
    
    Args:
        labels: Slice labels
        values: Slice values (will be converted to percentages)
        colors: Custom colors for slices (optional)
        hole: Hole size for donut chart (0-1, 0 = full pie)
        textinfo: Text to display - 'label', 'percent', 'value', 'label+percent', etc.
        textposition: Text position - 'inside', 'outside', 'auto'
        name: Trace name for legend
        show_legend: Whether to show in legend
        **kwargs: Additional Plotly pie parameters
        
    Returns:
        HTML string of the complete figure
    """
    
    try:
        # Validate data
        if len(labels) != len(values):
            raise ValueError("labels and values must have the same length")
        
        if not all(v >= 0 for v in values):
            raise ValueError("All values must be non-negative")
        
        # Create the pie trace
        trace = go.Pie(
            labels=labels,
            values=values,
            name=name,
            showlegend=show_legend,
            hole=hole,
            textinfo=textinfo,
            textposition=textposition,
            marker=dict(colors=colors) if colors else None,
            **kwargs
        )
        
        # Create figure with the trace
        fig = go.Figure(data=[trace])
        
        # Update layout for better appearance
        chart_type = "Donut Chart" if hole > 0 else "Pie Chart"
        fig.update_layout(
            title=f"{chart_type}: {name}",
            width=800,
            height=600,
            template="plotly_white",
            # Center the pie chart
            margin=dict(t=100, b=50, l=50, r=50)
        )
        
        # Generate HTML
        html_content = fig.to_html(
            include_plotlyjs="cdn",
            div_id="pie-chart",
            config={
                'displayModeBar': True,
                'displaylogo': False,
                'modeBarButtonsToRemove': ['pan2d', 'lasso2d', 'zoom2d', 'autoScale2d']
            }
        )
        
        return html_content
        
    except Exception as e:
        raise ValueError(f"Error creating pie trace: {str(e)}")
