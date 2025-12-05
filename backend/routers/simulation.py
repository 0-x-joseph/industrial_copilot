#!/usr/bin/env python3
"""
Energy Optimization Platform - Simulation Router
================================================

FastAPI endpoints for real-time energy optimization.

Author: Senior Full Stack Engineer
Date: December 2025
"""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Any
from datetime import datetime
import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.optimizer import EnergyOptimizer, load_sulfur_data
from core.config import FINANCIAL, PHYSICS, SYSTEM
from core.streamer import get_streamer

# Initialize router
router = APIRouter(prefix="/api", tags=["optimization"])

# Initialize optimizer (loaded once at startup)
sulfur_data = load_sulfur_data()
optimizer = EnergyOptimizer(sulfur_recovery_data=sulfur_data)


# ==================== REQUEST/RESPONSE MODELS ====================

class OptimizationRequest(BaseModel):
    """Request model for optimization endpoint"""
    
    elec_demand: float = Field(
        ..., 
        description="Electrical power demand in MW",
        ge=0,
        le=150,
        example=60.0
    )
    
    steam_demand: float = Field(
        ..., 
        description="MP steam demand in T/hr",
        ge=0,
        le=600,
        example=400.0
    )
    
    constraints: Optional[Dict[str, Any]] = Field(
        default=None,
        description="Business constraints dictionary",
        example={
            "gta2_status": "MAINTENANCE",
            "cap_steam": 420
        }
    )
    
    hour: Optional[int] = Field(
        default=None,
        description="Hour of day (0-23) for grid pricing. If None, uses current time",
        ge=0,
        le=23,
        example=14
    )
    
    verbose: bool = Field(
        default=False,
        description="Print detailed optimization log"
    )


class GTAResult(BaseModel):
    """GTA operation result"""
    gta_number: int
    admission: float = Field(description="HP steam admission (T/hr)")
    soutirage: float = Field(description="MP steam extraction (T/hr)")
    power: float = Field(description="Electrical power output (MW)")


class CostBreakdown(BaseModel):
    """Detailed cost breakdown"""
    grid: float = Field(description="Grid import cost (DH/hr)")
    boiler: float = Field(description="Boiler operation cost (DH/hr)")
    sulfur: float = Field(description="Sulfur recovery cost (DH/hr)")
    gta_fuel: float = Field(description="GTA fuel cost (DH/hr)")


class OperationalRecommendation(BaseModel):
    """Structured operational command with safety checks"""
    icon: str
    title: str
    instruction: str
    safety_check: Optional[str] = None
    impact: str
    priority: str  # high, medium, low


class BaselineComparison(BaseModel):
    """Baseline scenario for comparison"""
    grid_import: float = Field(description="Baseline grid import (MW)")
    boiler_output: float = Field(description="Baseline boiler output (T/hr)")
    gta_load_percent: float = Field(description="Baseline GTA load (%)")


class OptimizationResponse(BaseModel):
    """Response model for optimization endpoint"""
    
    status: str = Field(description="Solver status (Optimal, Infeasible, etc.)")
    gtas: List[GTAResult] = Field(description="GTA operations")
    grid_import: float = Field(description="Grid electricity import (MW)")
    boiler_output: float = Field(description="Auxiliary boiler steam output (T/hr)")
    sulfur_steam: float = Field(description="Recovered steam from sulfuric acid (T/hr)")
    total_cost: float = Field(description="Total operating cost (DH/hr)")
    cost_breakdown: CostBreakdown = Field(description="Detailed cost breakdown")
    baseline_cost: float = Field(description="Cost with naive strategy (DH/hr)")
    baseline: BaselineComparison = Field(description="Baseline scenario details")
    savings: float = Field(description="Cost savings vs baseline (DH/hr)")
    recommendations: List[OperationalRecommendation] = Field(description="Structured operational commands with safety checks")
    demands: Dict[str, float] = Field(description="Input demands")
    constraints_applied: Dict[str, Any] = Field(description="Applied constraints")
    timestamp: str = Field(description="Optimization timestamp")


class SystemInfoResponse(BaseModel):
    """System configuration information"""
    
    financial_constants: Dict[str, float]
    physics_coefficients: Dict[str, Any]
    system_constraints: Dict[str, float]
    gta_models: List[Dict[str, Any]]


# ==================== ENDPOINTS ====================

@router.post("/optimize", response_model=OptimizationResponse)
async def optimize_dispatch(request: OptimizationRequest):
    """
    🔧 Main optimization endpoint
    
    Solves the energy dispatch problem to minimize operating cost while
    meeting electricity and steam demands with optional business constraints.
    
    **Example Business Constraints:**
    - `{"gta2_status": "OFF"}` - Take GTA 2 offline
    - `{"gta2_status": "MAINTENANCE"}` - Run GTA 2 at 50% capacity
    - `{"cap_steam": 420}` - Client CAP requires 420 T/hr minimum steam
    - `{"max_grid_import": 30}` - Limit grid import to 30 MW
    
    **Returns:**
    - Optimal GTA operations (admission, soutirage, power)
    - Grid import and boiler usage
    - Total cost and savings vs baseline
    - Detailed cost breakdown
    """
    
    try:
        # Run optimization
        result = optimizer.optimize(
            elec_demand=request.elec_demand,
            steam_demand=request.steam_demand,
            constraints=request.constraints,
            hour=request.hour,
            verbose=request.verbose
        )
        
        # Check if solution is optimal
        if result['status'] != 'Optimal':
            raise HTTPException(
                status_code=400,
                detail=f"No optimal solution found. Status: {result['status']}"
            )
        
        # Format response
        response = OptimizationResponse(
            status=result['status'],
            gtas=[GTAResult(**gta) for gta in result['gtas']],
            grid_import=result['grid_import'],
            boiler_output=result['boiler_output'],
            sulfur_steam=result['sulfur_steam'],
            total_cost=result['total_cost'],
            cost_breakdown=CostBreakdown(**result['cost_breakdown']),
            baseline_cost=result['baseline_cost'],
            baseline=BaselineComparison(**result['baseline']),
            savings=result['savings'],
            recommendations=[OperationalRecommendation(**rec) for rec in result['recommendations']],
            demands=result['demands'],
            constraints_applied=result['constraints_applied'],
            timestamp=datetime.now().isoformat()
        )
        
        return response
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Optimization error: {str(e)}"
        )


@router.get("/system-info", response_model=SystemInfoResponse)
async def get_system_info():
    """
    📋 Get system configuration and constraints
    
    Returns financial constants, physics coefficients, and system limits.
    Useful for frontend to display available options and validate inputs.
    """
    
    response = SystemInfoResponse(
        financial_constants={
            "grid_peak_cost": FINANCIAL.GRID_PEAK_COST,
            "grid_off_peak_cost": FINANCIAL.GRID_OFF_PEAK_COST,
            "boiler_cost": FINANCIAL.BOILER_COST,
            "sulfuric_heat_cost": FINANCIAL.SULFURIC_HEAT_COST,
            "gta_fuel_cost": FINANCIAL.GTA_FUEL_COST,
            "peak_hours_start": FINANCIAL.PEAK_HOURS_START,
            "peak_hours_end": FINANCIAL.PEAK_HOURS_END
        },
        physics_coefficients={
            "gta1": PHYSICS.get_gta_coefficients(1),
            "gta2": PHYSICS.get_gta_coefficients(2),
            "gta3": PHYSICS.get_gta_coefficients(3),
            "max_admission": PHYSICS.MAX_ADMISSION,
            "min_admission": PHYSICS.MIN_ADMISSION
        },
        system_constraints={
            "max_total_steam_production": SYSTEM.MAX_TOTAL_STEAM_PRODUCTION,
            "max_total_power_production": SYSTEM.MAX_TOTAL_POWER_PRODUCTION,
            "max_grid_import": SYSTEM.MAX_GRID_IMPORT,
            "max_boiler_capacity": SYSTEM.MAX_BOILER_CAPACITY,
            "steam_safety_margin": SYSTEM.STEAM_SAFETY_MARGIN,
            "power_safety_margin": SYSTEM.POWER_SAFETY_MARGIN
        },
        gta_models=[
            {
                "gta_number": i,
                "formula": f"P_elec = {PHYSICS.get_gta_coefficients(i)['coef_a']:.4f}*A + {PHYSICS.get_gta_coefficients(i)['coef_s']:.4f}*S + {PHYSICS.get_gta_coefficients(i)['intercept']:.2f}"
            }
            for i in [1, 2, 3]
        ]
    )
    
    return response


@router.get("/health")
async def health_check():
    """
    ❤️ Health check endpoint
    
    Returns server status and optimizer readiness.
    """
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "optimizer_ready": optimizer is not None,
        "sulfur_data_loaded": optimizer.sulfur_data is not None if optimizer else False
    }


@router.get("/scenarios")
async def get_scenarios():
    """
    📚 Get pre-defined optimization scenarios for testing
    
    Returns common business scenarios that can be used as examples.
    """
    
    scenarios = [
        {
            "name": "Normal Operation",
            "description": "Typical daytime operation with all GTAs available",
            "params": {
                "elec_demand": 60.0,
                "steam_demand": 400.0,
                "constraints": {},
                "hour": 14
            }
        },
        {
            "name": "GTA 2 Maintenance",
            "description": "GTA 2 is under maintenance, running at reduced capacity",
            "params": {
                "elec_demand": 60.0,
                "steam_demand": 400.0,
                "constraints": {"gta2_status": "MAINTENANCE"},
                "hour": 14
            }
        },
        {
            "name": "GTA 3 Offline",
            "description": "GTA 3 is completely offline for repairs",
            "params": {
                "elec_demand": 55.0,
                "steam_demand": 380.0,
                "constraints": {"gta3_status": "OFF"},
                "hour": 10
            }
        },
        {
            "name": "Peak Hours High Demand",
            "description": "High demand during expensive peak hours (17h-22h)",
            "params": {
                "elec_demand": 70.0,
                "steam_demand": 450.0,
                "constraints": {},
                "hour": 19
            }
        },
        {
            "name": "Client CAP High Steam",
            "description": "Client CAP requires minimum 460 T/hr steam",
            "params": {
                "elec_demand": 65.0,
                "steam_demand": 450.0,
                "constraints": {"cap_steam": 460},
                "hour": 15
            }
        },
        {
            "name": "Night Operation",
            "description": "Low demand during night with off-peak pricing",
            "params": {
                "elec_demand": 40.0,
                "steam_demand": 300.0,
                "constraints": {},
                "hour": 2
            }
        }
    ]
    
    return {"scenarios": scenarios}


# ==================== LIVE MONITORING ENDPOINT ====================

@router.get("/live")
def get_live_state():
    """
    Get current live plant state from streaming data
    
    Returns real-time metrics including:
    - GTA operations (power, admission, soutirage)
    - Sulfur flows and free steam
    - MP steam pressure with alerts
    - Estimated grid import and boiler usage
    - Cost per hour, CO2 emissions
    - System efficiency
    
    Returns:
        Live plant state dictionary
    """
    try:
        streamer = get_streamer()
        state = streamer.get_current_state()
        
        return {
            "success": True,
            "data": state
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching live state: {str(e)}"
        )


# ==================== WEBSOCKET (Optional for Real-Time) ====================

# TODO: Add WebSocket endpoint for real-time monitoring if needed
# from fastapi import WebSocket
# 
# @router.websocket("/ws/optimize")
# async def websocket_optimize(websocket: WebSocket):
#     """Real-time optimization updates via WebSocket"""
#     await websocket.accept()
#     # Implementation for streaming updates
