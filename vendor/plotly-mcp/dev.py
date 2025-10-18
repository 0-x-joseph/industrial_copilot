#!/usr/bin/env python3
"""
Development helper script for Plotly MCP Server
Provides commands for testing, development, and setup
"""

import subprocess
import sys
import os
from pathlib import Path

def run_command(cmd, description):
    """Run a command and display results"""
    print(f"\n🔄 {description}...")
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ {description} completed successfully")
            if result.stdout:
                print(result.stdout)
        else:
            print(f"❌ {description} failed")
            if result.stderr:
                print(result.stderr)
        return result.returncode == 0
    except Exception as e:
        print(f"❌ Error running {description}: {e}")
        return False

def setup_environment():
    """Setup development environment"""
    print("🚀 Setting up Plotly MCP development environment")
    
    # Check Python version
    print(f"Python version: {sys.version}")
    
    # Install dependencies
    if Path("requirements.txt").exists():
        run_command("pip install -r requirements.txt", "Installing dependencies")
    else:
        print("❌ requirements.txt not found")
        return False
    
    return True

def run_tests():
    """Run all tests"""
    print("🧪 Running Phase 1 tests")
    return run_command("python test_phase1.py", "Running tests")

def start_server():
    """Start the MCP server"""
    print("🌐 Starting MCP server")
    print("Press Ctrl+C to stop")
    try:
        subprocess.run(["python", "src/server.py"])
    except KeyboardInterrupt:
        print("\n🛑 Server stopped")

def validate_structure():
    """Validate project structure"""
    print("📁 Validating project structure")
    
    required_files = [
        "src/server.py",
        "src/traces/basic/scatter.py",
        "src/traces/basic/bar.py",
        "src/traces/basic/line.py",
        "src/traces/basic/pie.py",
        "src/traces/basic/histogram.py",
        "src/layouts/axes.py",
        "src/layouts/styling.py",
        "src/assembly/builder.py",
        "requirements.txt",
        "README.md"
    ]
    
    missing = []
    for file in required_files:
        if not Path(file).exists():
            missing.append(file)
    
    if missing:
        print(f"❌ Missing files: {missing}")
        return False
    else:
        print("✅ All required files present")
        return True

def show_status():
    """Show project status"""
    print("📊 Plotly MCP Server - Phase 1 Status")
    print("=" * 40)
    
    # Basic info
    print(f"Project: Plotly MCP Server")
    print(f"Phase: 1 (Foundation)")
    print(f"Traces implemented: 5/49")
    
    # Check structure
    structure_ok = validate_structure()
    
    # Count trace files
    trace_files = list(Path("src/traces/basic").glob("*.py"))
    trace_count = len([f for f in trace_files if f.name != "__init__.py"])
    
    print(f"\n📈 Implementation Progress:")
    print(f"✅ Basic traces: {trace_count}/5")
    print(f"✅ Layout system: {'Yes' if Path('src/layouts').exists() else 'No'}")
    print(f"✅ Assembly system: {'Yes' if Path('src/assembly').exists() else 'No'}")
    print(f"🚧 Statistical traces: 0/8 (Phase 2)")
    print(f"🚧 3D traces: 0/7 (Phase 2)")
    print(f"📋 Geographic traces: 0/8 (Phase 3)")
    print(f"📋 Financial traces: 0/3 (Phase 3)")
    print(f"📋 Specialized traces: 0/18 (Phase 4)")
    
    print(f"\n🎯 Next Steps:")
    if structure_ok and trace_count == 5:
        print("- Test all Phase 1 traces")
        print("- Configure Cursor integration")
        print("- Begin Phase 2 planning")
    else:
        print("- Complete Phase 1 implementation")
        print("- Fix missing files/structure")
    
    return structure_ok

def main():
    """Main CLI interface"""
    if len(sys.argv) < 2:
        print("🛠️  Plotly MCP Development Helper")
        print("\nUsage: python dev.py <command>")
        print("\nCommands:")
        print("  setup     - Setup development environment")
        print("  test      - Run all tests")
        print("  server    - Start MCP server")
        print("  validate  - Validate project structure")  
        print("  status    - Show project status")
        return
    
    command = sys.argv[1].lower()
    
    if command == "setup":
        setup_environment()
    elif command == "test":
        run_tests()
    elif command == "server":
        start_server()
    elif command == "validate":
        validate_structure()
    elif command == "status":
        show_status()
    else:
        print(f"❌ Unknown command: {command}")
        print("Run 'python dev.py' for help")

if __name__ == "__main__":
    main()
