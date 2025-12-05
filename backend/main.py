#!/usr/bin/env python3
"""
Energy Optimization Platform - Main Application
==============================================

FastAPI application entry point for the energy-copilot platform.

Author: Senior Full Stack Engineer
Date: December 2025
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from datetime import datetime
import sys
import os

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from routers.simulation import router as simulation_router
from core.config import print_configuration

# Initialize FastAPI app
app = FastAPI(
    title="Energy Copilot API",
    description="Real-Time Energy Optimization Platform for Chemical Plant",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Configuration - Allow Next.js frontend (local + production)
# Get allowed origins from environment variable or use defaults
def get_cors_origins():
    """Get CORS origins from environment or use defaults"""
    env_origins = os.environ.get("ALLOWED_ORIGINS", "")
    
    # Default origins (always include localhost for development)
    default_origins = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
    ]
    
    # Add environment-specified origins
    if env_origins:
        extra_origins = [o.strip() for o in env_origins.split(",") if o.strip()]
        default_origins.extend(extra_origins)
    
    # Also allow any Vercel preview deployments
    return default_origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_cors_origins(),
    allow_origin_regex=r"https://.*\.vercel\.app",  # Allow all Vercel preview URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(simulation_router)


# ==================== ROOT ENDPOINTS ====================

@app.get("/")
async def root():
    """Root endpoint - API information"""
    return {
        "name": "Energy Copilot API",
        "version": "1.0.0",
        "description": "Real-Time Energy Optimization Platform",
        "status": "operational",
        "timestamp": datetime.now().isoformat(),
        "endpoints": {
            "optimization": "/api/optimize",
            "system_info": "/api/system-info",
            "scenarios": "/api/scenarios",
            "health": "/api/health",
            "docs": "/docs"
        }
    }


@app.get("/api")
async def api_root():
    """API root endpoint"""
    return {
        "message": "Energy Copilot API",
        "version": "1.0.0",
        "endpoints": [
            "POST /api/optimize - Run optimization",
            "GET /api/system-info - Get system configuration",
            "GET /api/scenarios - Get pre-defined scenarios",
            "GET /api/health - Health check"
        ]
    }


# ==================== STARTUP/SHUTDOWN EVENTS ====================

@app.on_event("startup")
async def startup_event():
    """Application startup tasks"""
    print("\n" + "=" * 70)
    print("🚀 ENERGY COPILOT API - STARTING UP")
    print("=" * 70)
    print(f"⏰ Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"📡 CORS Enabled: localhost:3000, localhost:3001")
    print("\n📋 Loading system configuration...")
    print_configuration()
    print("✅ Application startup complete!")
    print("=" * 70 + "\n")


@app.on_event("shutdown")
async def shutdown_event():
    """Application shutdown tasks"""
    print("\n" + "=" * 70)
    print("🛑 ENERGY COPILOT API - SHUTTING DOWN")
    print("=" * 70)
    print(f"⏰ Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("👋 Goodbye!")
    print("=" * 70 + "\n")


# ==================== ERROR HANDLERS ====================

@app.exception_handler(404)
async def not_found_handler(request, exc):
    """Custom 404 handler"""
    return JSONResponse(
        status_code=404,
        content={
            "error": "Not Found",
            "message": f"Endpoint {request.url.path} not found",
            "available_endpoints": [
                "/",
                "/api",
                "/api/optimize",
                "/api/system-info",
                "/api/scenarios",
                "/api/health",
                "/docs"
            ]
        }
    )


@app.exception_handler(500)
async def internal_error_handler(request, exc):
    """Custom 500 handler"""
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "message": "An unexpected error occurred. Check server logs."
        }
    )


# ==================== MAIN ====================

if __name__ == "__main__":
    """Run the application"""
    print("\n🔧 Starting Energy Copilot API Server...")
    print("📖 API Documentation: http://localhost:8000/docs")
    print("🔄 Auto-reload: Enabled\n")
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
