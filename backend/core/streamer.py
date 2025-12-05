#!/usr/bin/env python3
"""
Energy Copilot - Live Data Streamer
===================================

Simulates real-time data feed from plant sensors by streaming historical CSV data.
Provides real-time monitoring of sulfur flows, steam pressure, and GTA operations.

Author: Principal Software Architect
Date: December 2025
"""

import pandas as pd
import numpy as np
from datetime import datetime
from typing import Dict, Any, Optional, Generator
import time
import os


class PlantDataStreamer:
    """
    Streams plant operational data to simulate real-time monitoring.
    
    Data Sources:
    - DATA_FINAL.csv: Sulfur flows, steam pressure, GTA operations
    - data.csv: Historical GTA behavior
    """
    
    def __init__(self, data_path: str = None):
        """
        Initialize the data streamer
        
        Args:
            data_path: Path to DATA_FINAL.csv or data.csv
        """
        self.data_path = data_path or self._find_data_file()
        self.data = None
        self.current_index = 0
        self.last_row = None
        
        # Conversion factors
        self.SULFUR_TO_STEAM_RATIO = 2.0  # 1T Sulfur ≈ 2T Steam (heat recovery)
        self.CRITICAL_PRESSURE = 8.5  # bar (MP1 pressure threshold)
        
        # Load data
        self.load_data()
    
    def _find_data_file(self) -> str:
        """Find DATA_FINAL.csv in the project"""
        # Get the directory where this file is located
        current_dir = os.path.dirname(os.path.abspath(__file__))
        backend_dir = os.path.dirname(current_dir)  # backend/
        project_root = os.path.dirname(backend_dir)  # project root
        
        possible_paths = [
            os.path.join(project_root, 'ml', 'data.csv'),
            os.path.join(project_root, 'ml', 'DATA_FINAL.csv'),
            os.path.join(backend_dir, 'data', 'DATA_FINAL.csv'),
            os.path.join(backend_dir, 'data', 'data.csv'),
            'backend/data/DATA_FINAL.csv',
            'data/DATA_FINAL.csv',
            '../ml/data.csv',
            'ml/data.csv'
        ]
        
        for path in possible_paths:
            if os.path.exists(path):
                print(f"📂 Found data file at: {path}")
                return path
        
        # Return the most likely path even if it doesn't exist
        # (will trigger dummy data generation)
        print(f"⚠️ No data file found, will use synthetic data")
        return os.path.join(project_root, 'ml', 'data.csv')
    
    def load_data(self):
        """Load CSV data"""
        try:
            self.data = pd.read_csv(self.data_path)
            print(f"✅ Loaded streaming data from: {self.data_path}")
            print(f"📊 Records available: {len(self.data)}")
            
            # Display available columns
            print(f"📋 Columns: {list(self.data.columns)[:10]}...")
            
        except Exception as e:
            print(f"❌ Error loading data: {e}")
            # Create dummy data for testing
            self._create_dummy_data()
    
    def _create_dummy_data(self):
        """Create synthetic data for testing"""
        timestamps = pd.date_range('2024-01-01', periods=1000, freq='15min')
        self.data = pd.DataFrame({
            'Date': timestamps,
            'Admission_HP_GTA_1': np.random.uniform(150, 190, 1000),
            'Soutirage_MP_GTA_1': np.random.uniform(120, 150, 1000),
            'Prod_EE_GTA_1': np.random.uniform(18, 23, 1000),
            'Admission_HP_GTA_2': np.random.uniform(150, 200, 1000),
            'Soutirage_MP_GTA_2': np.random.uniform(130, 160, 1000),
            'Prod_EE_GTA2_2': np.random.uniform(20, 25, 1000),
            'Admission_HP_GTA_3': np.random.uniform(160, 180, 1000),
            'Soutirage_MP_GTA_3': np.random.uniform(125, 145, 1000),
            'Prod_EE_GTA_3': np.random.uniform(19, 24, 1000),
            'Sulfur_Flow': np.random.uniform(20, 60, 1000),
            'MP_Pressure': np.random.uniform(8.0, 9.5, 1000)
        })
        print("⚠️  Using synthetic data for testing")
    
    def _parse_sulfur_columns(self, row: pd.Series) -> float:
        """
        Parse and sum all sulfur flow columns (Débit de soufre 01A...01Z)
        
        Args:
            row: DataFrame row
            
        Returns:
            Total sulfur flow in T/hr
        """
        sulfur_columns = [col for col in self.data.columns if 'soufre' in col.lower() or 'sulfur' in col.lower()]
        
        total_sulfur = 0.0
        for col in sulfur_columns:
            val = row[col]
            
            # Handle "Configure" strings
            if isinstance(val, str):
                if val.lower() == 'configure':
                    val = 0.0
                else:
                    try:
                        val = float(val)
                    except:
                        val = 0.0
            
            # Handle NaN
            if pd.isna(val):
                val = 0.0
            
            total_sulfur += float(val)
        
        return total_sulfur
    
    def _parse_pressure(self, row: pd.Series) -> Optional[float]:
        """
        Parse MP steam pressure (Pession vap MP1)
        
        Args:
            row: DataFrame row
            
        Returns:
            Pressure in bar, or None if not available
        """
        pressure_columns = [col for col in self.data.columns if 'pression' in col.lower() or 'pressure' in col.lower()]
        
        if not pressure_columns:
            # Estimate from steam flow (higher flow = slightly higher pressure)
            total_steam = sum([row.get(f'Soutirage_MP_GTA_{i}', 0) for i in [1, 2, 3]])
            return 8.5 + (total_steam - 400) * 0.001  # Simple linear model
        
        # Get first pressure column
        pressure = row[pressure_columns[0]]
        
        if isinstance(pressure, str):
            try:
                pressure = float(pressure)
            except:
                return None
        
        return float(pressure) if not pd.isna(pressure) else None
    
    def get_current_state(self) -> Dict[str, Any]:
        """
        Get current plant state (simulating real-time sensor data)
        
        Returns:
            Dictionary with current plant metrics
        """
        if self.data is None or len(self.data) == 0:
            return self._get_dummy_state()
        
        # Cycle through data
        if self.current_index >= len(self.data):
            self.current_index = 0
        
        row = self.data.iloc[self.current_index]
        self.last_row = row
        self.current_index += 1
        
        # Parse GTAs
        gta_power = []
        gta_admission = []
        gta_soutirage = []
        
        for i in [1, 2, 3]:
            # Handle different column naming conventions
            power_col = f'Prod_EE_GTA_{i}' if f'Prod_EE_GTA_{i}' in row.index else f'Prod_EE_GTA{i}_{i}'
            admission_col = f'Admission_HP_GTA_{i}'
            soutirage_col = f'Soutirage_MP_GTA_{i}'
            
            power = row.get(power_col, 20.0)
            admission = row.get(admission_col, 170.0)
            soutirage = row.get(soutirage_col, 140.0)
            
            # Convert to native Python types
            gta_power.append(float(power) if not pd.isna(power) and power is not None else 20.0)
            gta_admission.append(float(admission) if not pd.isna(admission) and admission is not None else 170.0)
            gta_soutirage.append(float(soutirage) if not pd.isna(soutirage) and soutirage is not None else 140.0)
        
        # Parse sulfur flow
        sulfur_flow = self._parse_sulfur_columns(row) if 'soufre' in str(self.data.columns).lower() else float(row.get('Sulfur_Flow', 40.0))
        
        # Parse pressure
        mp_pressure = self._parse_pressure(row)
        
        # Calculate derived metrics
        total_power = float(sum(gta_power))
        total_steam_gta = float(sum(gta_soutirage))
        free_steam = float(sulfur_flow * self.SULFUR_TO_STEAM_RATIO)
        
        # Estimate demand (assuming GTAs + some grid import)
        estimated_demand_elec = float(total_power * 1.05)  # 5% grid import typical
        estimated_demand_steam = float(total_steam_gta + free_steam + 50)  # +50T from boiler
        
        # Calculate efficiency
        pressure_efficiency_factor = 1.0 if mp_pressure is None or mp_pressure >= self.CRITICAL_PRESSURE else 0.95
        efficiency = (total_power / (sum(gta_admission) * 0.12)) * pressure_efficiency_factor  # ~12% typical efficiency
        efficiency = float(min(100, max(60, efficiency * 100)))  # Clamp to 60-100%
        
        # Cost calculation
        hour = datetime.now().hour
        grid_price = 1.27 if 17 <= hour < 22 else 0.55  # Peak/off-peak
        grid_import = float(estimated_demand_elec - total_power)
        
        cost_per_hour = float(
            grid_import * grid_price * 1000 +  # Grid (DH/hr)
            50 * 284 +  # Boiler steam (DH/hr)
            sum(gta_admission) * 0.65 * 100  # GTA fuel (DH/hr)
        )
        
        # CO2 estimation (kg/hr)
        co2_emissions = float(
            grid_import * 0.5 * 1000 +  # Grid: 0.5 kg CO2/kWh
            50 * 0.2 * 1000 +  # Boiler: 0.2 kg CO2/kg fuel
            sum(gta_admission) * 0.3 * 1000  # GTAs: 0.3 kg CO2/kg fuel
        )
        
        # STEAM ECONOMICS CALCULATIONS
        # Calculate blended steam cost
        sulfur_steam_tons = float(sulfur_flow * self.SULFUR_TO_STEAM_RATIO)
        gta_extraction_steam = float(total_steam_gta)
        total_mp_demand = float(estimated_demand_steam)
        boiler_steam_tons = float(max(0, total_mp_demand - sulfur_steam_tons - gta_extraction_steam))
        
        # Blended cost calculation
        sulfur_cost_total = sulfur_steam_tons * 20  # 20 DH/Ton
        boiler_cost_total = boiler_steam_tons * 284  # 284 DH/Ton
        total_steam_cost = sulfur_cost_total + boiler_cost_total
        blended_steam_cost = float(total_steam_cost / total_mp_demand if total_mp_demand > 0 else 0)
        
        # Source breakdown (percentages)
        steam_source_breakdown = {
            'sulfur_percent': float((sulfur_steam_tons / total_mp_demand * 100) if total_mp_demand > 0 else 0),
            'gta_percent': float((gta_extraction_steam / total_mp_demand * 100) if total_mp_demand > 0 else 0),
            'boiler_percent': float((boiler_steam_tons / total_mp_demand * 100) if total_mp_demand > 0 else 0),
            'sulfur_tons': float(sulfur_steam_tons),
            'gta_tons': float(gta_extraction_steam),
            'boiler_tons': float(boiler_steam_tons)
        }
        
        # OPPORTUNITY COST CALCULATION
        # Estimate electricity lost due to steam extraction (using average Beta coefficient)
        lost_mw = float(total_steam_gta * 0.17)  # 0.17 MW per T/hr steam extracted
        lost_revenue_per_hour = float(lost_mw * grid_price * 1000)  # Lost electricity value
        
        # Build state
        timestamp = row.get('Date', datetime.now())
        if isinstance(timestamp, str):
            try:
                timestamp = pd.to_datetime(timestamp).to_pydatetime()
            except:
                timestamp = datetime.now()
        elif not isinstance(timestamp, datetime):
            timestamp = datetime.now()
        
        state = {
            'timestamp': timestamp.isoformat(),
            'gta_operations': {
                'gta1': {'power': float(gta_power[0]), 'admission': float(gta_admission[0]), 'soutirage': float(gta_soutirage[0])},
                'gta2': {'power': float(gta_power[1]), 'admission': float(gta_admission[1]), 'soutirage': float(gta_soutirage[1])},
                'gta3': {'power': float(gta_power[2]), 'admission': float(gta_admission[2]), 'soutirage': float(gta_soutirage[2])}
            },
            'total_power_generated': round(float(total_power), 2),
            'total_steam_gta': round(float(total_steam_gta), 2),
            'sulfur_flow': round(float(sulfur_flow), 2),
            'free_steam_equivalent': round(float(free_steam), 2),
            'mp_pressure': round(float(mp_pressure), 2) if mp_pressure is not None else None,
            'pressure_alert': bool(mp_pressure < self.CRITICAL_PRESSURE) if mp_pressure is not None else False,
            'grid_import_estimated': round(float(grid_import), 2),
            'boiler_usage_estimated': round(float(boiler_steam_tons), 2),
            'efficiency_percent': round(float(efficiency), 1),
            'cost_per_hour': round(float(cost_per_hour), 2),
            'co2_emissions_kg_per_hour': round(float(co2_emissions), 2),
            'free_energy_percent': round(float((free_steam / estimated_demand_steam) * 100), 1) if estimated_demand_steam > 0 else 0.0,
            'demands': {
                'electricity': round(float(estimated_demand_elec), 2),
                'steam': round(float(estimated_demand_steam), 2)
            },
            # NEW: Steam Economics
            'steam_economics': {
                'blended_cost_per_ton': round(float(blended_steam_cost), 2),
                'total_steam_cost_per_hour': round(float(total_steam_cost), 2),
                'source_breakdown': steam_source_breakdown
            },
            # NEW: Opportunity Cost
            'opportunity_cost': {
                'lost_power_mw': round(float(lost_mw), 2),
                'lost_revenue_per_hour': round(float(lost_revenue_per_hour), 2),
                'extraction_efficiency': round(float((total_power / (total_power + lost_mw)) * 100) if (total_power + lost_mw) > 0 else 0, 1)
            }
        }
        
        return state
    
    def _get_dummy_state(self) -> Dict[str, Any]:
        """Get dummy state for testing"""
        return {
            'timestamp': datetime.now().isoformat(),
            'gta_operations': {
                'gta1': {'power': 22.0, 'admission': 175.0, 'soutirage': 145.0},
                'gta2': {'power': 24.0, 'admission': 195.0, 'soutirage': 155.0},
                'gta3': {'power': 21.0, 'admission': 170.0, 'soutirage': 140.0}
            },
            'total_power_generated': 67.0,
            'total_steam_gta': 440.0,
            'sulfur_flow': 45.0,
            'free_steam_equivalent': 90.0,
            'mp_pressure': 8.8,
            'pressure_alert': False,
            'grid_import_estimated': 3.5,
            'boiler_usage_estimated': 50.0,
            'efficiency_percent': 86.5,
            'cost_per_hour': 19850.0,
            'co2_emissions_kg_per_hour': 45200.0,
            'free_energy_percent': 15.5,
            'demands': {
                'electricity': 70.5,
                'steam': 580.0
            }
        }
    
    def stream(self) -> Generator[Dict[str, Any], None, None]:
        """
        Generator that yields plant states continuously
        
        Yields:
            Plant state dictionaries
        """
        while True:
            yield self.get_current_state()
            time.sleep(1)  # 1 second between updates


# Global streamer instance
_streamer = None

def get_streamer() -> PlantDataStreamer:
    """Get or create global streamer instance"""
    global _streamer
    if _streamer is None:
        _streamer = PlantDataStreamer()
    return _streamer


if __name__ == "__main__":
    """Test the streamer"""
    print("Testing Plant Data Streamer...\n")
    
    streamer = PlantDataStreamer()
    
    # Get a few states
    for i in range(5):
        state = streamer.get_current_state()
        print(f"\n{'='*70}")
        print(f"Time Step {i+1}")
        print(f"{'='*70}")
        print(f"⚡ Total Power: {state['total_power_generated']} MW")
        print(f"💨 Total Steam: {state['total_steam_gta']} T/hr")
        print(f"🔥 Sulfur Flow: {state['sulfur_flow']} T/hr → Free Steam: {state['free_steam_equivalent']} T/hr")
        print(f"📊 Pressure: {state['mp_pressure']} bar {'⚠️ ALERT' if state['pressure_alert'] else '✅ OK'}")
        print(f"⚙️  Efficiency: {state['efficiency_percent']}%")
        print(f"💰 Cost: {state['cost_per_hour']:.0f} DH/hr")
        print(f"🌍 CO2: {state['co2_emissions_kg_per_hour']:.0f} kg/hr")
        print(f"🟢 Free Energy: {state['free_energy_percent']}%")
        time.sleep(1)
