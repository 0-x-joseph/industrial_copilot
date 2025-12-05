'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Icon } from '@/components/ui';

/**
 * Optimization Result Type (matches API response)
 */
export interface GTAResult {
  gta_number: number;
  admission: number;
  soutirage: number;
  power: number;
}

export interface OptimizationResult {
  gtas: GTAResult[];
  grid_import: number;
  boiler_output: number;
  sulfur_steam: number;
  total_cost: number;
  cost_breakdown: {
    grid: number;
    boiler: number;
    sulfur: number;
    gta_fuel: number;
  };
  savings: number;
  baseline_cost: number;
}

export interface MeritOrderChartProps {
  result: OptimizationResult | null;
  demands?: {
    electricity: number;
    steam: number;
  };
}

/**
 * MeritOrderChart Component
 * 
 * Visualizes the energy dispatch strategy using a stacked bar chart.
 * Shows the "Merit Order" - prioritizing cheapest sources first:
 * 1. 🟩 Sulfuric Heat Recovery (Base Load - Free/Cheap)
 * 2. 🟦 GTA Production (Medium Cost - Cogeneration)
 * 3. 🟨 Grid Import (Variable Cost - Gap Filler)
 * 4. 🟥 Boiler (Expensive - Overflow/Emergency)
 */
export const MeritOrderChart: React.FC<MeritOrderChartProps> = ({
  result,
  demands
}) => {
  if (!result) {
    return (
      <div className="bg-[#313647] rounded-lg p-6 border border-[#435663]">
        <div className="flex items-center gap-2 mb-4">
          <Icon name="dashboard-tab" size={20} color="primary" />
          <h3 className="text-lg font-semibold text-[#FFF8D4]">Merit Order Dispatch</h3>
        </div>
        <div className="text-center py-12 text-[#8E9098]">
          <Icon name="files" size={32} color="secondary" className="mx-auto mb-3 opacity-50" />
          <p>Run an optimization to see the dispatch strategy</p>
        </div>
      </div>
    );
  }

  // Prepare data for electricity chart
  const electricityData = [
    {
      name: 'Electricity',
      'GTA 1': result.gtas[0]?.power || 0,
      'GTA 2': result.gtas[1]?.power || 0,
      'GTA 3': result.gtas[2]?.power || 0,
      'Grid Import': result.grid_import,
      demand: demands?.electricity || 0
    }
  ];

  // Prepare data for steam chart
  const steamData = [
    {
      name: 'Steam',
      'Sulfur Recovery': result.sulfur_steam,
      'GTA 1': result.gtas[0]?.soutirage || 0,
      'GTA 2': result.gtas[1]?.soutirage || 0,
      'GTA 3': result.gtas[2]?.soutirage || 0,
      'Boiler': result.boiler_output,
      demand: demands?.steam || 0
    }
  ];

  // Colors for different sources (Merit Order)
  const colors = {
    sulfur: '#4ADE80',      // Green - Cheapest (Free recovery)
    gta1: '#3B82F6',        // Blue - Medium cost
    gta2: '#60A5FA',        // Light Blue
    gta3: '#93C5FD',        // Lighter Blue
    grid: '#FBBF24',        // Yellow - Variable cost
    boiler: '#EF4444',      // Red - Most expensive
    demand: '#8E9098'       // Gray - Demand line
  };

  /**
   * Custom tooltip for detailed information
   */
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;

    return (
      <div className="bg-[#1E2028] border border-[#435663] rounded-lg p-3 shadow-lg">
        <p className="text-[#FFF8D4] font-semibold mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div
              className="w-3 h-3 rounded"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-[#FFF8D4]">
              {entry.name}: {entry.value.toFixed(2)} {label === 'Electricity' ? 'MW' : 'T/hr'}
            </span>
          </div>
        ))}
      </div>
    );
  };

  /**
   * Calculate total production
   */
  const totalElectricity = result.gtas.reduce((sum, gta) => sum + gta.power, 0) + result.grid_import;
  const totalSteam = result.gtas.reduce((sum, gta) => sum + gta.soutirage, 0) + 
                     result.boiler_output + result.sulfur_steam;

  return (
    <div className="bg-[#313647] rounded-lg p-6 border border-[#435663]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Icon name="dashboard-tab" size={20} color="primary" />
          <h3 className="text-lg font-semibold text-[#FFF8D4]">Merit Order Dispatch</h3>
        </div>
        <div className="text-sm text-[#8E9098]">
          Stacked sources prioritized by cost
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[#1E2028] rounded-lg p-4 border border-[#435663]">
          <div className="text-[#8E9098] text-xs uppercase mb-1">Total Electricity</div>
          <div className="text-[#FFF8D4] text-2xl font-bold">
            {totalElectricity.toFixed(1)} <span className="text-lg">MW</span>
          </div>
          <div className="text-[#A3B087] text-sm mt-1">
            Demand: {demands?.electricity?.toFixed(1) || 0} MW
          </div>
        </div>
        <div className="bg-[#1E2028] rounded-lg p-4 border border-[#435663]">
          <div className="text-[#8E9098] text-xs uppercase mb-1">Total Steam</div>
          <div className="text-[#FFF8D4] text-2xl font-bold">
            {totalSteam.toFixed(1)} <span className="text-lg">T/hr</span>
          </div>
          <div className="text-[#A3B087] text-sm mt-1">
            Demand: {demands?.steam?.toFixed(1) || 0} T/hr
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="space-y-8">
        {/* Electricity Chart */}
        <div>
          <h4 className="text-[#FFF8D4] font-medium mb-3 flex items-center gap-2">
            <span className="text-yellow-400">⚡</span>
            Electricity Dispatch
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={electricityData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#435663" />
              <XAxis 
                dataKey="name" 
                stroke="#8E9098"
                tick={{ fill: '#FFF8D4' }}
              />
              <YAxis 
                stroke="#8E9098"
                tick={{ fill: '#FFF8D4' }}
                label={{ value: 'MW', angle: -90, position: 'insideLeft', fill: '#FFF8D4' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ color: '#FFF8D4' }}
                iconType="square"
              />
              
              {/* Stacked bars in merit order (bottom to top) */}
              <Bar dataKey="GTA 1" stackId="a" fill={colors.gta1} />
              <Bar dataKey="GTA 2" stackId="a" fill={colors.gta2} />
              <Bar dataKey="GTA 3" stackId="a" fill={colors.gta3} />
              <Bar dataKey="Grid Import" stackId="a" fill={colors.grid} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Steam Chart */}
        <div>
          <h4 className="text-[#FFF8D4] font-medium mb-3 flex items-center gap-2">
            <span className="text-blue-400">💨</span>
            Steam Dispatch
          </h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={steamData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#435663" />
              <XAxis 
                dataKey="name" 
                stroke="#8E9098"
                tick={{ fill: '#FFF8D4' }}
              />
              <YAxis 
                stroke="#8E9098"
                tick={{ fill: '#FFF8D4' }}
                label={{ value: 'T/hr', angle: -90, position: 'insideLeft', fill: '#FFF8D4' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ color: '#FFF8D4' }}
                iconType="square"
              />
              
              {/* Stacked bars in merit order (bottom to top) - cheapest first */}
              <Bar dataKey="Sulfur Recovery" stackId="a" fill={colors.sulfur} />
              <Bar dataKey="GTA 1" stackId="a" fill={colors.gta1} />
              <Bar dataKey="GTA 2" stackId="a" fill={colors.gta2} />
              <Bar dataKey="GTA 3" stackId="a" fill={colors.gta3} />
              <Bar dataKey="Boiler" stackId="a" fill={colors.boiler} />
            </BarChart>
          </ResponsiveContainer>
          
          {/* Warning if boiler is used heavily */}
          {result.boiler_output > 50 && (
            <div className="mt-3 flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <Icon name="dot" size={16} color="secondary" className="mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-400">
                <strong>High Boiler Usage:</strong> Consider reducing demand or checking GTA availability. 
                Boiler costs {result.cost_breakdown.boiler.toFixed(0)} DH/hr.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Legend Explanation */}
      <div className="mt-6 p-4 bg-[#1E2028] rounded-lg border border-[#435663]">
        <div className="text-[#FFF8D4] font-medium mb-3 text-sm">Merit Order Priority (Cheapest → Most Expensive):</div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: colors.sulfur }}></div>
            <span className="text-[#FFF8D4]">Sulfur Recovery</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: colors.gta1 }}></div>
            <span className="text-[#FFF8D4]">GTAs</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: colors.grid }}></div>
            <span className="text-[#FFF8D4]">Grid Import</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: colors.boiler }}></div>
            <span className="text-[#FFF8D4]">Boiler (Avoid)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeritOrderChart;
