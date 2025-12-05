'use client';

import React, { useState, useEffect } from 'react';
import { Icon } from '@/components/ui';
import { ScenarioBuilder, SimulationResults } from '@/components/optimization';
import { useOptimization, energyAPI, type OptimizationRequest } from '@/lib/api';

/**
 * Energy Copilot - Simulation Lab
 * 
 * "What-If" analysis platform for plant optimization.
 * Split-screen design: Scenario Configuration (left) + Simulation Results (right).
 */

interface ScenarioConfig {
  steamDemand: number;
  electricityDemand: number;
  gridPeriod: 'off-peak' | 'peak';
  sulfurSupply: 100 | 50 | 0;
  gta1Available: boolean;
  gta2Available: boolean;
  gta3Available: boolean;
}

/**
 * Dashboard Header Component
 */
const DashboardHeader: React.FC<{ 
  onChat?: () => void;
  onDashboard?: () => void;
  apiConnected: boolean;
}> = ({ onChat, onDashboard, apiConnected }) => {
  const [currentTime, setCurrentTime] = useState<string | null>(null);

  useEffect(() => {
    setCurrentTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="flex items-center justify-between px-4 py-2.5 bg-ocp-900 text-ocp-cream shadow-lg border-b border-ocp-400/30">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-ocp-accent to-ocp-500 rounded-lg flex items-center justify-center shadow-lg">
            <Icon name="dashboard-tab" size={20} color="inverse" />
          </div>
          <span className="text-lg font-bold">Energy Copilot</span>
          <span className="px-2 py-0.5 bg-ocp-500/20 text-ocp-300 text-xs font-semibold rounded border border-ocp-500/30">
            SIMULATION LAB
          </span>
        </div>
        
        {/* Status Indicator */}
        <div className="flex items-center gap-2 px-3 py-1 bg-ocp-800 rounded-lg border border-ocp-400/30">
          <div className={`w-2 h-2 rounded-full ${apiConnected ? 'bg-ocp-accent animate-pulse' : 'bg-status-danger'}`}></div>
          <span className="text-xs text-ocp-300">
            {apiConnected ? 'Backend Online' : 'Backend Offline'}
          </span>
        </div>
        
        {/* Navigation */}
        <div className="flex items-center gap-1">
          <button 
            onClick={onChat}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all rounded-lg text-ocp-cream-muted hover:bg-ocp-800 hover:text-ocp-cream"
          >
            <Icon name="agent-selector" size={16} />
            <span>Chat</span>
          </button>
          <button 
            onClick={onDashboard}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all rounded-lg text-ocp-cream-muted hover:bg-ocp-800 hover:text-ocp-cream"
          >
            <Icon name="dashboard-tab" size={16} />
            <span>Monitoring</span>
          </button>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="text-sm text-ocp-300">
          {currentTime ?? '--:--'}
        </div>
      </div>
    </header>
  );
};

/**
 * Empty State Component (before simulation)
 */
const EmptyState: React.FC = () => {
  return (
    <div className="h-full flex items-center justify-center bg-ocp-900 rounded-lg border border-ocp-400/30">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-gradient-to-br from-ocp-accent/20 to-ocp-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-ocp-400/30">
          <Icon name="dashboard-tab" size={32} color="accent" />
        </div>
        <h3 className="text-2xl font-bold text-ocp-cream mb-3">
          Ready for Simulation
        </h3>
        <p className="text-ocp-300 mb-6">
          Configure your scenario on the left, then click <strong className="text-ocp-accent">&quot;RUN SIMULATION&quot;</strong> to see optimized results and cost savings.
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-ocp-400">
          <div className="flex items-center gap-2">
            <Icon name="star" size={16} color="accent" />
            <span>Financial Impact</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="dashboard-tab" size={16} color="accent" />
            <span>Source Mix</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon name="commands" size={16} color="accent" />
            <span>Action Plan</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Main Simulation Lab Page Component
 */
export default function SimulationLab() {
  const { optimize, isLoading, error, result } = useOptimization();
  const [apiConnected, setApiConnected] = useState(false);
  const [currentConfig, setCurrentConfig] = useState<ScenarioConfig | null>(null);

  // Check API connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        await energyAPI.healthCheck();
        setApiConnected(true);
      } catch {
        setApiConnected(false);
      }
    };
    checkConnection();
  }, []);

  // Handle simulation run
  const handleRunSimulation = async (config: ScenarioConfig) => {
    setCurrentConfig(config);

    // Build optimization request
    const request: OptimizationRequest = {
      elec_demand: config.electricityDemand,
      steam_demand: config.steamDemand,
      hour: config.gridPeriod === 'peak' ? 19 : 14, // Peak hours (17-22) or off-peak
      constraints: {},
      verbose: false
    };

    // Apply GTA availability constraints
    if (!config.gta1Available) {
      request.constraints!['gta1_status'] = 'OFF';
    }
    if (!config.gta2Available) {
      request.constraints!['gta2_status'] = 'OFF';
    }
    if (!config.gta3Available) {
      request.constraints!['gta3_status'] = 'OFF';
    }

    // Apply sulfur supply constraint
    if (config.sulfurSupply === 0) {
      request.constraints!['sulfur_max'] = 0;
    } else if (config.sulfurSupply === 50) {
      request.constraints!['sulfur_max'] = 50;
    }

    try {
      await optimize(request);
    } catch (err) {
      console.error('Optimization failed:', err);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-ocp-950">
      {/* Header */}
      <DashboardHeader 
        onChat={() => window.location.href = '/test/chat'}
        onDashboard={() => window.location.href = '/dashboard'}
        apiConnected={apiConnected}
      />
      
      {/* Main Content: Split-Screen Layout */}
      <div className="flex-1 overflow-hidden p-6">
        <div className="h-full grid grid-cols-12 gap-6">
          {/* Left Panel: Scenario Configuration (4 columns) */}
          <div className="col-span-4 overflow-hidden">
            <ScenarioBuilder 
              onRunSimulation={handleRunSimulation}
              isSimulating={isLoading}
            />
          </div>

          {/* Right Panel: Simulation Results (8 columns) */}
          <div className="col-span-8 overflow-y-auto">
            {!result ? (
              <EmptyState />
            ) : error ? (
              <div className="h-full flex items-center justify-center bg-ocp-900 rounded-lg border border-status-danger/30">
                <div className="text-center max-w-md">
                  <div className="w-16 h-16 bg-status-danger-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon name="minus" size={32} color="secondary" />
                  </div>
                  <h3 className="text-xl font-bold text-ocp-cream mb-2">Simulation Failed</h3>
                  <p className="text-status-danger text-sm">{error}</p>
                </div>
              </div>
            ) : (
              <SimulationResults 
                result={result}
                config={{
                  steamDemand: currentConfig?.steamDemand || 0,
                  electricityDemand: currentConfig?.electricityDemand || 0
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
