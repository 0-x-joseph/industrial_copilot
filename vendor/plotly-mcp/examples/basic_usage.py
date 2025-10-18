#!/usr/bin/env python3
"""
Basic Usage Examples for Plotly MCP Server
Demonstrates the 5 basic trace types in Phase 1
"""

import asyncio
import sys
import os

# Add src to path for imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

from traces.basic.scatter import create_scatter_trace
from traces.basic.bar import create_bar_trace
from traces.basic.line import create_line_trace
from traces.basic.pie import create_pie_trace
from traces.basic.histogram import create_histogram_trace

async def demo_scatter_plot():
    """Demo scatter plot creation"""
    print("Creating scatter plot...")
    
    x_data = [1, 2, 3, 4, 5]
    y_data = [2, 5, 3, 8, 7]
    
    html = await create_scatter_trace(
        x_data=x_data,
        y_data=y_data,
        colors="red",
        sizes=15,
        name="Sample Data"
    )
    
    # Save to file
    with open("scatter_demo.html", "w") as f:
        f.write(html)
    
    print("✓ Scatter plot saved to scatter_demo.html")

async def demo_bar_chart():
    """Demo bar chart creation"""
    print("Creating bar chart...")
    
    categories = ["A", "B", "C", "D", "E"]
    values = [23, 45, 56, 78, 32]
    
    html = await create_bar_trace(
        x_data=categories,
        y_data=values,
        colors="blue",
        name="Categories"
    )
    
    # Save to file
    with open("bar_demo.html", "w") as f:
        f.write(html)
    
    print("✓ Bar chart saved to bar_demo.html")

async def demo_line_chart():
    """Demo line chart creation"""
    print("Creating line chart...")
    
    x_data = [0, 1, 2, 3, 4, 5]
    y_data = [0, 1, 4, 9, 16, 25]
    
    html = await create_line_trace(
        x_data=x_data,
        y_data=y_data,
        color="green",
        width=3,
        name="Quadratic Function"
    )
    
    # Save to file
    with open("line_demo.html", "w") as f:
        f.write(html)
    
    print("✓ Line chart saved to line_demo.html")

async def demo_pie_chart():
    """Demo pie chart creation"""
    print("Creating pie chart...")
    
    labels = ["Segment A", "Segment B", "Segment C", "Segment D"]
    values = [30, 25, 20, 25]
    
    html = await create_pie_trace(
        labels=labels,
        values=values,
        name="Market Share"
    )
    
    # Save to file
    with open("pie_demo.html", "w") as f:
        f.write(html)
    
    print("✓ Pie chart saved to pie_demo.html")

async def demo_histogram():
    """Demo histogram creation"""
    print("Creating histogram...")
    
    import random
    data = [random.gauss(50, 15) for _ in range(1000)]
    
    html = await create_histogram_trace(
        x_data=data,
        color="purple",
        name="Normal Distribution"
    )
    
    # Save to file
    with open("histogram_demo.html", "w") as f:
        f.write(html)
    
    print("✓ Histogram saved to histogram_demo.html")

async def main():
    """Run all demos"""
    print("Plotly MCP Server - Phase 1 Demos")
    print("=" * 40)
    
    await demo_scatter_plot()
    await demo_bar_chart() 
    await demo_line_chart()
    await demo_pie_chart()
    await demo_histogram()
    
    print("\n✓ All demos completed successfully!")
    print("Check the generated HTML files to view your charts.")

if __name__ == "__main__":
    asyncio.run(main())
