#!/usr/bin/env python3
"""
Energy Optimization Platform - PuLP Solver Module
=================================================

Real-time constraint-based optimization solver for energy dispatch.
Optimizes 3 GTAs, Grid Import, and Auxiliary Boilers to minimize cost
while meeting steam and electricity demands.

Author: Senior Full Stack Engineer & Operations Research Scientist
Date: December 2025
"""

import pulp
from typing import Dict, List, Optional, Tuple, Any
from datetime import datetime
import pandas as pd
import numpy as np

from .config import (
    FINANCIAL,
    PHYSICS,
    SYSTEM,
    get_grid_cost,
    PhysicsCoefficients
)


class EnergyOptimizer:
    """
    Real-time constraint-based optimization solver
    
    Solves the energy dispatch problem:
    - Minimize: Total operating cost (DH/hr)
    - Subject to: Steam demand, Electricity demand, Business constraints
    - Variables: GTA operations (A, S), Boiler output, Grid import
    """
    
    def __init__(self, sulfur_recovery_data: Optional[pd.DataFrame] = None):
        """
        Initialize the optimizer
        
        Args:
            sulfur_recovery_data: DataFrame with sulfur recovery steam data
                                  If None, will attempt to load from backend/data/
        """
        self.sulfur_data = sulfur_recovery_data
        self.last_solution = None
        
    def calculate_sulfur_steam(self, timestamp: Optional[datetime] = None) -> float:
        """
        Calculate available "free steam" from sulfuric acid heat recovery
        
        Args:
            timestamp: Specific timestamp to query. If None, uses most recent data
            
        Returns:
            Available recovered steam in Tons/hr
        """
        if self.sulfur_data is None:
            # Default fallback if no data available
            return 50.0  # Typical recovery rate
        
        try:
            # Sum the sulfur flow columns (replace "Configure" with 0)
            sulfur_columns = [col for col in self.sulfur_data.columns 
                            if 'soufre' in col.lower() or 'sulfur' in col.lower()]
            
            if timestamp is None:
                # Get most recent row
                row = self.sulfur_data.iloc[-1]
            else:
                # Find row matching timestamp
                row = self.sulfur_data[self.sulfur_data['Date'] == timestamp].iloc[0]
            
            # Sum sulfur flows, handling "Configure" strings
            total_sulfur = 0.0
            for col in sulfur_columns:
                val = row[col]
                if isinstance(val, str) and val.lower() == 'configure':
                    val = 0.0
                total_sulfur += float(val)
            
            return total_sulfur
            
        except Exception as e:
            print(f"⚠️  Warning: Could not calculate sulfur steam: {e}")
            return 50.0  # Fallback
    
    def predict_gta_power(self, admission: float, soutirage: float, gta_number: int) -> float:
        """
        Predict electrical power output using hardcoded ML coefficients
        
        Formula: P_elec = coef_A * admission + coef_S * soutirage + intercept
        
        Args:
            admission: HP steam admission (T/hr)
            soutirage: MP steam extraction (T/hr)
            gta_number: GTA identifier (1, 2, or 3)
            
        Returns:
            Predicted electrical power (MW)
        """
        coef = PHYSICS.get_gta_coefficients(gta_number)
        
        power = (coef['coef_a'] * admission + 
                coef['coef_s'] * soutirage + 
                coef['intercept'])
        
        return max(0, power)  # Power cannot be negative
    
    def _generate_recommendations(
        self, 
        gtas, 
        grid_import, 
        boiler_output, 
        sulfur_steam_used,
        baseline_grid, 
        baseline_boiler, 
        grid_cost, 
        savings,
        elec_demand,
        steam_demand,
        hour
    ) -> list:
        """
        Generate expert operational commands with safety checks and actionable instructions
        
        Returns:
            List of structured recommendation dicts with:
            - icon: Visual indicator
            - title: Command headline
            - instruction: Specific operational action
            - safety_check: Critical safety monitoring requirement (optional)
            - impact: Financial/operational benefit
            - priority: high/medium/low
        """
        recommendations = []
        
        # Determine time period
        if 17 <= (hour or 14) < 22:
            period = "Peak"
            period_icon = "🔴"
            is_peak = True
        elif 7 <= (hour or 14) < 17:
            period = "Standard"
            period_icon = "🟡"
            is_peak = False
        else:
            period = "Off-Peak"
            period_icon = "🟢"
            is_peak = False
        
        # === PRIORITY 1: FINANCIAL IMPACT HEADER ===
        if savings > 100:
            recommendations.append({
                'icon': '💰',
                'title': 'Optimization Savings Identified',
                'instruction': f'Total potential savings: {savings:,.0f} DH/hr ({savings*8760:,.0f} DH/year) vs baseline operation.',
                'impact': f'+{savings:,.0f} DH/hr',
                'priority': 'high'
            })
        
        # === BRANCH 1: MAX EFFICIENCY (Pushing GTAs Hard) ===
        for gta in gtas:
            if gta['power'] > 0.1 and gta['admission'] > 175:
                # High admission - near capacity
                vacuum_warning = "⚠️ Monitor Condenser Vacuum: High flow may degrade vacuum. Ensure Sea Water Pumps are running at full capacity."
                recommendations.append({
                    'icon': '⚙️',
                    'title': f'Push GTA {gta["gta_number"]} to Capacity',
                    'instruction': f'Increase Admission Valve setpoint to {gta["admission"]:.1f} T/h. Ramp slowly over 5 minutes to avoid thermal shock.',
                    'safety_check': vacuum_warning,
                    'impact': f'{gta["power"]:.1f} MW generation',
                    'priority': 'high'
                })
            elif gta['power'] > 0.1 and gta['admission'] > 1:
                # Normal operation
                recommendations.append({
                    'icon': '⚙️',
                    'title': f'Adjust GTA {gta["gta_number"]} Setpoint',
                    'instruction': f'Set Admission to {gta["admission"]:.1f} T/h and Soutirage to {gta["soutirage"]:.1f} T/h. Monitor ramp rate.',
                    'impact': f'{gta["power"]:.1f} MW, {gta["soutirage"]:.1f} T/h steam',
                    'priority': 'medium'
                })
        
        # === BRANCH 2: BOILER KILL (Cost Saving) ===
        if baseline_boiler > 10 and boiler_output < 1:
            boiler_savings = baseline_boiler * FINANCIAL.BOILER_COST
            recommendations.append({
                'icon': '🛑',
                'title': 'Shutdown Auxiliary Boiler',
                'instruction': 'Ramp down Boiler firing rate to 0 over 10 minutes. Switch steam supply to Sulfur Recovery + GTA extraction.',
                'safety_check': '✅ Pressure Watch: Verify MP Header maintains > 8.5 bar on Sulfur steam alone. Install pressure transmitter PT-201 as backup.',
                'impact': f'Saves {boiler_savings:,.0f} DH/hr (284 DH/T fuel avoided)',
                'priority': 'high'
            })
        elif boiler_output > 10:
            # Boiler running - expensive
            boiler_cost = boiler_output * FINANCIAL.BOILER_COST
            recommendations.append({
                'icon': '⚠️',
                'title': 'Expensive Steam Source Active',
                'instruction': f'Auxiliary Boiler running at {boiler_output:.1f} T/h. Consider increasing GTA extraction or sulfur recovery to reduce boiler load.',
                'impact': f'{boiler_cost:,.0f} DH/hr cost (284 DH/T)',
                'priority': 'medium'
            })
        
        # === BRANCH 3: PEAK AVOIDANCE (Grid Cost) ===
        if is_peak and grid_import > 10:
            import_cost = grid_import * grid_cost * 1000
            recommendations.append({
                'icon': '⚡',
                'title': 'Peak Tariff Alert (1.271 DH/kWh)',
                'instruction': f'Maximize internal generation. Current grid import: {grid_import:.1f} MW. If GTAs are maxed out, request load shedding from Downstream Plants (CAP, PTE).',
                'safety_check': '⚠️ Coordination Required: Notify production planning before load reduction.',
                'impact': f'Current import costing {import_cost:,.0f} DH/hr at peak rate',
                'priority': 'high'
            })
        elif is_peak and grid_import < 10:
            recommendations.append({
                'icon': '✅',
                'title': 'Peak Shaving Successful',
                'instruction': f'Grid import minimized to {grid_import:.1f} MW during peak hours. Maintain current GTA loading.',
                'impact': f'Avoiding expensive peak charges',
                'priority': 'low'
            })
        
        # === BRANCH 4: GRID OPTIMIZATION ===
        grid_reduction = baseline_grid - grid_import
        if grid_reduction > 5:
            cost_avoided = grid_reduction * grid_cost * 1000
            recommendations.append({
                'icon': '✅',
                'title': 'Grid Import Optimized',
                'instruction': f'Reduced grid dependency by {grid_reduction:.1f} MW through optimal GTA dispatch.',
                'impact': f'{cost_avoided:,.0f} DH/hr savings',
                'priority': 'medium'
            })
        elif grid_import > 90:
            # Near grid limit
            recommendations.append({
                'icon': '🔴',
                'title': 'Grid Capacity Warning',
                'instruction': f'Grid import at {grid_import:.1f} MW (near {SYSTEM.MAX_GRID_IMPORT} MW substation limit). Increase GTA generation immediately.',
                'safety_check': '⚠️ Risk of circuit breaker trip if exceeded. Contact electrical substation operator.',
                'impact': 'Critical capacity issue',
                'priority': 'high'
            })
        
        # === BRANCH 5: PRESSURE SAFETY ===
        total_steam = sulfur_steam_used + sum(g['soutirage'] for g in gtas) + boiler_output
        steam_ratio = total_steam / steam_demand if steam_demand > 0 else 1
        estimated_pressure = 7 + (steam_ratio * 2)  # Rough estimate
        
        if estimated_pressure < 8.5:
            recommendations.append({
                'icon': '⚠️',
                'title': 'MP Pressure Risk',
                'instruction': f'Predicted MP pressure: {estimated_pressure:.1f} bar (below 8.5 bar minimum). Increase steam production immediately.',
                'safety_check': '🔴 GTA Trip Risk: Low MP pressure may cause turbine protective trip. Monitor PI-150 continuously.',
                'impact': 'Process reliability at risk',
                'priority': 'high'
            })
        elif estimated_pressure > 8.5:
            recommendations.append({
                'icon': '✅',
                'title': 'Process Reliability: Stable',
                'instruction': f'MP Header pressure stable at {estimated_pressure:.1f} bar (above 8.5 bar minimum).',
                'impact': 'Safe operation confirmed',
                'priority': 'low'
            })
        
        # === BRANCH 6: SULFUR RECOVERY UTILIZATION ===
        if sulfur_steam_used > 70:
            recommendations.append({
                'icon': '♻️',
                'title': 'Free Steam Maximized',
                'instruction': f'Utilizing {sulfur_steam_used:.1f} T/h from Sulfur Recovery (essentially free at 20 DH/T). Maintain sulfur plant operations.',
                'impact': 'Base load steam secured',
                'priority': 'low'
            })
        
        # === BRANCH 7: CAPACITY ALERTS ===
        active_gtas = [g for g in gtas if g['power'] > 1]
        if len(active_gtas) == 0:
            recommendations.append({
                'icon': '🔴',
                'title': 'No GTAs Running',
                'instruction': 'Start at least one GTA to enable cogeneration and reduce grid dependency.',
                'safety_check': '⚠️ Startup Procedure: Follow GTA startup checklist. Verify HP steam availability before admission valve opening.',
                'impact': 'Missing cogeneration opportunity',
                'priority': 'high'
            })
        
        total_power = sum(g['power'] for g in gtas) + grid_import
        if elec_demand > SYSTEM.MAX_TOTAL_POWER_PRODUCTION:
            power_deficit = elec_demand - SYSTEM.MAX_TOTAL_POWER_PRODUCTION
            recommendations.append({
                'icon': '🔴',
                'title': 'Demand Exceeds Plant Capacity',
                'instruction': f'Electrical demand {elec_demand:.0f} MW exceeds maximum capacity {SYSTEM.MAX_TOTAL_POWER_PRODUCTION:.0f} MW. Implement load shedding of {power_deficit:.0f} MW.',
                'safety_check': '⚠️ Emergency Protocol: Contact production manager for non-critical load shutdown authorization.',
                'impact': 'Infeasible operation',
                'priority': 'high'
            })
        
        if steam_demand > SYSTEM.MAX_TOTAL_STEAM_PRODUCTION:
            steam_deficit = steam_demand - SYSTEM.MAX_TOTAL_STEAM_PRODUCTION
            recommendations.append({
                'icon': '🔴',
                'title': 'Steam Demand Infeasible',
                'instruction': f'Steam demand {steam_demand:.0f} T/h exceeds plant capacity {SYSTEM.MAX_TOTAL_STEAM_PRODUCTION:.0f} T/h. Reduce demand by {steam_deficit:.0f} T/h.',
                'impact': 'Physical constraint violation',
                'priority': 'high'
            })
        
        # === BRANCH 8: TIME-BASED OPERATIONS ===
        if (hour or 14) >= 22 or (hour or 14) < 7:
            # Off-peak hours - opportunity
            recommendations.append({
                'icon': '🟢',
                'title': 'Off-Peak Advantage Active',
                'instruction': f'Grid electricity at {grid_cost} DH/kWh (cheapest rate). Optimal time for energy-intensive operations.',
                'impact': 'Favorable tariff window',
                'priority': 'low'
            })
        
        return recommendations
    
    def optimize(
        self,
        elec_demand: float,
        steam_demand: float,
        constraints: Optional[Dict[str, Any]] = None,
        hour: Optional[int] = None,
        verbose: bool = True
    ) -> Dict[str, Any]:
        """
        Main optimization function - solves the dispatch problem
        
        Args:
            elec_demand: Electrical demand (MW)
            steam_demand: MP steam demand (T/hr)
            constraints: Dictionary of business constraints (e.g., {'gta2_status': 'OFF'})
            hour: Hour of day for grid pricing (0-23). If None, uses current time
            verbose: Print optimization details
            
        Returns:
            Dictionary containing:
                - 'gtas': List of GTA operations {gta_number, admission, soutirage, power}
                - 'grid_import': Grid electricity import (MW)
                - 'boiler_output': Auxiliary boiler steam (T/hr)
                - 'sulfur_steam': Recovered steam (T/hr)
                - 'total_cost': Total operating cost (DH/hr)
                - 'cost_breakdown': Detailed cost breakdown
                - 'status': Solver status
                - 'baseline_cost': Cost with naive strategy
                - 'savings': Cost savings (DH/hr)
        """
        
        if verbose:
            print("=" * 70)
            print("🔧 ENERGY OPTIMIZATION SOLVER")
            print("=" * 70)
            print(f"⚡ Electricity Demand: {elec_demand:.2f} MW")
            print(f"💨 Steam Demand:      {steam_demand:.2f} T/hr")
        
        # Initialize problem
        prob = pulp.LpProblem("Energy_Dispatch_Optimization", pulp.LpMinimize)
        
        # ==================== DECISION VARIABLES ====================
        
        # GTA Variables (3 turbines)
        A = {}  # Admission HP steam (T/hr)
        S = {}  # Soutirage MP steam (T/hr)
        
        for i in [1, 2, 3]:
            A[i] = pulp.LpVariable(f"Admission_GTA{i}", 
                                   lowBound=PHYSICS.MIN_ADMISSION,
                                   upBound=PHYSICS.MAX_ADMISSION)  # 0-190 T/hr
            S[i] = pulp.LpVariable(f"Soutirage_GTA{i}", 
                                   lowBound=PHYSICS.MIN_SOUTIRAGE,
                                   upBound=PHYSICS.MAX_SOUTIRAGE)  # 0-100 T/hr
        
        # Auxiliary systems
        F_boiler = pulp.LpVariable("Boiler_Steam", 
                                   lowBound=0,
                                   upBound=SYSTEM.MAX_BOILER_CAPACITY)
        
        E_grid = pulp.LpVariable("Grid_Import", 
                                lowBound=0,
                                upBound=SYSTEM.MAX_GRID_IMPORT)
        
        # Sulfur recovery (variable, constrained by availability)
        max_sulfur = self.calculate_sulfur_steam()  # Get available sulfur steam
        F_sulfur = pulp.LpVariable("Sulfur_Steam",
                                   lowBound=0,
                                   upBound=max_sulfur)
        
        # ==================== PHYSICS CONSTRAINTS ====================
        
        # Constraint: Soutirage cannot exceed Admission for each GTA
        for i in [1, 2, 3]:
            prob += S[i] <= A[i], f"Soutirage_Limit_GTA{i}"
        
        # ==================== DEMAND CONSTRAINTS ====================
        
        # Electrical power from GTAs (using linear approximation)
        # P_elec = coef_a * A + coef_s * S + intercept
        total_gta_power = 0
        for i in [1, 2, 3]:
            coef = PHYSICS.get_gta_coefficients(i)
            gta_power = (coef['coef_a'] * A[i] + 
                        coef['coef_s'] * S[i] + 
                        coef['intercept'])
            total_gta_power += gta_power
        
        # Meet electricity demand
        prob += (total_gta_power + E_grid >= 
                elec_demand * SYSTEM.POWER_SAFETY_MARGIN), "Electricity_Demand"
        
        # Meet steam demand
        total_steam = sum(S[i] for i in [1, 2, 3]) + F_boiler + F_sulfur
        prob += (total_steam >= 
                steam_demand * SYSTEM.STEAM_SAFETY_MARGIN), "Steam_Demand"
        
        # ==================== BUSINESS CONSTRAINTS ====================
        
        if constraints:
            if verbose:
                print("\n📋 Applying Business Constraints:")
            
            for key, value in constraints.items():
                if verbose:
                    print(f"   • {key}: {value}")
                
                # GTA Status Constraints
                if key == 'gta1_status' and value.upper() == 'OFF':
                    prob += A[1] == 0, "GTA1_Offline"
                    prob += S[1] == 0, "GTA1_Offline_Steam"
                    
                elif key == 'gta2_status' and value.upper() == 'OFF':
                    prob += A[2] == 0, "GTA2_Offline"
                    prob += S[2] == 0, "GTA2_Offline_Steam"
                    
                elif key == 'gta3_status' and value.upper() == 'OFF':
                    prob += A[3] == 0, "GTA3_Offline"
                    prob += S[3] == 0, "GTA3_Offline_Steam"
                
                # Maintenance Mode (50% capacity)
                elif key == 'gta1_status' and value.upper() == 'MAINTENANCE':
                    prob += A[1] <= PHYSICS.MAX_ADMISSION * 0.5, "GTA1_Maintenance"
                    
                elif key == 'gta2_status' and value.upper() == 'MAINTENANCE':
                    prob += A[2] <= PHYSICS.MAX_ADMISSION * 0.5, "GTA2_Maintenance"
                    
                elif key == 'gta3_status' and value.upper() == 'MAINTENANCE':
                    prob += A[3] <= PHYSICS.MAX_ADMISSION * 0.5, "GTA3_Maintenance"
                
                # Client-specific steam requirements
                elif key == 'cap_steam':
                    # Client CAP needs minimum steam
                    prob += total_steam >= float(value), "Client_CAP_Steam"
                
                elif key == 'min_gta_count':
                    # Minimum number of GTAs running
                    # This requires binary variables (more complex)
                    pass
                
                elif key == 'max_grid_import':
                    # Override default grid limit
                    prob += E_grid <= float(value), "Max_Grid_Import_Override"
                
                elif key == 'sulfur_max':
                    # Limit sulfur recovery (e.g., sulfur plant offline or low capacity)
                    prob += F_sulfur <= float(value), "Sulfur_Recovery_Limit"
        
        # ==================== OBJECTIVE FUNCTION ====================
        
        # Get current grid cost
        grid_cost = get_grid_cost(hour)
        
        # Cost components (DH/hr)
        cost_grid = E_grid * grid_cost * 1000  # Convert MW to kW
        cost_boiler = F_boiler * FINANCIAL.BOILER_COST
        cost_sulfur = F_sulfur * FINANCIAL.SULFURIC_HEAT_COST
        
        # GTA fuel costs (estimated based on admission)
        cost_gta = sum(A[i] * FINANCIAL.GTA_FUEL_COST * 100 for i in [1, 2, 3])
        
        # Total cost to minimize
        total_cost = cost_grid + cost_boiler + cost_sulfur + cost_gta
        
        prob += total_cost, "Total_Operating_Cost"
        
        # ==================== SOLVE ====================
        
        if verbose:
            print("\n🔄 Solving optimization problem...")
        
        # Use CBC solver (open-source)
        solver = pulp.PULP_CBC_CMD(msg=0)  # msg=0 suppresses solver output
        prob.solve(solver)
        
        status = pulp.LpStatus[prob.status]
        
        if verbose:
            print(f"✅ Status: {status}")
        
        # ==================== EXTRACT RESULTS ====================
        
        if status != "Optimal":
            return {
                'status': status,
                'error': 'No optimal solution found',
                'gtas': [],
                'grid_import': 0,
                'boiler_output': 0,
                'sulfur_steam': max_sulfur,
                'total_cost': float('inf'),
                'cost_breakdown': {},
                'baseline_cost': 0,
                'savings': 0
            }
        
        # Extract GTA results
        gtas = []
        for i in [1, 2, 3]:
            admission = pulp.value(A[i])
            soutirage = pulp.value(S[i])
            power = self.predict_gta_power(admission, soutirage, i)
            
            gtas.append({
                'gta_number': i,
                'admission': round(admission, 2),
                'soutirage': round(soutirage, 2),
                'power': round(power, 2)
            })
        
        grid_import = pulp.value(E_grid)
        boiler_output = pulp.value(F_boiler)
        sulfur_steam_used = pulp.value(F_sulfur)
        
        # Calculate actual costs
        actual_cost_grid = grid_import * grid_cost * 1000
        actual_cost_boiler = boiler_output * FINANCIAL.BOILER_COST
        actual_cost_sulfur = sulfur_steam_used * FINANCIAL.SULFURIC_HEAT_COST
        actual_cost_gta = sum(g['admission'] * FINANCIAL.GTA_FUEL_COST * 100 for g in gtas)
        
        total_cost_value = (actual_cost_grid + actual_cost_boiler + 
                          actual_cost_sulfur + actual_cost_gta)
        
        # Calculate baseline (naive strategy: 50% GTA load, rest from boiler/grid)
        baseline_gta_load = 0.5  # 50% of max capacity
        baseline_gta_admission = PHYSICS.MAX_ADMISSION * baseline_gta_load * 3  # 3 GTAs
        baseline_gta_power = sum(
            (PHYSICS.get_gta_coefficients(i)['coef_a'] * (PHYSICS.MAX_ADMISSION * baseline_gta_load) +
             PHYSICS.get_gta_coefficients(i)['intercept'])
            for i in [1, 2, 3]
        )
        baseline_grid_import = max(0, elec_demand - baseline_gta_power)
        baseline_boiler_steam = max(0, steam_demand - max_sulfur - (PHYSICS.MAX_ADMISSION * baseline_gta_load * 3 * 0.3))  # Assume 30% extraction
        
        baseline_cost = (baseline_grid_import * grid_cost * 1000 + 
                        baseline_boiler_steam * FINANCIAL.BOILER_COST +
                        max_sulfur * FINANCIAL.SULFURIC_HEAT_COST +
                        baseline_gta_admission * FINANCIAL.GTA_FUEL_COST * 100)
        
        savings = baseline_cost - total_cost_value
        
        # Generate recommendations
        recommendations = self._generate_recommendations(
            gtas=gtas,
            grid_import=grid_import,
            boiler_output=boiler_output,
            sulfur_steam_used=sulfur_steam_used,
            baseline_grid=baseline_grid_import,
            baseline_boiler=baseline_boiler_steam,
            grid_cost=grid_cost,
            savings=savings,
            elec_demand=elec_demand,
            steam_demand=steam_demand,
            hour=hour
        )
        
        # Store solution
        self.last_solution = {
            'gtas': gtas,
            'grid_import': round(grid_import, 2),
            'boiler_output': round(boiler_output, 2),
            'sulfur_steam': round(sulfur_steam_used, 2),
            'total_cost': round(total_cost_value, 2),
            'cost_breakdown': {
                'grid': round(actual_cost_grid, 2),
                'boiler': round(actual_cost_boiler, 2),
                'sulfur': round(actual_cost_sulfur, 2),
                'gta_fuel': round(actual_cost_gta, 2)
            },
            'status': status,
            'baseline_cost': round(baseline_cost, 2),
            'baseline': {
                'grid_import': round(baseline_grid_import, 2),
                'boiler_output': round(baseline_boiler_steam, 2),
                'gta_load_percent': baseline_gta_load * 100
            },
            'savings': round(savings, 2),
            'demands': {
                'electricity': elec_demand,
                'steam': steam_demand
            },
            'constraints_applied': constraints or {},
            'recommendations': recommendations
        }
        
        if verbose:
            self.print_solution()
        
        return self.last_solution
    
    def print_solution(self):
        """Pretty print the optimization solution"""
        if not self.last_solution:
            print("No solution available")
            return
        
        sol = self.last_solution
        
        print("\n" + "=" * 70)
        print("📊 OPTIMIZATION RESULTS")
        print("=" * 70)
        
        print("\n🔹 GTA Operations:")
        for gta in sol['gtas']:
            print(f"   GTA {gta['gta_number']}: "
                  f"Admission={gta['admission']:6.2f} T/hr, "
                  f"Soutirage={gta['soutirage']:6.2f} T/hr, "
                  f"Power={gta['power']:6.2f} MW")
        
        print(f"\n🔹 Auxiliary Systems:")
        print(f"   Grid Import:    {sol['grid_import']:6.2f} MW")
        print(f"   Boiler Output:  {sol['boiler_output']:6.2f} T/hr")
        print(f"   Sulfur Steam:   {sol['sulfur_steam']:6.2f} T/hr (Free)")
        
        print(f"\n💰 Cost Breakdown:")
        for source, cost in sol['cost_breakdown'].items():
            print(f"   {source.capitalize():12s}: {cost:8.2f} DH/hr")
        
        print(f"\n💵 Total Cost:     {sol['total_cost']:8.2f} DH/hr")
        print(f"📉 Baseline Cost:  {sol['baseline_cost']:8.2f} DH/hr")
        print(f"✨ Savings:        {sol['savings']:8.2f} DH/hr")
        print(f"   ({(sol['savings']/sol['baseline_cost']*100):.1f}% reduction)")
        
        print("=" * 70 + "\n")


# ==================== UTILITY FUNCTIONS ====================

def load_sulfur_data(filepath: str = None) -> Optional[pd.DataFrame]:
    """
    Load sulfur recovery data from CSV
    
    Args:
        filepath: Path to CSV file. If None, uses default location
        
    Returns:
        DataFrame with sulfur data or None if not found
    """
    import os
    
    if filepath is None:
        # Try default locations
        possible_paths = [
            '/home/bneay/Industrial-Copilot/backend/data/DATA_FINAL.csv',
            '/home/bneay/Industrial-Copilot/ml/data.csv',
            'backend/data/DATA_FINAL.csv',
            'ml/data.csv'
        ]
        
        for path in possible_paths:
            if os.path.exists(path):
                filepath = path
                break
    
    if filepath is None or not os.path.exists(filepath):
        print(f"⚠️  Warning: Sulfur data file not found")
        return None
    
    try:
        df = pd.read_csv(filepath)
        print(f"✅ Loaded sulfur data from: {filepath}")
        return df
    except Exception as e:
        print(f"❌ Error loading sulfur data: {e}")
        return None


if __name__ == "__main__":
    """Test the optimizer"""
    print("Testing Energy Optimizer...\n")
    
    # Create optimizer instance
    optimizer = EnergyOptimizer()
    
    # Test scenario 1: Normal operation
    print("🔬 Test 1: Normal Operation")
    result1 = optimizer.optimize(
        elec_demand=60.0,    # 60 MW
        steam_demand=400.0,  # 400 T/hr
        hour=14              # Off-peak
    )
    
    # Test scenario 2: GTA 2 maintenance
    print("\n🔬 Test 2: GTA 2 Maintenance")
    result2 = optimizer.optimize(
        elec_demand=60.0,
        steam_demand=400.0,
        constraints={'gta2_status': 'MAINTENANCE'},
        hour=14
    )
    
    # Test scenario 3: Client CAP needs extra steam during peak hours
    print("\n🔬 Test 3: Client CAP High Demand (Peak Hours)")
    result3 = optimizer.optimize(
        elec_demand=70.0,
        steam_demand=450.0,
        constraints={'cap_steam': 460},  # CAP needs 460 T/hr minimum
        hour=19  # Peak hours
    )
    
    print("\n✅ All tests completed!")
