"""
Styling Configuration System
Handles colors, fonts, margins, and visual appearance
"""

from typing import Dict, Any, Optional, List, Union

def set_margins(
    top: int = 50,
    bottom: int = 50,
    left: int = 50,
    right: int = 50,
    pad: int = 0
) -> Dict[str, int]:
    """
    Set figure margins
    
    Args:
        top: Top margin in pixels
        bottom: Bottom margin in pixels
        left: Left margin in pixels
        right: Right margin in pixels
        pad: Padding in pixels
        
    Returns:
        Dictionary of margin configuration
    """
    
    return {
        "t": top,
        "b": bottom,
        "l": left,
        "r": right,
        "pad": pad
    }

def configure_legend(
    show: bool = True,
    position: str = "top-right",
    orientation: str = "v",
    font_size: int = 12,
    font_color: str = "black",
    background_color: str = "rgba(255,255,255,0.8)",
    border_color: str = "black",
    border_width: int = 1,
    **kwargs
) -> Dict[str, Any]:
    """
    Configure legend properties
    
    Args:
        show: Whether to show legend
        position: Legend position - 'top-left', 'top-right', 'bottom-left', 'bottom-right'
        orientation: Legend orientation - 'v' (vertical) or 'h' (horizontal)
        font_size: Legend font size
        font_color: Legend font color
        background_color: Legend background color
        border_color: Legend border color
        border_width: Legend border width
        **kwargs: Additional legend parameters
        
    Returns:
        Dictionary of legend configuration
    """
    
    # Position mapping
    position_map = {
        "top-left": dict(x=0, y=1, xanchor="left", yanchor="top"),
        "top-right": dict(x=1, y=1, xanchor="right", yanchor="top"),
        "bottom-left": dict(x=0, y=0, xanchor="left", yanchor="bottom"),
        "bottom-right": dict(x=1, y=0, xanchor="right", yanchor="bottom"),
        "center": dict(x=0.5, y=0.5, xanchor="center", yanchor="middle")
    }
    
    config = {
        "showlegend": show,
        "legend": {
            "orientation": orientation,
            "font": dict(size=font_size, color=font_color),
            "bgcolor": background_color,
            "bordercolor": border_color,
            "borderwidth": border_width,
            **position_map.get(position, position_map["top-right"])
        }
    }
    
    # Add any additional parameters
    if kwargs:
        config["legend"].update(kwargs)
    
    return config

def set_color_palette(
    palette_name: str = "plotly",
    custom_colors: Optional[List[str]] = None
) -> List[str]:
    """
    Set color palette for charts
    
    Args:
        palette_name: Predefined palette name
        custom_colors: Custom color list
        
    Returns:
        List of colors
    """
    
    if custom_colors:
        return custom_colors
    
    palettes = {
        "plotly": ["#636EFA", "#EF553B", "#00CC96", "#AB63FA", "#FFA15A",
                   "#19D3F3", "#FF6692", "#B6E880", "#FF97FF", "#FECB52"],
        "viridis": ["#440154", "#31688e", "#35b779", "#fde725"],
        "blues": ["#08519c", "#3182bd", "#6baed6", "#9ecae1", "#c6dbef"],
        "reds": ["#a50f15", "#de2d26", "#fb6a4a", "#fc9272", "#fcbba1"],
        "greens": ["#006d2c", "#31a354", "#74c476", "#a1d99b", "#c7e9c0"],
        "corporate": ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd"],
        "pastel": ["#AEC7E8", "#FFBB78", "#98DF8A", "#FF9896", "#C5B0D5"]
    }
    
    return palettes.get(palette_name, palettes["plotly"])

def configure_fonts(
    title_font: Optional[Dict[str, Any]] = None,
    axis_font: Optional[Dict[str, Any]] = None,
    legend_font: Optional[Dict[str, Any]] = None,
    annotation_font: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Configure fonts for different chart elements
    
    Args:
        title_font: Title font configuration
        axis_font: Axis labels font configuration
        legend_font: Legend font configuration
        annotation_font: Annotation font configuration
        
    Returns:
        Dictionary of font configurations
    """
    
    default_title = {"family": "Arial, sans-serif", "size": 18, "color": "black"}
    default_axis = {"family": "Arial, sans-serif", "size": 12, "color": "black"}
    default_legend = {"family": "Arial, sans-serif", "size": 10, "color": "black"}
    default_annotation = {"family": "Arial, sans-serif", "size": 10, "color": "black"}
    
    return {
        "title_font": title_font or default_title,
        "axis_font": axis_font or default_axis,
        "legend_font": legend_font or default_legend,
        "annotation_font": annotation_font or default_annotation
    }
