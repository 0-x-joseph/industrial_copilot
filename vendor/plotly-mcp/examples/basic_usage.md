# Basic Usage Examples - Phase 1

## Testing in Cursor

Once you have the MCP server configured in Cursor, you can use natural language to create charts:

### Scatter Plots
```
"Create a scatter plot with x values [1,2,3,4,5] and y values [2,4,1,5,3] using red markers"
```

### Bar Charts  
```
"Make a bar chart showing sales data: categories A,B,C,D with values 20,14,23,25"
```

### Line Charts
```
"Draw a line chart connecting points (1,2), (2,4), (3,1), (4,5), (5,3) with a green line"
```

### Pie Charts
```
"Create a pie chart for fruit preferences: Apple 30%, Orange 25%, Banana 45%"
```

### Histograms
```
"Generate a histogram from this data: [1,2,2,3,3,3,4,4,5] with purple bars"
```

### Sample Data Generation
```
"Generate 50 points of sine wave data with some noise for testing"
```

## Direct Tool Calls

You can also call the tools directly:

### Scatter Plot with Customization
```python
create_scatter_plot(
    x_data=[1, 2, 3, 4, 5, 6],
    y_data=[1, 4, 2, 5, 3, 6],
    colors="rgba(255,0,0,0.7)",
    sizes=15,
    mode="markers+lines",
    name="Custom Scatter",
    hover_template="X: %{x}<br>Y: %{y}<br>Point: %{pointNumber}"
)
```

### Horizontal Bar Chart
```python
create_bar_chart(
    x_data=["Q1", "Q2", "Q3", "Q4"],
    y_data=[100, 120, 140, 110],
    colors="#3498db",
    orientation="h",
    text=["100K", "120K", "140K", "110K"],
    name="Quarterly Revenue"
)
```

### Donut Chart
```python
create_pie_chart(
    labels=["Desktop", "Mobile", "Tablet"],
    values=[60, 30, 10],
    hole=0.4,
    colors=["#e74c3c", "#2ecc71", "#f39c12"],
    textinfo="label+percent",
    name="Device Usage"
)
```

### Normalized Histogram
```python
create_histogram(
    x_data=[1.2, 1.4, 1.8, 2.1, 2.3, 2.8, 3.1, 3.4, 3.9, 4.2],
    nbins=5,
    color="#9c88ff",
    histnorm="probability",
    name="Distribution"
)
```

## Testing Your Setup

1. **Start the server**:
   ```bash
   cd src && python server.py
   ```

2. **Run tests**:
   ```bash
   python test_phase1.py
   ```

3. **Check Cursor integration**:
   - Add the MCP config to Cursor
   - Restart Cursor
   - Look for the 🔌 plug icon in the chat
   - Try: "Create a simple scatter plot to test the connection"

## Common Issues

### Server Not Starting
- Check Python version (3.10+ required)
- Install dependencies: `pip install -r requirements.txt`
- Verify all trace modules are in the correct directories

### Cursor Not Connecting
- Use absolute paths in the MCP config
- Check Cursor logs: `~/Library/Logs/Claude/mcp*.log`
- Restart Cursor completely after config changes

### Charts Not Rendering
- Verify HTML output contains Plotly.js
- Check browser console for JavaScript errors
- Ensure data types match expected formats

## Next Steps

Once Phase 1 is working, you're ready for:
- **Phase 2**: Statistical charts (box plots, heatmaps, 3D)
- **Phase 3**: Geographic and financial charts
- **Phase 4**: Specialized traces and complete layout system
- **Phase 5**: Professional theming
- **Phase 6**: Natural language interface
