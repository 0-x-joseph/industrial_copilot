#!/usr/bin/env python3
"""
Test script for Phase 1 Plotly MCP Server
Validates all 5 basic trace types work correctly
"""

import asyncio
import sys
import os

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from traces.basic.scatter import create_scatter_trace
from traces.basic.bar import create_bar_trace
from traces.basic.line import create_line_trace
from traces.basic.pie import create_pie_trace
from traces.basic.histogram import create_histogram_trace

async def test_scatter_plot():
    """Test scatter plot creation"""
    print("Testing scatter plot...")
    try:
        result = await create_scatter_trace(
            x_data=[1, 2, 3, 4, 5],
            y_data=[2, 4, 1, 5, 3],
            colors="red",
            sizes=10,
            name="Test Scatter"
        )
        assert "<html>" in result
        assert "plotly" in result.lower()
        print("✅ Scatter plot test passed")
        return True
    except Exception as e:
        print(f"❌ Scatter plot test failed: {e}")
        return False

async def test_bar_chart():
    """Test bar chart creation"""
    print("Testing bar chart...")
    try:
        result = await create_bar_trace(
            x_data=["A", "B", "C", "D"],
            y_data=[20, 14, 23, 25],
            colors="blue",
            name="Test Bar"
        )
        assert "<html>" in result
        assert "plotly" in result.lower()
        print("✅ Bar chart test passed")
        return True
    except Exception as e:
        print(f"❌ Bar chart test failed: {e}")
        return False

async def test_line_chart():
    """Test line chart creation"""
    print("Testing line chart...")
    try:
        result = await create_line_trace(
            x_data=[1, 2, 3, 4, 5],
            y_data=[1, 4, 2, 5, 3],
            color="green",
            name="Test Line"
        )
        assert "<html>" in result
        assert "plotly" in result.lower()
        print("✅ Line chart test passed")
        return True
    except Exception as e:
        print(f"❌ Line chart test failed: {e}")
        return False

async def test_pie_chart():
    """Test pie chart creation"""
    print("Testing pie chart...")
    try:
        result = await create_pie_trace(
            labels=["Apple", "Orange", "Banana"],
            values=[30, 25, 45],
            name="Test Pie"
        )
        assert "<html>" in result
        assert "plotly" in result.lower()
        print("✅ Pie chart test passed")
        return True
    except Exception as e:
        print(f"❌ Pie chart test failed: {e}")
        return False

async def test_histogram():
    """Test histogram creation"""
    print("Testing histogram...")
    try:
        result = await create_histogram_trace(
            x_data=[1, 2, 2, 3, 3, 3, 4, 4, 5],
            color="purple",
            name="Test Histogram"
        )
        assert "<html>" in result
        assert "plotly" in result.lower()
        print("✅ Histogram test passed")
        return True
    except Exception as e:
        print(f"❌ Histogram test failed: {e}")
        return False

async def run_all_tests():
    """Run all Phase 1 tests"""
    print("🚀 Running Phase 1 Plotly MCP Server Tests\n")
    
    tests = [
        test_scatter_plot,
        test_bar_chart,
        test_line_chart,
        test_pie_chart,
        test_histogram
    ]
    
    passed = 0
    total = len(tests)
    
    for test in tests:
        if await test():
            passed += 1
        print()
    
    print(f"📊 Test Results: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All Phase 1 tests passed! Ready for Cursor integration.")
        return True
    else:
        print(f"⚠️  {total - passed} tests failed. Check the errors above.")
        return False

if __name__ == "__main__":
    success = asyncio.run(run_all_tests())
    sys.exit(0 if success else 1)
