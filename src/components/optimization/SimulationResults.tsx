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

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Financial Impact - The "Wow" Factor */}
      <div className="bg-slate-900 rounded-lg border border-slate-800 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
            <Icon name="star" size={20} color="primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Financial Impact</h2>
            <p className="text-sm text-slate-400">Cost comparison per hour</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Baseline Cost */}
          <div className="text-center">
            <div className="text-sm text-slate-400 mb-2">Baseline Cost</div>
            <div className="text-3xl font-bold font-mono text-slate-300">
              {result.baseline_cost.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 mt-1">DH/hr</div>
            <div className="mt-3 text-xs text-slate-400">
              (Inefficient Operation)
            </div>
          </div>

          {/* Optimized Cost */}
          <div className="text-center">
            <div className="text-sm text-slate-400 mb-2">Optimized Cost</div>
            <div className="text-3xl font-bold font-mono text-blue-400">
              {result.total_cost.toLocaleString()}
            </div>
            <div className="text-xs text-slate-500 mt-1">DH/hr</div>
            <div className="mt-3 text-xs text-emerald-400">
              ({savingsPercent}% reduction)
            </div>
          </div>

          {/* Net Savings */}
          <div className="text-center bg-gradient-to-br from-emerald-500/20 to-emerald-500/10 rounded-lg border border-emerald-500/30 p-4">
            <div className="text-sm text-emerald-300 mb-2 font-semibold">Net Savings</div>
            <div className="text-4xl font-bold font-mono text-emerald-400">
              {result.savings.toLocaleString()}
            </div>
            <div className="text-xs text-emerald-300 mt-1 font-semibold">DH/hr</div>
            <div className="mt-3 text-xs text-emerald-400 flex items-center justify-center gap-1">
              <Icon name="thumbs-up" size={16} color="primary" />
              <span>{(result.savings * 8760).toLocaleString()} DH/year</span>
            </div>
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="mt-6 pt-6 border-t border-slate-800">
          <div className="text-sm text-slate-400 mb-3">Optimized Cost Breakdown</div>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-slate-800/50 rounded-lg p-3">
              <div className="text-xs text-slate-400 mb-1">Grid</div>
              <div className="text-lg font-bold text-blue-400">
                {result.cost_breakdown.grid.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500">DH/hr</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3">
              <div className="text-xs text-slate-400 mb-1">Boiler</div>
              <div className="text-lg font-bold text-rose-400">
                {result.cost_breakdown.boiler.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500">DH/hr</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3">
              <div className="text-xs text-slate-400 mb-1">Sulfur</div>
              <div className="text-lg font-bold text-emerald-400">
                {result.cost_breakdown.sulfur.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500">DH/hr</div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3">
              <div className="text-xs text-slate-400 mb-1">GTA Fuel</div>
              <div className="text-lg font-bold text-purple-400">
                {result.cost_breakdown.gta_fuel.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500">DH/hr</div>
            </div>
          </div>
        </div>
      </div>

      {/* Source Mix Comparison */}
      <div className="bg-slate-900 rounded-lg border border-slate-800 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
            <Icon name="dashboard-tab" size={20} color="primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Steam Source Mix</h2>
            <p className="text-sm text-slate-400">Baseline vs Optimized</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={comparisonData}>
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#94a3b8', fontSize: 14 }}
              axisLine={{ stroke: '#475569' }}
            />
            <YAxis 
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              axisLine={{ stroke: '#475569' }}
              label={{ value: 'Steam (T/h)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1e293b', 
                border: '1px solid #475569',
                borderRadius: '8px',
                fontSize: '12px'
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
            <Bar dataKey="sulfur" stackId="a" fill="#10b981" name="Sulfur" />
            <Bar dataKey="gta" stackId="a" fill="#3b82f6" name="GTA" />
            <Bar dataKey="boiler" stackId="a" fill="#ef4444" name="Boiler" />
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-4 flex justify-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-emerald-500 rounded"></div>
            <span className="text-sm text-slate-300">Sulfur (Free, 20 DH/T)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm text-slate-300">GTA Extraction</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-rose-500 rounded"></div>
            <span className="text-sm text-slate-300">Boiler (Expensive, 284 DH/T)</span>
          </div>
        </div>
      </div>

      {/* Action Checklist - Use Backend Recommendations */}
      <div className="bg-slate-900 rounded-lg border border-slate-800 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
            <Icon name="commands" size={20} color="primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Operational Commands</h2>
            <p className="text-sm text-slate-400">Step-by-step instructions with safety checks</p>
          </div>
        </div>

        <div className="space-y-3">
          {(result.recommendations || []).map((rec, index) => {
            // Determine border color based on priority
            const borderColorMap = {
              high: 'border-rose-500',
              medium: 'border-amber-500',
              low: 'border-emerald-500'
            };
            
            const bgColorMap = {
              high: 'bg-slate-900',
              medium: 'bg-slate-900',
              low: 'bg-slate-900'
            };

            return (
              <div
                key={index}
                className={`
                  border-l-4 ${borderColorMap[rec.priority as keyof typeof borderColorMap]} 
                  ${bgColorMap[rec.priority as keyof typeof bgColorMap]}
                  p-4 mb-3 rounded-r-lg
                `}
              >
                {/* Header with Icon, Title, and Impact */}
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-white flex gap-2 items-center">
                    <span className="text-xl">{rec.icon}</span>
                    <span>{rec.title}</span>
                  </h4>
                  <span className={`
                    font-mono text-sm px-2 py-1 rounded
                    ${rec.priority === 'high' ? 'bg-rose-500/20 text-rose-300' : ''}
                    ${rec.priority === 'medium' ? 'bg-amber-500/20 text-amber-300' : ''}
                    ${rec.priority === 'low' ? 'bg-emerald-500/20 text-emerald-300' : ''}
                  `}>
                    {rec.impact}
                  </span>
                </div>

                {/* Instruction */}
                <p className="text-slate-300 mt-2 text-sm mb-3">
                  <span className="text-blue-400 font-bold">ACTION:</span>{' '}
                  {rec.instruction}
                </p>

                {/* Safety Check (if present) */}
                {rec.safety_check && (
                  <div className="mt-2 text-xs bg-amber-900/30 text-amber-200 p-3 rounded flex gap-2 items-start">
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
            <div className="text-center py-8 text-slate-500">
              No operational commands generated.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
