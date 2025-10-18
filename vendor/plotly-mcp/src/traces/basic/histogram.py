"""
Histogram Trace Builder
Creates histograms with full customization support
"""

import plotly.graph_objects as go
from typing import List, Union, Optional, Any

async def create_histogram_trace(
    x_data: List[Union[float, int]],
    nbins: Optional[int] = None,
    color: str = "blue",
    opacity: float = 0.7,
    histnorm: Optional[str] = None,
    cumulative: bool = False,
    name: str = "histogram",
    show_legend: bool = True,
    **kwargs
) -> str:
    """
    Create a histogram trace with comprehensive customization
    
    Args:
        x_data: Data to create histogram from
        nbins: Number of bins (auto-calculated if None)
        color: Bar color
        opacity: Bar opacity (0-1)
        histnorm: Normalization - None, 'percent', 'probability', 'density'
        cumulative: Whether to create cumulative histogram
        name: Trace name for legend
        show_legend: Whether to show in legend
        **kwargs: Additional Plotly histogram parameters
        
    Returns:
        HTML string of the complete figure
    """
    
    try:
        # Validate data
        if not x_data:
            raise ValueError("x_data cannot be empty")
        
        if not all(isinstance(x, (int, float)) for x in x_data):
            raise ValueError("All x_data values must be numeric")
        
        # Prepare histogram parameters
        hist_params = {
            "x": x_data,
            "name": name,
            "showlegend": show_legend,
            "opacity": opacity,
            "marker": dict(color=color, opacity=opacity)
        }
        
        # Add optional parameters
        if nbins is not None:
            hist_params["nbinsx"] = nbins
            
        if histnorm is not None:
            hist_params["histnorm"] = histnorm
            
        if cumulative:
            hist_params["cumulative"] = dict(enabled=True)
            
        # Add any additional kwargs
        hist_params.update(kwargs)
        
        # Create the histogram trace
        trace = go.Histogram(**hist_params)
        
        # Create figure with the trace
        fig = go.Figure(data=[trace])
        
        # Update layout for better appearance
        chart_title = f"{'Cumulative ' if cumulative else ''}Histogram: {name}"
        y_title = "Count"
        
        if histnorm == "percent":
            y_title = "Percentage"
        elif histnorm == "probability":
            y_title = "Probability"
        elif histnorm == "density":
            y_title = "Density"
        
        fig.update_layout(
            title=chart_title,
            xaxis_title="Value",
            yaxis_title=y_title,
            width=800,
            height=600,
            template="plotly_white",
            bargap=0.1
        )
        
        # Generate HTML
        html_content = fig.to_html(
            include_plotlyjs="cdn",
            div_id="histogram-chart",
            config={
                'displayModeBar': True,
                'displaylogo': False,
                'modeBarButtonsToRemove': ['pan2d', 'lasso2d']
            }
        )
        
        return html_content
        
    except Exception as e:
        raise ValueError(f"Error creating histogram trace: {str(e)}")
