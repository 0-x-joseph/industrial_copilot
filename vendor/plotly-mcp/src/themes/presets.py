"""
Theme Presets System
Predefined themes for professional chart styling
"""

from typing import Dict, Any, List

def get_theme_config(theme_name: str) -> Dict[str, Any]:
    """
    Get configuration for a predefined theme
    
    Args:
        theme_name: Name of the theme
        
    Returns:
        Dictionary of theme configuration
    """
    
    themes = {
        "corporate": get_corporate_theme(),
        "dark": get_dark_theme(),
        "minimal": get_minimal_theme(),
        "sci_fi": get_sci_fi_theme(),
        "pastel": get_pastel_theme()
    }
    
    return themes.get(theme_name, themes["corporate"])

def get_corporate_theme() -> Dict[str, Any]:
    """Professional corporate theme"""
    
    return {
        "template": "plotly_white",
        "colorway": ["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd",
                     "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"],
        "layout": {
            "font": {"family": "Arial, sans-serif", "size": 12, "color": "#2e2e2e"},
            "title": {"font": {"size": 18, "color": "#1a1a1a"}},
            "paper_bgcolor": "white",
            "plot_bgcolor": "white",
            "gridcolor": "#e6e6e6",
            "legend": {
                "bgcolor": "rgba(255,255,255,0.8)",
                "bordercolor": "#cccccc",
                "borderwidth": 1
            }
        }
    }

def get_dark_theme() -> Dict[str, Any]:
    """Dark theme for modern interfaces"""
    
    return {
        "template": "plotly_dark",
        "colorway": ["#636EFA", "#EF553B", "#00CC96", "#AB63FA", "#FFA15A",
                     "#19D3F3", "#FF6692", "#B6E880", "#FF97FF", "#FECB52"],
        "layout": {
            "font": {"family": "Arial, sans-serif", "size": 12, "color": "#ffffff"},
            "title": {"font": {"size": 18, "color": "#ffffff"}},
            "paper_bgcolor": "#2e2e2e",
            "plot_bgcolor": "#3e3e3e",
            "gridcolor": "#555555",
            "legend": {
                "bgcolor": "rgba(46,46,46,0.8)",
                "bordercolor": "#666666",
                "borderwidth": 1
            }
        }
    }

def get_minimal_theme() -> Dict[str, Any]:
    """Clean minimal theme"""
    
    return {
        "template": "simple_white",
        "colorway": ["#4287f5", "#f54242", "#42f554", "#f5a442", "#a442f5"],
        "layout": {
            "font": {"family": "Helvetica, sans-serif", "size": 11, "color": "#333333"},
            "title": {"font": {"size": 16, "color": "#222222"}},
            "paper_bgcolor": "white",
            "plot_bgcolor": "white",
            "showlegend": True,
            "legend": {
                "bgcolor": "rgba(255,255,255,0)",
                "borderwidth": 0
            }
        }
    }

def get_sci_fi_theme() -> Dict[str, Any]:
    """Futuristic sci-fi theme with neon colors"""
    
    return {
        "template": "plotly_dark",
        "colorway": ["#00ffff", "#ff00ff", "#ffff00", "#00ff00", "#ff0080",
                     "#8000ff", "#ff8000", "#0080ff", "#80ff00", "#ff0040"],
        "layout": {
            "font": {"family": "Courier New, monospace", "size": 12, "color": "#00ffff"},
            "title": {"font": {"size": 18, "color": "#00ffff"}},
            "paper_bgcolor": "#0a0a0a",
            "plot_bgcolor": "#1a1a1a",
            "gridcolor": "#333333",
            "legend": {
                "bgcolor": "rgba(10,10,10,0.8)",
                "bordercolor": "#00ffff",
                "borderwidth": 1
            }
        }
    }

def get_pastel_theme() -> Dict[str, Any]:
    """Soft pastel theme for gentle visualizations"""
    
    return {
        "template": "plotly_white",
        "colorway": ["#AEC7E8", "#FFBB78", "#98DF8A", "#FF9896", "#C5B0D5",
                     "#C49C94", "#F7B6D3", "#C7C7C7", "#DBDB8D", "#9EDAE5"],
        "layout": {
            "font": {"family": "Georgia, serif", "size": 12, "color": "#4a4a4a"},
            "title": {"font": {"size": 18, "color": "#2a2a2a"}},
            "paper_bgcolor": "#fafafa",
            "plot_bgcolor": "white",
            "gridcolor": "#eeeeee",
            "legend": {
                "bgcolor": "rgba(250,250,250,0.8)",
                "bordercolor": "#dddddd",
                "borderwidth": 1
            }
        }
    }

def apply_theme_to_figure(figure_dict: Dict[str, Any], theme_name: str) -> Dict[str, Any]:
    """
    Apply a theme to a figure configuration
    
    Args:
        figure_dict: Figure configuration dictionary
        theme_name: Name of theme to apply
        
    Returns:
        Updated figure configuration with theme applied
    """
    
    theme_config = get_theme_config(theme_name)
    
    # Update layout with theme settings
    if "layout" not in figure_dict:
        figure_dict["layout"] = {}
    
    figure_dict["layout"].update(theme_config.get("layout", {}))
    
    # Update template
    if "template" in theme_config:
        figure_dict["layout"]["template"] = theme_config["template"]
    
    # Update color sequence
    if "colorway" in theme_config:
        figure_dict["layout"]["colorway"] = theme_config["colorway"]
    
    return figure_dict

def get_available_themes() -> List[str]:
    """
    Get list of available theme names
    
    Returns:
        List of theme names
    """
    
    return ["corporate", "dark", "minimal", "sci_fi", "pastel"]
