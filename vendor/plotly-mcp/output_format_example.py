# Example: Add output_format parameter to your tools

@mcp.tool()
async def create_scatter_plot(
    x_data: List[Union[float, int, str]],
    y_data: List[Union[float, int]],
    colors: str = "blue",
    # ... other params ...
    output_format: str = "html_cdn"  # New parameter
) -> str:
    """
    output_format options:
    - "html_cdn": HTML with CDN Plotly.js (default, ~3KB)
    - "html_embedded": HTML with embedded Plotly.js (~3MB) 
    - "json": Just the Plotly JSON data (~1KB)
    """
    
    # Create figure as usual
    fig = create_figure(...)
    
    if output_format == "json":
        return fig.to_json()
    elif output_format == "html_embedded":
        return fig.to_html(include_plotlyjs=True)
    else:  # html_cdn (default)
        return fig.to_html(include_plotlyjs="cdn")
