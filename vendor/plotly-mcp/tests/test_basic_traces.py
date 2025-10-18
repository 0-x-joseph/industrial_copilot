#!/usr/bin/env python3
"""
Basic tests for Phase 1 trace builders
"""

import sys
import os
import asyncio

# Add src to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'src'))

async def test_scatter_trace():
    """Test scatter trace creation"""
    try:
        from traces.basic.scatter import create_scatter_trace
        
        html = await create_scatter_trace(
            x_data=[1, 2, 3],
            y_data=[1, 4, 9],
            colors="blue"
        )
        
        assert "<html>" in html
        assert "Plotly" in html
        print("✓ Scatter trace test passed")
        return True
    except Exception as e:
        print(f"✗ Scatter trace test failed: {e}")
        return False

async def test_bar_trace():
    """Test bar trace creation"""
    try:
        from traces.basic.bar import create_bar_trace
        
        html = await create_bar_trace(
            x_data=["A", "B", "C"],
            y_data=[1, 2, 3],
            colors="red"
        )
        
        assert "<html>" in html
        assert "Plotly" in html
        print("✓ Bar trace test passed")
        return True
    except Exception as e:
        print(f"✗ Bar trace test failed: {e}")
        return False

async def test_line_trace():
    """Test line trace creation"""
    try:
        from traces.basic.line import create_line_trace
        
        html = await create_line_trace(
            x_data=[1, 2, 3],
            y_data=[1, 4, 9],
            color="green"
        )
        
        assert "<html>" in html
        assert "Plotly" in html
        print("✓ Line trace test passed")
        return True
    except Exception as e:
        print(f"✗ Line trace test failed: {e}")
        return False

async def test_pie_trace():
    """Test pie trace creation"""
    try:
        from traces.basic.pie import create_pie_trace
        
        html = await create_pie_trace(
            labels=["A", "B", "C"],
            values=[1, 2, 3]
        )
        
        assert "<html>" in html
        assert "Plotly" in html
        print("✓ Pie trace test passed")
        return True
    except Exception as e:
        print(f"✗ Pie trace test failed: {e}")
        return False

async def test_histogram_trace():
    """Test histogram trace creation"""
    try:
        from traces.basic.histogram import create_histogram_trace
        
        html = await create_histogram_trace(
            x_data=[1, 2, 2, 3, 3, 3, 4, 4, 5]
        )
        
        assert "<html>" in html
        assert "Plotly" in html
        print("✓ Histogram trace test passed")
        return True
    except Exception as e:
        print(f"✗ Histogram trace test failed: {e}")
        return False

async def run_all_tests():
    """Run all basic trace tests"""
    print("Running Phase 1 Basic Trace Tests")
    print("=" * 40)
    
    tests = [
        test_scatter_trace(),
        test_bar_trace(),
        test_line_trace(), 
        test_pie_trace(),
        test_histogram_trace()
    ]
    
    results = await asyncio.gather(*tests)
    
    passed = sum(results)
    total = len(results)
    
    print(f"\nResults: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed! Phase 1 is ready.")
        return True
    else:
        print("❌ Some tests failed. Check the output above.")
        return False

if __name__ == "__main__":
    success = asyncio.run(run_all_tests())
    sys.exit(0 if success else 1)
