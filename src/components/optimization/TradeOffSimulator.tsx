'use client';

import React, { useState, useEffect } from 'react';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar, ComposedChart } from 'recharts';
import { Icon } from '@/components/ui';

interface TradeOffSimulatorProps {
  currentSteamDemand: number;
  currentGridImport: number;
  gridCostPerKwh: number;
}

export const TradeOffSimulator: React.FC<TradeOffSimulatorProps> = ({
  currentSteamDemand,
  currentGridImport,
  gridCostPerKwh
}) => {
  const [targetSteam, setTargetSteam] = useState(currentSteamDemand);
  const [simData, setSimData] = useState<any[]>([]);

  // Calculate trade-offs based on steam target
  const calculateTradeOff = (steamTarget: number) => {
    const steamDelta = steamTarget - currentSteamDemand;
    
    // Every 10T steam extraction costs ~1.7 MW power (Beta coefficient avg 0.17)
    const powerLoss = steamDelta * 0.17;
    const gridImportIncrease = Math.max(0, currentGridImport + powerLoss);
    
    // Cost calculation
    const gridCostIncrease = powerLoss * gridCostPerKwh * 1000; // DH/hr
    const steamCostSavings = steamDelta * 284; // Assuming boiler steam avoided
    const netCostChange = gridCostIncrease - steamCostSavings;

    return {
      steamTarget,
      steamDelta: steamDelta.toFixed(2),
      powerLoss: powerLoss.toFixed(2),
      gridImport: gridImportIncrease.toFixed(2),
      gridCostChange: gridCostIncrease.toFixed(0),
      steamCostSavings: steamCostSavings.toFixed(0),
      netCost: netCostChange.toFixed(0)
    };
  };

  // Generate simulation data for chart
  useEffect(() => {
    const dataPoints = [];
    const steamRange = [
      currentSteamDemand - 100,
      currentSteamDemand - 50,
      currentSteamDemand,
      currentSteamDemand + 50,
      currentSteamDemand + 100,
      currentSteamDemand + 150
    ];

    for (const steam of steamRange) {
      if (steam > 0) {
        const trade = calculateTradeOff(steam);
        dataPoints.push({
          steam: steam,
          gridImport: parseFloat(trade.gridImport),
          netCost: parseFloat(trade.netCost)
        });
      }
    }

    setSimData(dataPoints);
  }, [currentSteamDemand, currentGridImport, gridCostPerKwh]);

  const currentTradeOff = calculateTradeOff(targetSteam);

  return (
    <div className="bg-slate-900/50 border border-slate-700/50 rounded-xl p-6 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-rose-500/20 flex items-center justify-center border border-amber-500/30">
          <Icon name="settings" size={20} color="primary" />
        </div>
        <div>
          <h3 className="text-base font-semibold text-slate-200">Steam-Power Trade-Off Simulator</h3>
          <p className="text-xs text-slate-500">Real-time consequence analysis</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Slider + Consequences */}
        <div className="space-y-4">
          {/* Steam Target Slider */}
          <div className="bg-slate-800/50 border border-slate-700/30 rounded-lg p-4">
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Target MP Steam Supply
            </label>
            
            <div className="space-y-3">
              <input
                type="range"
                min={Math.max(0, currentSteamDemand - 150)}
                max={currentSteamDemand + 200}
                step={10}
                value={targetSteam}
                onChange={(e) => setTargetSteam(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
              />
              
              <div className="flex items-baseline gap-2">
                <input
                  type="number"
                  value={targetSteam}
                  onChange={(e) => setTargetSteam(parseFloat(e.target.value) || 0)}
                  className="w-32 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-200 text-lg font-bold focus:outline-none focus:border-emerald-500"
                />
                <span className="text-sm text-slate-400">T/hr</span>
              </div>
            </div>
          </div>

          {/* Real-Time Consequences */}
          <div className="bg-slate-800/50 border border-slate-700/30 rounded-lg p-4 space-y-3">
            <div className="text-sm font-medium text-slate-300 mb-3">
              ⚡ Real-Time Consequences
            </div>

            {/* Dynamic Equation Display */}
            <div className={`p-3 rounded-lg border ${
              parseFloat(currentTradeOff.steamDelta) > 0 
                ? 'bg-amber-500/10 border-amber-500/30' 
                : parseFloat(currentTradeOff.steamDelta) < 0
                ? 'bg-emerald-500/10 border-emerald-500/30'
                : 'bg-slate-700/30 border-slate-600/30'
            }`}>
              <div className="font-mono text-sm text-slate-200 space-y-1">
                <div>
                  {Math.abs(parseFloat(currentTradeOff.steamDelta)).toFixed(0)} T/hr Steam 
                  <span className={parseFloat(currentTradeOff.steamDelta) > 0 ? 'text-amber-400' : 'text-emerald-400'}>
                    {parseFloat(currentTradeOff.steamDelta) > 0 ? ' MORE' : ' LESS'}
                  </span>
                </div>
                <div className="text-slate-400">↓</div>
                <div>
                  = {Math.abs(parseFloat(currentTradeOff.powerLoss)).toFixed(1)} MW Power 
                  <span className={parseFloat(currentTradeOff.powerLoss) > 0 ? 'text-rose-400' : 'text-emerald-400'}>
                    {parseFloat(currentTradeOff.powerLoss) > 0 ? ' LOST' : ' GAINED'}
                  </span>
                </div>
                <div className="text-slate-400">↓</div>
                <div>
                  = {Math.abs(parseFloat(currentTradeOff.netCost)).toFixed(0)} DH/hr 
                  <span className={parseFloat(currentTradeOff.netCost) > 0 ? 'text-rose-400' : 'text-emerald-400'}>
                    {parseFloat(currentTradeOff.netCost) > 0 ? ' HIGHER COST' : ' SAVINGS'}
                  </span>
                </div>
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="space-y-2 pt-2 border-t border-slate-700">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Grid Import Change:</span>
                <span className="text-amber-400 font-semibold">
                  {parseFloat(currentTradeOff.powerLoss) > 0 ? '+' : ''}{currentTradeOff.powerLoss} MW
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Grid Cost Change:</span>
                <span className="text-rose-400 font-semibold">
                  +{currentTradeOff.gridCostChange} DH/hr
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Steam Cost Savings:</span>
                <span className="text-emerald-400 font-semibold">
                  -{currentTradeOff.steamCostSavings} DH/hr
                </span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-slate-700">
                <span className="text-slate-300 font-medium">Net Change:</span>
                <span className={`font-bold ${
                  parseFloat(currentTradeOff.netCost) > 0 ? 'text-rose-400' : 'text-emerald-400'
                }`}>
                  {parseFloat(currentTradeOff.netCost) > 0 ? '+' : ''}{currentTradeOff.netCost} DH/hr
                </span>
              </div>
            </div>
          </div>

          {/* Warning if major change */}
          {Math.abs(parseFloat(currentTradeOff.steamDelta)) > 50 && (
            <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <Icon name="dot" size={16} color="secondary" />
              <div className="text-xs">
                <div className="text-amber-400 font-semibold">Large Steam Change</div>
                <div className="text-amber-300/80 mt-0.5">
                  Verify operational limits and stability margins
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Dual-Axis Chart */}
        <div className="bg-slate-800/30 rounded-lg p-4">
          <h4 className="text-xs font-semibold text-slate-300 mb-3 uppercase tracking-wide">
            Trade-Off Visualization
          </h4>
          
          <ResponsiveContainer width="100%" height={350}>
            <ComposedChart data={simData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
              <XAxis 
                dataKey="steam" 
                stroke="#64748b" 
                fontSize={10}
                label={{ value: 'Steam Target (T/h)', position: 'insideBottom', offset: -5, fontSize: 11, fill: '#64748b' }}
              />
              <YAxis 
                yAxisId="left"
                stroke="#64748b" 
                fontSize={10}
                label={{ value: 'Grid Import (MW)', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#64748b' }}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                stroke="#64748b" 
                fontSize={10}
                label={{ value: 'Net Cost (DH/h)', angle: 90, position: 'insideRight', fontSize: 11, fill: '#64748b' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  fontSize: '11px'
                }}
              />
              <Legend 
                wrapperStyle={{ fontSize: '10px' }}
                iconType="line"
              />
              
              {/* Grid Import - Bar */}
              <Bar
                yAxisId="left"
                dataKey="gridImport"
                fill="#f59e0b"
                opacity={0.6}
                name="Grid Import (MW)"
              />
              
              {/* Net Cost - Line */}
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="netCost"
                stroke="#f43f5e"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Net Cost (DH/h)"
              />

              {/* Current position indicator */}
              <Line
                yAxisId="left"
                type="monotone"
                dataKey={(entry: any) => entry.steam === Math.round(targetSteam / 10) * 10 ? entry.gridImport : null}
                stroke="#10b981"
                strokeWidth={3}
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>

          <div className="text-xs text-slate-500 text-center mt-2">
            Current target shown with bars. Line shows net cost impact.
          </div>
        </div>
      </div>
    </div>
  );
};
