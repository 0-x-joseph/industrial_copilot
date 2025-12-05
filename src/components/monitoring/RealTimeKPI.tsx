'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from '@/components/ui';

/**
 * Real-Time KPI Component
 * 
 * Displays live operational metrics:
 * - Cost per hour
 * - CO2 emissions
 * - System efficiency
 * - Free energy percentage
 */

interface LiveData {
  cost_per_hour: number;
  co2_emissions_kg_per_hour: number;
  efficiency_percent: number;
  free_energy_percent: number;
  total_power_generated: number;
  grid_import_estimated: number;
}

interface RealTimeKPIProps {
  data: LiveData | null;
  isLoading?: boolean;
}

const AnimatedCounter: React.FC<{ value: number; decimals?: number; duration?: number }> = ({ 
  value, 
  decimals = 0,
  duration = 1000 
}) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    const start = displayValue;
    const end = value;
    const range = end - start;
    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const easeOutQuad = 1 - (1 - progress) * (1 - progress);
      const current = start + range * easeOutQuad;

      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(end);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span>{displayValue.toFixed(decimals)}</span>;
};

export const RealTimeKPI: React.FC<RealTimeKPIProps> = ({ data, isLoading }) => {
  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-[#313647] rounded-lg p-4 border border-[#435663] animate-pulse">
            <div className="h-20"></div>
          </div>
        ))}
      </div>
    );
  }

  const kpis = [
    {
      title: 'Operating Cost',
      value: data.cost_per_hour,
      unit: 'DH/hr',
      decimals: 0,
      icon: 'star' as const,
      color: '#FFD966',
      trend: data.free_energy_percent > 10 ? 'down' : 'stable',
      subtitle: `${((data.cost_per_hour / 1000) * 24).toFixed(0)}k DH/day`
    },
    {
      title: 'CO₂ Emissions',
      value: data.co2_emissions_kg_per_hour / 1000,
      unit: 'tons/hr',
      decimals: 1,
      icon: 'dot' as const,
      color: data.co2_emissions_kg_per_hour > 150000 ? '#E86C5D' : '#A3B087',
      trend: data.co2_emissions_kg_per_hour > 150000 ? 'up' : 'down',
      subtitle: `${((data.co2_emissions_kg_per_hour / 1000) * 24).toFixed(0)} tons/day`
    },
    {
      title: 'System Efficiency',
      value: data.efficiency_percent,
      unit: '%',
      decimals: 1,
      icon: 'settings' as const,
      color: data.efficiency_percent > 85 ? '#A3B087' : data.efficiency_percent > 75 ? '#FFD966' : '#E86C5D',
      trend: data.efficiency_percent > 85 ? 'up' : 'down',
      subtitle: data.efficiency_percent > 85 ? 'Optimal' : 'Below target'
    },
    {
      title: 'Free Energy',
      value: data.free_energy_percent,
      unit: '%',
      decimals: 1,
      icon: 'send' as const,
      color: '#A3B087',
      trend: data.free_energy_percent > 12 ? 'up' : 'stable',
      subtitle: 'From sulfur recovery'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, index) => (
        <div
          key={index}
          className="bg-[#313647] rounded-lg p-4 border border-[#435663] hover:border-[#A3B087] transition-colors"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: kpi.color + '20' }}
              >
                <Icon name={kpi.icon} size={16} color="primary" />
              </div>
              <div className="text-xs font-medium text-[#8E9098] uppercase tracking-wide">
                {kpi.title}
              </div>
            </div>
            {kpi.trend && (
              <div className={`text-xs ${
                kpi.trend === 'up' ? 'text-green-400' : 
                kpi.trend === 'down' ? 'text-red-400' : 
                'text-[#8E9098]'
              }`}>
                {kpi.trend === 'up' ? '↑' : kpi.trend === 'down' ? '↓' : '→'}
              </div>
            )}
          </div>

          <div className="flex items-baseline gap-2 mb-1">
            <div 
              className="text-3xl font-bold tabular-nums"
              style={{ color: kpi.color }}
            >
              <AnimatedCounter value={kpi.value} decimals={kpi.decimals} />
            </div>
            <div className="text-sm text-[#8E9098] font-medium">
              {kpi.unit}
            </div>
          </div>

          <div className="text-xs text-[#8E9098]">
            {kpi.subtitle}
          </div>
        </div>
      ))}
    </div>
  );
};
