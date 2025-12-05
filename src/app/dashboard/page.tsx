'use client';

import React from 'react';
import { Icon } from '@/components/ui';
import { CriticalSteamGauge, GTAFleet, EnergySourceBar, PressureHeartbeat, ActionFeed } from '@/components/monitoring';
import { useLiveData } from '@/lib/api';

/**
 * Energy Copilot - High-Density Industrial Control Room
 * 
 * SCADA-style interface with:
 * - Live Asset Synoptic (Critical Steam Gauge + GTA Fleet)
 * - Real-time pressure stability monitoring
 * - Energy source mix visualization
 * - Live event feed with AI insights
 */

const ControlRoomHeader: React.FC<{
  onOptimize?: () => void;
  costRate: number;
  efficiency: number;
  pressure: number;
  blendedCost: number;
}> = ({ onOptimize, costRate, efficiency, pressure, blendedCost }) => {
  const isPressureCritical = pressure < 8.5;
  const isEfficiencyGood = efficiency > 85;
  const [currentTime, setCurrentTime] = React.useState<string | null>(null);

  React.useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString());
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-16 bg-ocp-900/80 backdrop-blur-md border-b border-ocp-400/30 px-6 flex items-center justify-between">
      {/* Left: Branding */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-ocp-accent to-ocp-500 rounded-lg flex items-center justify-center">
            <Icon name="dashboard-tab" size={16} color="inverse" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-ocp-cream">Energy Copilot</h1>
            <p className="text-[10px] text-ocp-300">Industrial Control Room</p>
          </div>
        </div>

        <div className="h-6 w-px bg-ocp-400/30" />

        <button
          onClick={onOptimize}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium transition-all rounded-lg bg-ocp-800 text-ocp-cream-muted hover:bg-ocp-700 hover:text-ocp-cream border border-ocp-400/30 hover:border-ocp-accent"
        >
          <Icon name="settings" size={16} color="accent" />
          <span>Optimize</span>
        </button>
      </div>

      {/* Center: Global KPIs */}
      <div className="flex items-center gap-6">
        {/* Cost Rate */}
        <div className="flex flex-col items-center">
          <div className="text-[10px] text-ocp-300 uppercase tracking-wide mb-0.5">Cost Rate</div>
          <div className="text-2xl font-mono font-bold text-ocp-cream">
            {(costRate / 1000).toFixed(0)}
            <span className="text-xs text-ocp-300 ml-1">k DH/h</span>
          </div>
        </div>

        <div className="h-10 w-px bg-ocp-400/20" />

        {/* Blended Steam Cost */}
        <div className="flex flex-col items-center">
          <div className="text-[10px] text-ocp-300 uppercase tracking-wide mb-0.5">Steam Cost</div>
          <div className={`text-2xl font-mono font-bold ${blendedCost < 100 ? 'text-status-success' : 'text-status-warning'}`}>
            {blendedCost.toFixed(0)}
            <span className="text-xs text-ocp-300 ml-1">DH/T</span>
          </div>
        </div>

        <div className="h-10 w-px bg-ocp-400/20" />

        {/* Efficiency */}
        <div className="flex flex-col items-center">
          <div className="text-[10px] text-ocp-300 uppercase tracking-wide mb-0.5">Efficiency</div>
          <div className={`text-2xl font-mono font-bold ${isEfficiencyGood ? 'text-status-success' : 'text-status-warning'}`}>
            {efficiency.toFixed(1)}
            <span className="text-xs text-ocp-300 ml-1">%</span>
          </div>
        </div>

        <div className="h-10 w-px bg-ocp-400/20" />

        {/* MP Pressure */}
        <div className="flex flex-col items-center">
          <div className="text-[10px] text-ocp-300 uppercase tracking-wide mb-0.5">MP Pressure</div>
          <div className={`text-2xl font-mono font-bold ${
            isPressureCritical ? 'text-status-danger animate-pulse' : 
            pressure < 9.0 ? 'text-status-warning' : 
            'text-status-success'
          }`}>
            {pressure.toFixed(2)}
            <span className="text-xs text-ocp-300 ml-1">bar</span>
          </div>
        </div>
      </div>

      {/* Right: Status */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-status-success-muted border border-status-success/30 rounded-lg">
          <div className="w-2 h-2 rounded-full bg-status-success animate-pulse" />
          <span className="text-xs font-medium text-status-success">Live</span>
        </div>
        <div className="text-[10px] text-ocp-400 font-mono">
          {currentTime ?? '--:--:--'}
        </div>
      </div>
    </header>
  );
};

export default function ControlRoomDashboard() {
  const { liveData, isLoading, error, refresh } = useLiveData(5000);

  const handleNavigateToOptimize = () => {
    window.location.href = '/optimize';
  };

  // Calculate KPIs
  const calculateCostRate = () => {
    if (!liveData) return 0;
    return liveData.cost_per_hour;
  };

  const calculateBlendedCost = () => {
    if (!liveData) return 0;
    return liveData.steam_economics?.blended_cost_per_ton || 0;
  };

  const getEfficiency = () => {
    if (!liveData) return 0;
    return liveData.efficiency_percent;
  };

  const getPressure = () => {
    if (!liveData || !liveData.mp_pressure) return 8.5;
    return liveData.mp_pressure;
  };

  if (isLoading && !liveData) {
    return (
      <div className="h-screen flex items-center justify-center bg-ocp-950">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-ocp-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-ocp-300">Initializing Control Room...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-ocp-950 text-ocp-cream">
      {/* Top Bar - Fixed 64px */}
      <ControlRoomHeader
        onOptimize={handleNavigateToOptimize}
        costRate={calculateCostRate()}
        efficiency={getEfficiency()}
        pressure={getPressure()}
        blendedCost={calculateBlendedCost()}
      />

      {/* Main Content - Dense Grid */}
      <div className="flex-1 p-4 overflow-hidden">
        <div className="h-full grid grid-cols-12 gap-4">
          
          {/* LEFT PANEL: Live Asset Synoptic (Cols 1-9) */}
          <div className="col-span-9 grid grid-rows-[1fr_auto] gap-4">
            
            {/* ROW 1: Steam Monitor (4 cols) + GTA Fleet (8 cols) */}
            <div className="grid grid-cols-12 gap-4">
              
              {/* Critical Steam Gauge */}
              <div className="col-span-4">
                {liveData ? (
                  <CriticalSteamGauge
                    pressure={liveData.mp_pressure || 8.5}
                    minValue={0}
                    maxValue={15}
                    criticalThreshold={8.5}
                  />
                ) : (
                  <div className="bg-ocp-900/50 rounded-lg border border-ocp-400/30 h-full flex items-center justify-center">
                    <p className="text-ocp-300 text-sm">Loading gauge...</p>
                  </div>
                )}
              </div>

              {/* GTA Fleet Status */}
              <div className="col-span-8">
                {liveData ? (
                  <GTAFleet
                    gta1={{
                      name: 'GTA 1',
                      power: liveData.gta_operations.gta1.power,
                      steam: liveData.gta_operations.gta1.soutirage,
                      admission: liveData.gta_operations.gta1.admission,
                      status: liveData.gta_operations.gta1.power > 1 ? 'ON' : 'OFF'
                    }}
                    gta2={{
                      name: 'GTA 2',
                      power: liveData.gta_operations.gta2.power,
                      steam: liveData.gta_operations.gta2.soutirage,
                      admission: liveData.gta_operations.gta2.admission,
                      status: liveData.gta_operations.gta2.power > 1 ? 'ON' : 'OFF'
                    }}
                    gta3={{
                      name: 'GTA 3',
                      power: liveData.gta_operations.gta3.power,
                      steam: liveData.gta_operations.gta3.soutirage,
                      admission: liveData.gta_operations.gta3.admission,
                      status: liveData.gta_operations.gta3.power > 1 ? 'ON' : 'OFF'
                    }}
                  />
                ) : (
                  <div className="bg-ocp-900/50 rounded-lg border border-ocp-400/30 h-full flex items-center justify-center">
                    <p className="text-ocp-300 text-sm">Loading GTA fleet...</p>
                  </div>
                )}
              </div>
            </div>

            {/* ROW 2: Energy Source Mix (Full Width) */}
            {liveData && (
              <EnergySourceBar
                sulfurSteam={liveData.steam_economics?.source_breakdown.sulfur_tons || 0}
                gtaSteam={liveData.steam_economics?.source_breakdown.gta_tons || 0}
                boilerSteam={liveData.steam_economics?.source_breakdown.boiler_tons || 0}
              />
            )}
          </div>

          {/* RIGHT PANEL: Status & Alerts (Cols 10-12) */}
          <div className="col-span-3 space-y-4 overflow-y-auto">
            
            {/* Pressure Heartbeat */}
            {liveData && (
              <PressureHeartbeat
                currentPressure={liveData.mp_pressure || 8.5}
                criticalThreshold={8.5}
              />
            )}

            {/* GTA Status Compact */}
            <div className="bg-ocp-900/50 backdrop-blur-md border border-ocp-400/30 rounded-lg p-3">
              <div className="text-xs font-semibold text-ocp-300 uppercase tracking-wide mb-3">
                Power Generation
              </div>
              <div className="space-y-2">
                {/* GTA 1 */}
                <div className="flex items-center justify-between p-2 bg-ocp-800/50 rounded">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" />
                    <span className="text-xs text-ocp-300">GTA 1</span>
                  </div>
                  <div className="text-sm font-mono font-bold text-status-info">
                    {liveData?.gta_operations.gta1.power.toFixed(1) || '0.0'}
                    <span className="text-[10px] text-ocp-400 ml-1">MW</span>
                  </div>
                </div>

                {/* GTA 2 */}
                <div className="flex items-center justify-between p-2 bg-ocp-800/50 rounded">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" />
                    <span className="text-xs text-ocp-300">GTA 2</span>
                  </div>
                  <div className="text-sm font-mono font-bold text-status-info">
                    {liveData?.gta_operations.gta2.power.toFixed(1) || '0.0'}
                    <span className="text-[10px] text-ocp-400 ml-1">MW</span>
                  </div>
                </div>

                {/* GTA 3 */}
                <div className="flex items-center justify-between p-2 bg-ocp-800/50 rounded">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-status-success animate-pulse" />
                    <span className="text-xs text-ocp-300">GTA 3</span>
                  </div>
                  <div className="text-sm font-mono font-bold text-status-info">
                    {liveData?.gta_operations.gta3.power.toFixed(1) || '0.0'}
                    <span className="text-[10px] text-ocp-400 ml-1">MW</span>
                  </div>
                </div>

                {/* Total */}
                <div className="flex items-center justify-between p-2 bg-ocp-accent/10 rounded border border-ocp-accent/30 mt-2">
                  <span className="text-xs font-semibold text-ocp-accent">Total</span>
                  <div className="text-lg font-mono font-bold text-ocp-accent">
                    {liveData?.total_power_generated.toFixed(1) || '0.0'}
                    <span className="text-[10px] ml-1">MW</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Steam Economics Compact */}
            <div className="bg-ocp-900/50 backdrop-blur-md border border-ocp-400/30 rounded-lg p-3">
              <div className="text-xs font-semibold text-ocp-300 uppercase tracking-wide mb-3">
                Steam Source Mix
              </div>
              {liveData && (
                <div className="space-y-2">
                  {/* Sulfur (Free) */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-status-success" />
                      <span className="text-xs text-ocp-300">Sulfur (Free)</span>
                    </div>
                    <div className="text-xs font-mono font-bold text-status-success">
                      {liveData.steam_economics?.source_breakdown.sulfur_percent.toFixed(0)}%
                    </div>
                  </div>

                  {/* GTA Extraction */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-status-info" />
                      <span className="text-xs text-ocp-300">GTA Extract</span>
                    </div>
                    <div className="text-xs font-mono font-bold text-status-info">
                      {liveData.steam_economics?.source_breakdown.gta_percent.toFixed(0)}%
                    </div>
                  </div>

                  {/* Boiler (Expensive) */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-status-danger" />
                      <span className="text-xs text-ocp-300">Boiler (284 DH/T)</span>
                    </div>
                    <div className={`text-xs font-mono font-bold ${
                      liveData.steam_economics?.source_breakdown.boiler_percent > 0 ? 'text-status-danger' : 'text-ocp-400'
                    }`}>
                      {liveData.steam_economics?.source_breakdown.boiler_percent.toFixed(0)}%
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Action Feed */}
            {liveData && (
              <div className="h-[calc(100vh-650px)] min-h-[300px]">
                <ActionFeed
                  mpPressure={liveData.mp_pressure || 8.5}
                  boilerActive={liveData.boiler_usage_estimated > 0}
                  gridImport={liveData.grid_import_estimated}
                  efficiency={liveData.efficiency_percent}
                  blendedCost={liveData.steam_economics?.blended_cost_per_ton || 0}
                />
              </div>
            )}
          </div>

          {/* Error Display */}
          {error && (
            <div className="col-span-12 bg-status-danger-muted border border-status-danger/30 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <div className="text-status-danger text-sm">⚠️</div>
                <div>
                  <div className="text-status-danger font-semibold text-sm">Connection Error</div>
                  <div className="text-status-danger/80 text-xs mt-1">{error}</div>
                  <button
                    onClick={refresh}
                    className="mt-2 text-xs text-status-danger underline hover:text-status-danger/80"
                  >
                    Retry Connection
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
