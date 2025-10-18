"""
Interaction Configuration System
Handles hover effects, zoom, pan, and other interactive features
"""

from typing import Dict, Any, Optional, List, Union

def configure_hover(
    mode: str = "closest",
    template: Optional[str] = None,
    bgcolor: str = "white",
    bordercolor: str = "black",
    font_size: int = 12,
    font_color: str = "black"
) -> Dict[str, Any]:
    """
    Configure hover behavior
    
    Args:
        mode: Hover mode - 'closest', 'x', 'y', 'x unified', 'y unified'
        template: Custom hover template
        bgcolor: Hover box background color
        bordercolor: Hover box border color
        font_size: Hover text font size
        font_color: Hover text color
        
    Returns:
        Dictionary of hover configuration
    """
    
    config = {
        "hovermode": mode,
        "hoverlabel": dict(
            bgcolor=bgcolor,
            bordercolor=bordercolor,
            font=dict(size=font_size, color=font_color)
        )
    }
    
    if template:
        config["hovertemplate"] = template
    
    return config

def configure_zoom_pan(
    enable_zoom: bool = True,
    enable_pan: bool = True,
    zoom_anchor: str = "center",
    dragmode: str = "zoom"
) -> Dict[str, Any]:
    """
    Configure zoom and pan behavior
    
    Args:
        enable_zoom: Enable zoom functionality
        enable_pan: Enable pan functionality
        zoom_anchor: Zoom anchor point - 'center', 'cursor'
        dragmode: Default drag mode - 'zoom', 'pan', 'select', 'lasso'
        
    Returns:
        Dictionary of zoom/pan configuration
    """
    
    config = {
        "dragmode": dragmode,
        "scrollZoom": enable_zoom
    }
    
    if zoom_anchor:
        config["xaxis"] = dict(fixedrange=not enable_zoom)
        config["yaxis"] = dict(fixedrange=not enable_zoom)
    
    return config

def configure_animations(
    enabled: bool = False,
    duration: int = 500,
    easing: str = "cubic-in-out",
    frame_duration: int = 500,
    transition_duration: int = 500
) -> Dict[str, Any]:
    """
    Configure animation settings
    
    Args:
        enabled: Enable animations
        duration: Animation duration in milliseconds
        easing: Animation easing function
        frame_duration: Frame duration for animated plots
        transition_duration: Transition duration between frames
        
    Returns:
        Dictionary of animation configuration
    """
    
    if not enabled:
        return {}
    
    return {
        "transition": dict(duration=duration, easing=easing),
        "frame": dict(duration=frame_duration),
        "layout": dict(transition=dict(duration=transition_duration))
    }

def configure_toolbar(
    show_toolbar: bool = True,
    buttons_to_remove: Optional[List[str]] = None,
    custom_buttons: Optional[List[Dict[str, Any]]] = None
) -> Dict[str, Any]:
    """
    Configure the modebar (toolbar) settings
    
    Args:
        show_toolbar: Show the modebar
        buttons_to_remove: List of button names to remove
        custom_buttons: Custom buttons to add
        
    Returns:
        Dictionary of toolbar configuration
    """
    
    config = {
        "displayModeBar": show_toolbar,
        "displaylogo": False
    }
    
    if buttons_to_remove:
        config["modeBarButtonsToRemove"] = buttons_to_remove
    
    if custom_buttons:
        config["modeBarButtonsToAdd"] = custom_buttons
    
    return config

def add_annotations(
    annotations: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    Add text annotations to the plot
    
    Args:
        annotations: List of annotation configurations
        
    Returns:
        Dictionary with annotations configuration
    """
    
    return {"annotations": annotations}

def create_annotation(
    text: str,
    x: Union[float, str],
    y: Union[float, str],
    xref: str = "x",
    yref: str = "y",
    showarrow: bool = True,
    arrowhead: int = 2,
    arrowcolor: str = "black",
    font_size: int = 12,
    font_color: str = "black",
    bgcolor: str = "white",
    bordercolor: str = "black",
    **kwargs
) -> Dict[str, Any]:
    """
    Create a single annotation
    
    Args:
        text: Annotation text
        x: X position
        y: Y position
        xref: X reference - 'x', 'paper', 'x domain'
        yref: Y reference - 'y', 'paper', 'y domain'
        showarrow: Show arrow pointing to position
        arrowhead: Arrow head style (0-8)
        arrowcolor: Arrow color
        font_size: Text font size
        font_color: Text color
        bgcolor: Background color
        bordercolor: Border color
        **kwargs: Additional annotation parameters
        
    Returns:
        Dictionary of annotation configuration
    """
    
    annotation = {
        "text": text,
        "x": x,
        "y": y,
        "xref": xref,
        "yref": yref,
        "showarrow": showarrow,
        "arrowhead": arrowhead,
        "arrowcolor": arrowcolor,
        "font": dict(size=font_size, color=font_color),
        "bgcolor": bgcolor,
        "bordercolor": bordercolor
    }
    
    annotation.update(kwargs)
    return annotation
