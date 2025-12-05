'use client';

import React from 'react';
import { Icon } from '@/components/ui';
import { OptimizationResult } from '@/lib/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

/**
 * SimulationResults Component
 * 
 * Right panel showing optimization results after simulation.
 * Includes financial impact, source mix comparison, and action checklist.
 */

interface SimulationResultsProps {
  result: OptimizationResult;
  config: {
    steamDemand: number;
    electricityDemand: number;
  };
}

interface ActionItem {
  type: 'success' | 'warning' | 'action';
  icon: string;
  text: string;
}

export const SimulationResults: React.FC<SimulationResultsProps> = ({ result, config }) => {
  // Use baseline from backend
  const baselineBoilerSteam = result.baseline?.boiler_output || config.steamDemand * 0.4;
  const baselineGridImport = result.baseline?.grid_import || config.electricityDemand;
  const baselineSulfurSteam = result.sulfur_steam;
  const baselineGTASteam = config.steamDemand - baselineBoilerSteam - baselineSulfurSteam;

  const optimizedBoilerSteam = result.boiler_output;
  const optimizedGridImport = result.grid_import;
  const optimizedSulfurSteam = result.sulfur_steam;
  const optimizedGTASteam = result.gtas.reduce((sum, gta) => sum + gta.soutirage, 0);

  // Source mix data for comparison
  const comparisonData = [
    {
      name: 'Baseline',
      sulfur: baselineSulfurSteam,
      gta: baselineGTASteam,
      boiler: baselineBoilerSteam,
    },
    {
      name: 'Optimized',
      sulfur: optimizedSulfurSteam,
      gta: optimizedGTASteam,
      boiler: optimizedBoilerSteam,
    }
  ];

  const savingsPercent = ((result.savings / result.baseline_cost) * 100).toFixed(1);

  // Brand-aligned chart colors
  const chartColors = {
    sulfur: '#A3B087',   // ocp-accent (sage green)
    gta: '#7094B0',      // status-info
    boiler: '#C47070',   // status-danger
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Financial Impact - The "Wow" Factor */}
      <div className="bg-ocp-900 rounded-lg border border-ocp-400/30 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-ocp-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="star" size={20} color="accent" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-ocp-cream">Financial Impact</h2>
            <p className="text-sm text-ocp-300">Cost comparison per hour</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Baseline Cost */}
          <div className="text-center">
            <div className="text-sm text-ocp-300 mb-2">Baseline Cost</div>
            <div className="text-3xl font-bold font-mono text-ocp-cream-muted">
              {result.baseline_cost.toLocaleString()}
            </div>
            <div className="text-xs text-ocp-400 mt-1">DH/hr</div>
            <div className="mt-3 text-xs text-ocp-300">
              (Inefficient Operation)
            </div>
          </div>

          {/* Optimized Cost */}
          <div className="text-center">
            <div className="text-sm text-ocp-300 mb-2">Optimized Cost</div>
            <div className="text-3xl font-bold font-mono text-status-info">
              {result.total_cost.toLocaleString()}
            </div>
            <div className="text-xs text-ocp-400 mt-1">DH/hr</div>
            <div className="mt-3 text-xs text-ocp-accent">
              ({savingsPercent}% reduction)
            </div>
          </div>

          {/* Net Savings */}
          <div className="text-center bg-gradient-to-br from-ocp-accent/20 to-ocp-accent/10 rounded-lg border border-ocp-accent/30 p-4">
            <div className="text-sm text-ocp-accent mb-2 font-semibold">Net Savings</div>
            <div className="text-4xl font-bold font-mono text-ocp-accent">
              {result.savings.toLocaleString()}
            </div>
            <div className="text-xs text-ocp-accent mt-1 font-semibold">DH/hr</div>
            <div className="mt-3 text-xs text-ocp-accent flex items-center justify-center gap-1">
              <Icon name="thumbs-up" size={16} color="accent" />
              <span>{(result.savings * 8760).toLocaleString()} DH/year</span>
            </div>
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="mt-6 pt-6 border-t border-ocp-400/30">
          <div className="text-sm text-ocp-300 mb-3">Optimized Cost Breakdown</div>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-ocp-800/50 rounded-lg p-3">
              <div className="text-xs text-ocp-300 mb-1">Grid</div>
              <div className="text-lg font-bold text-status-info">
                {result.cost_breakdown.grid.toLocaleString()}
              </div>
              <div className="text-xs text-ocp-400">DH/hr</div>
            </div>
            <div className="bg-ocp-800/50 rounded-lg p-3">
              <div className="text-xs text-ocp-300 mb-1">Boiler</div>
              <div className="text-lg font-bold text-status-danger">
                {result.cost_breakdown.boiler.toLocaleString()}
              </div>
              <div className="text-xs text-ocp-400">DH/hr</div>
            </div>
            <div className="bg-ocp-800/50 rounded-lg p-3">
              <div className="text-xs text-ocp-300 mb-1">Sulfur</div>
              <div className="text-lg font-bold text-ocp-accent">
                {result.cost_breakdown.sulfur.toLocaleString()}
              </div>
              <div className="text-xs text-ocp-400">DH/hr</div>
            </div>
            <div className="bg-ocp-800/50 rounded-lg p-3">
              <div className="text-xs text-ocp-300 mb-1">GTA Fuel</div>
              <div className="text-lg font-bold text-ocp-500">
                {result.cost_breakdown.gta_fuel.toLocaleString()}
              </div>
              <div className="text-xs text-ocp-400">DH/hr</div>
            </div>
          </div>
        </div>
      </div>

      {/* Source Mix Comparison */}
      <div className="bg-ocp-900 rounded-lg border border-ocp-400/30 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-ocp-500/10 rounded-lg flex items-center justify-center">
            <Icon name="dashboard-tab" size={20} color="accent" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-ocp-cream">Steam Source Mix</h2>
            <p className="text-sm text-ocp-300">Baseline vs Optimized</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={comparisonData}>
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#7a8b96', fontSize: 14 }}
              axisLine={{ stroke: '#5a6d7a' }}
            />
            <YAxis 
              tick={{ fill: '#7a8b96', fontSize: 12 }}
              axisLine={{ stroke: '#5a6d7a' }}
              label={{ value: 'Steam (T/h)', angle: -90, position: 'insideLeft', fill: '#7a8b96' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#232730', 
                border: '1px solid #5a6d7a',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#FFF8D4'
              }}
              formatter={(value: number, name: string) => {
                const labels: Record<string, string> = {
                  sulfur: 'Sulfur (Free, 20 DH/T)',
                  gta: 'GTA Extraction',
                  boiler: 'Boiler (Expensive, 284 DH/T)'
                };
                return [value.toFixed(1) + ' T/h', labels[name] || name];
              }}
            />
            <Bar dataKey="sulfur" stackId="a" fill={chartColors.sulfur} name="Sulfur" />
            <Bar dataKey="gta" stackId="a" fill={chartColors.gta} name="GTA" />
            <Bar dataKey="boiler" stackId="a" fill={chartColors.boiler} name="Boiler" />
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-4 flex justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-ocp-accent rounded"></div>
            <span className="text-sm text-ocp-cream-muted">Sulfur (Free, 20 DH/T)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-status-info rounded"></div>
            <span className="text-sm text-ocp-cream-muted">GTA Extraction</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-status-danger rounded"></div>
            <span className="text-sm text-ocp-cream-muted">Boiler (Expensive, 284 DH/T)</span>
          </div>
        </div>
      </div>

      {/* Action Checklist - Use Backend Recommendations */}
      <div className="bg-ocp-900 rounded-lg border border-ocp-400/30 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-status-info/10 rounded-lg flex items-center justify-center">
            <Icon name="commands" size={20} color="accent" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-ocp-cream">Operational Commands</h2>
            <p className="text-sm text-ocp-300">Step-by-step instructions with safety checks</p>
          </div>
        </div>

        <div className="space-y-3">
          {(result.recommendations || []).map((rec, index) => {
            // Determine border color based on priority
            const borderColorMap = {
              high: 'border-status-danger',
              medium: 'border-status-warning',
              low: 'border-ocp-accent'
            };
            
            return (
              <div
                key={index}
                className={`
                  border-l-4 ${borderColorMap[rec.priority as keyof typeof borderColorMap]} 
                  bg-ocp-800/50
                  p-4 mb-3 rounded-r-lg
                `}
              >
                {/* Header with Icon, Title, and Impact */}
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-ocp-cream flex gap-2 items-center">
                    <span className="text-xl">{rec.icon}</span>
                    <span>{rec.title}</span>
                  </h4>
                  <span className={`
                    font-mono text-sm px-2 py-1 rounded
                    ${rec.priority === 'high' ? 'bg-status-danger-muted text-status-danger' : ''}
                    ${rec.priority === 'medium' ? 'bg-status-warning-muted text-status-warning' : ''}
                    ${rec.priority === 'low' ? 'bg-ocp-accent/20 text-ocp-accent' : ''}
                  `}>
                    {rec.impact}
                  </span>
                </div>

                {/* Instruction */}
                <p className="text-ocp-cream-muted mt-2 text-sm mb-3">
                  <span className="text-status-info font-bold">ACTION:</span>{' '}
                  {rec.instruction}
                </p>

                {/* Safety Check (if present) */}
                {rec.safety_check && (
                  <div className="mt-2 text-xs bg-status-warning-muted text-status-warning p-3 rounded flex gap-2 items-start">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 mt-0.5">
                      <path d="M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>{rec.safety_check}</span>
                  </div>
                )}
              </div>
            );
          })}
          
          {(!result.recommendations || result.recommendations.length === 0) && (
            <div className="text-center py-8 text-ocp-400">
              No operational commands generated.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
