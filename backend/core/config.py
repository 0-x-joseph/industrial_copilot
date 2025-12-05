#!/usr/bin/env python3
"""
Energy Optimization Platform - Configuration Module
===================================================

Financial constants and physics coefficients for the chemical plant
energy optimization system.

Author: Senior Full Stack Engineer
Date: December 2025
"""

from typing import Dict, Any
from dataclasses import dataclass

@dataclass
class FinancialConstants:
    """
    Financial parameters for cost calculations (in DH - Moroccan Dirham)
    Source: ONE Tariff & Internal Audit
    """
    
    # Grid Import Costs (DH/kWh) - ONE Tariff
    GRID_PEAK_COST = 1.271         # 17:00-22:00 (Peak hours - AVOID)
    GRID_STANDARD_COST = 0.897     # 07:00-17:00 (Standard hours)
    GRID_OFF_PEAK_COST = 0.552     # 22:00-07:00 (Off-peak - Preferred)
    
    # Steam Production Costs (DH/Ton)
    BOILER_COST = 284.0            # Auxiliary Boiler (Fuel Oil) - Expensive, AVOID
    SULFURIC_HEAT_COST = 20.0      # Sulfur Heat Recovery - Base Load / Free
    
    # GTA Operation Costs (estimated, DH/kWh generated)
    GTA_FUEL_COST = 0.65           # Gas turbine fuel cost
    
    # Time periods definition
    PEAK_HOURS_START = 17          # 17:00
    PEAK_HOURS_END = 22            # 22:00
    STANDARD_HOURS_START = 7       # 07:00
    STANDARD_HOURS_END = 17        # 17:00


@dataclass
class PhysicsCoefficients:
    """
    Hardcoded ML coefficients from trained Linear Regression models
    Source: GTA Technical Sheet - Annexe 3
    
    Formula for each GTA:
    P_elec = coef_A * Admission - coef_S * Soutirage + intercept
    
    Where:
    - Admission (A): HP Steam admission to turbine (Tons/hr), Range: 0-190
    - Soutirage (S): MP Steam extraction (Tons/hr), Range: 0-100, Constraint: S <= A
    - P_elec: Electrical power output (MW), Range: 10-37 (if ON)
    """
    
    # GTA 1 Coefficients
    GTA1_COEF_A = 0.2761
    GTA1_COEF_S = -0.1805
    GTA1_INTERCEPT = -2.72
    
    # GTA 2 Coefficients
    GTA2_COEF_A = 0.2560
    GTA2_COEF_S = -0.1782
    GTA2_INTERCEPT = -0.02
    
    # GTA 3 Coefficients
    GTA3_COEF_A = 0.2573
    GTA3_COEF_S = -0.1723
    GTA3_INTERCEPT = 0.06
    
    # Physical Constraints (per GTA - from Technical Sheet)
    MAX_ADMISSION = 190.0          # Maximum HP admission per GTA (T/hr)
    MAX_SOUTIRAGE = 100.0          # Maximum MP steam extraction per GTA (T/hr)
    MAX_EXHAUST = 90.0             # Maximum exhaust flow per GTA (T/hr)
    MAX_POWER_PER_GTA = 37.0       # Maximum electrical power per GTA (MW)
    MIN_POWER_PER_GTA = 10.0       # Minimum power if GTA is ON (MW)
    MIN_ADMISSION = 0.0            # Minimum HP admission (T/hr)
    MIN_SOUTIRAGE = 0.0            # Minimum MP steam extraction (T/hr)
    
    @staticmethod
    def get_gta_coefficients(gta_number: int) -> Dict[str, float]:
        """
        Get coefficients for a specific GTA
        
        Args:
            gta_number: GTA identifier (1, 2, or 3)
            
        Returns:
            Dictionary with 'coef_a', 'coef_s', 'intercept' keys
        """
        coefficients = {
            1: {
                'coef_a': PhysicsCoefficients.GTA1_COEF_A,
                'coef_s': PhysicsCoefficients.GTA1_COEF_S,
                'intercept': PhysicsCoefficients.GTA1_INTERCEPT
            },
            2: {
                'coef_a': PhysicsCoefficients.GTA2_COEF_A,
                'coef_s': PhysicsCoefficients.GTA2_COEF_S,
                'intercept': PhysicsCoefficients.GTA2_INTERCEPT
            },
            3: {
                'coef_a': PhysicsCoefficients.GTA3_COEF_A,
                'coef_s': PhysicsCoefficients.GTA3_COEF_S,
                'intercept': PhysicsCoefficients.GTA3_INTERCEPT
            }
        }
        return coefficients.get(gta_number, coefficients[1])


@dataclass
class SystemConstraints:
    """
    Default system-wide constraints
    Source: Plant Technical Documentation & Substation Limits
    """
    
    # Total plant capacity limits
    MAX_TOTAL_STEAM_PRODUCTION = 600.0    # Total MP steam capacity (T/hr)
    MAX_TOTAL_POWER_PRODUCTION = 111.0    # Total electrical capacity: 3x37MW (MW)
    MAX_GRID_IMPORT = 100.0               # Maximum grid import - Substation limit (MW)
    MAX_BOILER_CAPACITY = 200.0           # Maximum boiler capacity (T/hr)
    
    # Safety margins
    STEAM_SAFETY_MARGIN = 1.05            # 5% safety margin on steam demand
    POWER_SAFETY_MARGIN = 1.03            # 3% safety margin on power demand


# Global instances for easy access
FINANCIAL = FinancialConstants()
PHYSICS = PhysicsCoefficients()
SYSTEM = SystemConstraints()


def get_grid_cost(hour: int = None) -> float:
    """
    Get current grid electricity cost based on time of day (ONE Tariff)
    
    Args:
        hour: Hour of day (0-23). If None, uses current time
        
    Returns:
        Grid cost in DH/kWh
        - Peak (17:00-22:00): 1.271 DH/kWh
        - Standard (07:00-17:00): 0.897 DH/kWh
        - Off-Peak (22:00-07:00): 0.552 DH/kWh
    """
    if hour is None:
        from datetime import datetime
        hour = datetime.now().hour
    
    # Peak hours: 17:00 - 22:00
    if FINANCIAL.PEAK_HOURS_START <= hour < FINANCIAL.PEAK_HOURS_END:
        return FINANCIAL.GRID_PEAK_COST
    # Standard hours: 07:00 - 17:00
    elif FINANCIAL.STANDARD_HOURS_START <= hour < FINANCIAL.STANDARD_HOURS_END:
        return FINANCIAL.GRID_STANDARD_COST
    # Off-peak hours: 22:00 - 07:00
    else:
        return FINANCIAL.GRID_OFF_PEAK_COST


def print_configuration():
    """Print current configuration for debugging"""
    print("=" * 60)
    print("Energy Optimization Platform - Configuration")
    print("=" * 60)
    print("\n💰 FINANCIAL CONSTANTS:")
    print(f"  Grid Peak Cost:      {FINANCIAL.GRID_PEAK_COST} DH/kWh (17:00-22:00)")
    print(f"  Grid Standard Cost:  {FINANCIAL.GRID_STANDARD_COST} DH/kWh (07:00-17:00)")
    print(f"  Grid Off-Peak Cost:  {FINANCIAL.GRID_OFF_PEAK_COST} DH/kWh (22:00-07:00)")
    print(f"  Boiler Cost:         {FINANCIAL.BOILER_COST} DH/Ton")
    print(f"  Sulfuric Heat Cost:  {FINANCIAL.SULFURIC_HEAT_COST} DH/Ton")
    
    print("\n⚙️  PHYSICS COEFFICIENTS:")
    for gta in [1, 2, 3]:
        coef = PHYSICS.get_gta_coefficients(gta)
        print(f"  GTA {gta}: P_elec = {coef['coef_a']:.4f}*A + {coef['coef_s']:.4f}*S + {coef['intercept']:.2f}")
    
    print("\n🔧 SYSTEM CONSTRAINTS:")
    print(f"  Max Total Steam:     {SYSTEM.MAX_TOTAL_STEAM_PRODUCTION} T/hr")
    print(f"  Max Total Power:     {SYSTEM.MAX_TOTAL_POWER_PRODUCTION} MW")
    print(f"  Max Grid Import:     {SYSTEM.MAX_GRID_IMPORT} MW")
    print(f"  Max Boiler Capacity: {SYSTEM.MAX_BOILER_CAPACITY} T/hr")
    print("=" * 60)


if __name__ == "__main__":
    print_configuration()
