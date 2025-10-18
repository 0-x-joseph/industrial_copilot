# Plotly MCP Server - Implementation Plan

## Project Overview
**Goal**: Graph Objects-only Plotly MCP server for Cursor  
**Output**: HTML visualizations from natural language  
**Control**: Minute-level customization of all chart elements  
**Scope**: Complete coverage of 50+ Plotly trace types  

## Phase 1 Status ✅

**Foundation Complete:**
- ✅ MCP server with FastMCP framework (SDK 1.2.0+)
- ✅ Project structure for 49 trace types
- ✅ 5 basic trace builders (scatter, bar, line, pie, histogram)
- ✅ Figure assembly system
- ✅ Layout controllers (axes, styling)
- ✅ Sample data generation for testing
- ✅ Cursor integration ready

## Quick Start

### 1. Install Dependencies

**With UV (recommended):**
```bash
# Install UV if you havent already
curl -LsSf https://astral.sh/uv/install.sh | sh

# Setup project
cd /Users/arshad/Desktop/personal/code/plotly-mcp-claude
uv sync
```

**With pip:**
```bash
pip install -r requirements.txt
```

### 2. Run the MCP Server
```bash
cd src
python server.py
```

### 3. Add to Cursor MCP Settings
Add this to your Cursor MCP configuration:
```json
{
  "mcpServers": {
    "plotly-mcp": {
      "command": "python",
      "args": ["/Users/arshad/Desktop/personal/code/plotly-mcp-claude/src/server.py"]
    }
  }
}
```

## Available Tools (Phase 1)

### Basic Trace Builders
1. **create_scatter_plot** - Scatter plots with markers, lines, or both
2. **create_bar_chart** - Vertical/horizontal bar charts with text labels
3. **create_line_chart** - Line charts with styling and fill options
4. **create_pie_chart** - Pie/donut charts with custom colors
5. **create_histogram** - Histograms with binning and normalization

### Utility Tools
6. **create_multi_trace_figure** - Initialize figures for multiple traces
7. **generate_sample_data** - Create test data (linear, sine, random, categories)

## Usage Examples

### Scatter Plot
```python
create_scatter_plot(
    x_data=[1, 2, 3, 4, 5],
    y_data=[2, 4, 1, 5, 3],
    colors="red",
    sizes=15,
    mode="markers+lines",
    name="My Data"
)
```

### Bar Chart
```python
create_bar_chart(
    x_data=["A", "B", "C", "D"],
    y_data=[20, 14, 23, 25],
    colors="blue",
    orientation="v",
    text=["20", "14", "23", "25"],
    name="Sales Data"
)
```

### Pie Chart
```python
create_pie_chart(
    labels=["Apple", "Orange", "Banana"],
    values=[30, 25, 45],
    hole=0.3,  # Donut chart
    textinfo="label+percent"
)
```

### Generate Test Data
```python
generate_sample_data(
    data_type="sine",
    size=100,
    noise=0.1
)
```

## Architecture

```
plotly-mcp-claude/
├── src/
│   ├── server.py              # Main MCP server (FastMCP)
│   ├── traces/                # All trace builders (5/49 complete)
│   │   └── basic/            # Phase 1: scatter, bar, line, pie, histogram
│   ├── layouts/              # Layout controllers
│   │   ├── axes.py           # X/Y/Z axis configuration
│   │   └── styling.py        # Colors, fonts, margins, legends
│   ├── assembly/             # Figure building
│   │   └── builder.py        # Combine traces + layout
│   └── [themes/, nlp/]       # Future phases
├── data/                     # Sample datasets (future)
├── examples/                 # Usage examples (future)
├── tests/                    # Unit tests (future)
├── requirements.txt          # Python dependencies
├── pyproject.toml           # Project configuration
└── README.md                # This file
```

## Complete Plotly Trace Types (Planned)

### Phase 1 ✅ (5/49)
- **Basic Charts**: scatter ✅, bar ✅, line ✅, pie ✅, histogram ✅

### Phase 2 📋 (15 more types)
- **Statistical Charts**: box, violin, heatmap, contour, splom, parcoords, parcats, histogram2d
- **3D Charts**: scatter3d, surface, mesh3d, volume, isosurface, cone, streamtube

### Phase 3 📋 (15 more types)  
- **Geographic Charts**: choropleth, choroplethmap, choroplethmapbox, scattergeo, scattermap, scattermapbox, densitymap, densitymapbox
- **Financial Charts**: candlestick, ohlc, waterfall
- **Hierarchical Charts**: treemap, sunburst, icicle, sankey

### Phase 4 📋 (14 more types)
- **Polar & Coordinates**: scatterpolar, scatterpolargl, scattersmith, scatterternary, carpet, scattercarpet
- **Specialized Charts**: funnel, funnelarea, indicator, image, table
- **Additional**: barpolar, histogram2dcontour, contourcarpet

**Total: 49 trace builders planned**

## Implementation Timeline

- **Phase 1** ✅ Foundation (5 basic traces) - **COMPLETE**
- **Phase 2** 🚧 Statistical & 3D traces (15 more types)
- **Phase 3** 📋 Geographic & Financial traces (15 more types)  
- **Phase 4** 📋 Remaining traces & complete layout (14 more types)
- **Phase 5** 📋 Theming system (sci-fi, corporate, dark themes)
- **Phase 6** 📋 Natural language interface

## Technical Details

### MCP Server Features
- Built with **MCP Python SDK 1.2.0+**
- **FastMCP** framework for easy tool definition
- **Async/await** pattern throughout
- **Type hints** for all parameters
- **Error handling** with detailed messages
- **Logging** for debugging

### Chart Features
- **HTML output** with embedded Plotly.js
- **Interactive** charts (zoom, pan, hover)
- **Responsive design** (800x600 default)
- **Professional styling** (plotly_white theme)
- **Full customization** of all visual elements

### Testing
Each trace type returns complete HTML that can be:
- Viewed directly in browser  
- Embedded in applications
- Displayed in Cursor/Claude interface

## Next Steps for Phase 2

Ready to add Statistical & 3D traces:
- **Box plots** - quartile visualization
- **Violin plots** - distribution shape
- **Heatmaps** - 2D data correlation
- **3D scatter** - three-dimensional points
- **Surface plots** - 3D mathematical functions

## Contributing

The modular architecture makes it easy to add new trace types:

1. Create trace builder in `src/traces/{category}/`
2. Add tool decorator in `src/server.py`
3. Test with sample data
4. Update documentation

## Requirements

- **Python 3.10+**
- **MCP Python SDK 1.2.0+**
- **Plotly 5.0+**
- **Modern browser** for viewing charts

---

*Phase 1 Complete - 5/49 trace types implemented*
*Ready for Phase 2: Statistical & 3D visualization*

**Built with ❤️ for the Claude ecosystem**
