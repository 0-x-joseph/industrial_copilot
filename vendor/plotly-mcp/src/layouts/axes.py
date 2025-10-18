"""
Axes Configuration System
Handles X, Y, and Z axis properties and styling
"""

from typing import List, Optional, Union, Dict, Any

def configure_xaxis(
    title: Optional[str] = None,
    range_values: Optional[List[Union[float, int]]] = None,
    tick_values: Optional[List[Union[float, int, str]]] = None,
    tick_text: Optional[List[str]] = None,
    show_grid: bool = True,
    grid_color: str = "lightgray",
    axis_type: str = "linear",
    font_size: int = 12,
    font_color: str = "black",
    **kwargs
) -> Dict[str, Any]:
    """
    Configure X-axis properties
    
    Args:
        title: Axis title
        range_values: Axis range [min, max]
        tick_values: Custom tick positions
        tick_text: Custom tick labels
        show_grid: Show grid lines
        grid_color: Grid line color
        axis_type: Axis type - 'linear', 'log', 'date', 'category'
        font_size: Title font size
        font_color: Title font color
        **kwargs: Additional axis parameters
        
    Returns:
        Dictionary of X-axis configuration
    """
    
    config = {
        "showgrid": show_grid,
        "gridcolor": grid_color,
        "type": axis_type,
        "titlefont": dict(size=font_size, color=font_color)
    }
    
    if title:
        config["title"] = title
        
    if range_values:
        config["range"] = range_values
        
    if tick_values:
        config["tickvals"] = tick_values
        
    if tick_text:
        config["ticktext"] = tick_text
        
    # Add any additional parameters
    config.update(kwargs)
    
    return config

def configure_yaxis(
    title: Optional[str] = None,
    range_values: Optional[List[Union[float, int]]] = None,
    tick_values: Optional[List[Union[float, int, str]]] = None,
    tick_text: Optional[List[str]] = None,
    show_grid: bool = True,
    grid_color: str = "lightgray",
    axis_type: str = "linear",
    font_size: int = 12,
    font_color: str = "black",
    **kwargs
) -> Dict[str, Any]:
    """
    Configure Y-axis properties
    
    Args:
        title: Axis title
        range_values: Axis range [min, max]
        tick_values: Custom tick positions
        tick_text: Custom tick labels
        show_grid: Show grid lines
        grid_color: Grid line color
        axis_type: Axis type - 'linear', 'log', 'date', 'category'
        font_size: Title font size
        font_color: Title font color
        **kwargs: Additional axis parameters
        
    Returns:
        Dictionary of Y-axis configuration
    """
    
    config = {
        "showgrid": show_grid,
        "gridcolor": grid_color,
        "type": axis_type,
        "titlefont": dict(size=font_size, color=font_color)
    }
    
    if title:
        config["title"] = title
        
    if range_values:
        config["range"] = range_values
        
    if tick_values:
        config["tickvals"] = tick_values
        
    if tick_text:
        config["ticktext"] = tick_text
        
    # Add any additional parameters
    config.update(kwargs)
    
    return config

def configure_zaxis(
    title: Optional[str] = None,
    range_values: Optional[List[Union[float, int]]] = None,
    tick_values: Optional[List[Union[float, int, str]]] = None,
    tick_text: Optional[List[str]] = None,
    show_grid: bool = True,
    grid_color: str = "lightgray",
    axis_type: str = "linear",
    font_size: int = 12,
    font_color: str = "black",
    **kwargs
) -> Dict[str, Any]:
    """
    Configure Z-axis properties (for 3D plots)
    
    Args:
        title: Axis title
        range_values: Axis range [min, max]
        tick_values: Custom tick positions
        tick_text: Custom tick labels
        show_grid: Show grid lines
        grid_color: Grid line color
        axis_type: Axis type - 'linear', 'log', 'date', 'category'
        font_size: Title font size
        font_color: Title font color
        **kwargs: Additional axis parameters
        
    Returns:
        Dictionary of Z-axis configuration
    """
    
    config = {
        "showgrid": show_grid,
        "gridcolor": grid_color,
        "type": axis_type,
        "titlefont": dict(size=font_size, color=font_color)
    }
    
    if title:
        config["title"] = title
        
    if range_values:
        config["range"] = range_values
        
    if tick_values:
        config["tickvals"] = tick_values
        
    if tick_text:
        config["ticktext"] = tick_text
        
    # Add any additional parameters
    config.update(kwargs)
    
    return config
