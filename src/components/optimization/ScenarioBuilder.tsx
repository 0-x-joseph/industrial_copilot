'use client';

import React, { useState } from 'react';
import { Icon } from '@/components/ui';

/**
 * ScenarioBuilder Component
 * 
 * Left sidebar for configuring simulation parameters.
 * Includes presets, demand sliders, context toggles, and machine availability.
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

interface Preset {
  name: string;
  icon: string;
  config: ScenarioConfig;
}

interface ScenarioBuilderProps {
  onRunSimulation: (config: ScenarioConfig) => void;
  isSimulating: boolean;
}

const PRESETS: Preset[] = [
  {
    name: 'Standard Run',
    icon: 'dashboard-tab',
    config: {
      steamDemand: 250,
      electricityDemand: 60,
      gridPeriod: 'off-peak',
      sulfurSupply: 100,
      gta1Available: true,
      gta2Available: true,
      gta3Available: true,
    }
  },
  {
    name: 'Sulfur Drop',
    icon: 'warning',
    config: {
      steamDemand: 250,
      electricityDemand: 60,
      gridPeriod: 'off-peak',
      sulfurSupply: 50,
      gta1Available: true,
      gta2Available: true,
      gta3Available: true,
    }
  },
  {
    name: 'GTA Failure',
    icon: 'error',
    config: {
      steamDemand: 250,
      electricityDemand: 60,
      gridPeriod: 'peak',
      sulfurSupply: 100,
      gta1Available: false,
      gta2Available: true,
      gta3Available: true,
    }
  },
  {
    name: 'Max Production',
    icon: 'dashboard-tab',
    config: {
      steamDemand: 380,
      electricityDemand: 95,
      gridPeriod: 'off-peak',
      sulfurSupply: 100,
      gta1Available: true,
      gta2Available: true,
      gta3Available: true,
    }
  }
];

export const ScenarioBuilder: React.FC<ScenarioBuilderProps> = ({ 
  onRunSimulation, 
  isSimulating 
}) => {
  const [config, setConfig] = useState<ScenarioConfig>(PRESETS[0].config);
  const [activePreset, setActivePreset] = useState(0);

  const handlePresetClick = (index: number) => {
    setActivePreset(index);
    setConfig(PRESETS[index].config);
  };

  const updateConfig = (updates: Partial<ScenarioConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
    setActivePreset(-1); // Clear preset selection when manually editing
  };

  return (
    <div className="h-full flex flex-col bg-ocp-900 rounded-lg border border-ocp-400/30">
      {/* Header */}
      <div className="p-6 border-b border-ocp-400/30">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-ocp-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="settings" size={20} color="accent" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-ocp-cream">Scenario Configuration</h2>
            <p className="text-sm text-ocp-300">Define the problem</p>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Presets */}
        <div>
          <h3 className="text-sm font-semibold text-ocp-300 mb-3 uppercase tracking-wide">
            Quick Presets
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {PRESETS.map((preset, index) => (
              <button
                key={preset.name}
                onClick={() => handlePresetClick(index)}
                className={`
                  p-3 rounded-lg border transition-all
                  ${activePreset === index 
                    ? 'bg-ocp-accent/20 border-ocp-accent/50 text-ocp-accent' 
                    : 'bg-ocp-800/50 border-ocp-400/30 text-ocp-300 hover:border-ocp-400/50'
                  }
                `}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon name={preset.icon as any} size={16} />
                  <span className="text-sm font-medium">{preset.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Factory Demand */}
        <div>
          <h3 className="text-sm font-semibold text-ocp-300 mb-4 uppercase tracking-wide flex items-center gap-2">
            <Icon name="dashboard-tab" size={16} color="accent" />
            Factory Demand
          </h3>
          
          {/* Steam Demand Slider */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-ocp-cream-muted">
                Target Steam (MP)
              </label>
              <span className="text-2xl font-bold font-mono text-ocp-accent">
                {config.steamDemand}
                <span className="text-sm text-ocp-400 ml-1">T/h</span>
              </span>
            </div>
            <input
              type="range"
              min={100}
              max={400}
              step={10}
              value={config.steamDemand}
              onChange={(e) => updateConfig({ steamDemand: parseInt(e.target.value) })}
              className="w-full h-2 bg-ocp-700 rounded-lg appearance-none cursor-pointer accent-ocp-accent"
            />
            <div className="flex justify-between text-xs text-ocp-400 mt-1">
              <span>100</span>
              <span>400 T/h</span>
            </div>
          </div>

          {/* Electricity Demand Slider */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-ocp-cream-muted">
                Target Electricity
              </label>
              <span className="text-2xl font-bold font-mono text-status-info">
                {config.electricityDemand}
                <span className="text-sm text-ocp-400 ml-1">MW</span>
              </span>
            </div>
            <input
              type="range"
              min={20}
              max={100}
              step={5}
              value={config.electricityDemand}
              onChange={(e) => updateConfig({ electricityDemand: parseInt(e.target.value) })}
              className="w-full h-2 bg-ocp-700 rounded-lg appearance-none cursor-pointer accent-status-info"
            />
            <div className="flex justify-between text-xs text-ocp-400 mt-1">
              <span>20</span>
              <span>100 MW</span>
            </div>
          </div>
        </div>

        {/* External Conditions */}
        <div>
          <h3 className="text-sm font-semibold text-ocp-300 mb-4 uppercase tracking-wide flex items-center gap-2">
            <Icon name="workspace" size={16} color="accent" />
            External Conditions
          </h3>

          {/* Grid Period Toggle */}
          <div className="mb-4">
            <label className="text-sm font-medium text-ocp-cream-muted mb-2 block">
              Grid Period
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => updateConfig({ gridPeriod: 'off-peak' })}
                className={`
                  px-4 py-3 rounded-lg border transition-all text-sm font-medium
                  ${config.gridPeriod === 'off-peak'
                    ? 'bg-ocp-accent/20 border-ocp-accent/50 text-ocp-accent'
                    : 'bg-ocp-800/50 border-ocp-400/30 text-ocp-300 hover:border-ocp-400/50'
                  }
                `}
              >
                <div className="flex items-center justify-center gap-2">
                  <span>Off-Peak</span>
                  <div className="text-xs opacity-70">0.55 DH/kWh</div>
                </div>
              </button>
              <button
                onClick={() => updateConfig({ gridPeriod: 'peak' })}
                className={`
                  px-4 py-3 rounded-lg border transition-all text-sm font-medium
                  ${config.gridPeriod === 'peak'
                    ? 'bg-status-danger-muted border-status-danger/50 text-status-danger'
                    : 'bg-ocp-800/50 border-ocp-400/30 text-ocp-300 hover:border-ocp-400/50'
                  }
                `}
              >
                <div className="flex items-center justify-center gap-2">
                  <span>Peak</span>
                  <div className="text-xs opacity-70">1.27 DH/kWh</div>
                </div>
              </button>
            </div>
          </div>

          {/* Sulfur Supply Toggle */}
          <div>
            <label className="text-sm font-medium text-ocp-cream-muted mb-2 block">
              Sulfur Supply (Free Steam Source)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[100, 50, 0].map((level) => (
                <button
                  key={level}
                  onClick={() => updateConfig({ sulfurSupply: level as 100 | 50 | 0 })}
                  className={`
                    px-3 py-2 rounded-lg border transition-all text-sm font-medium
                    ${config.sulfurSupply === level
                      ? 'bg-ocp-accent/20 border-ocp-accent/50 text-ocp-accent'
                      : 'bg-ocp-800/50 border-ocp-400/30 text-ocp-300 hover:border-ocp-400/50'
                    }
                  `}
                >
                  {level}%
                </button>
              ))}
            </div>
            <div className="mt-2 text-xs text-ocp-300">
              {config.sulfurSupply === 100 && 'Normal (100 T/h max)'}
              {config.sulfurSupply === 50 && 'Low Supply (50 T/h max)'}
              {config.sulfurSupply === 0 && 'Sulfur Offline (0 T/h)'}
            </div>
          </div>
        </div>

        {/* Machine Availability */}
        <div>
          <h3 className="text-sm font-semibold text-ocp-300 mb-4 uppercase tracking-wide flex items-center gap-2">
            <Icon name="agent-selector" size={16} color="accent" />
            Machine Availability
          </h3>
          
          <div className="space-y-3">
            {[1, 2, 3].map((num) => {
              const key = `gta${num}Available` as keyof ScenarioConfig;
              const isAvailable = config[key] as boolean;
              
              return (
                <div
                  key={num}
                  className={`
                    flex items-center justify-between p-4 rounded-lg border transition-all
                    ${isAvailable 
                      ? 'bg-ocp-800/50 border-ocp-400/30' 
                      : 'bg-status-danger-muted border-status-danger/30'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon name="agent-selector" size={20} color={isAvailable ? 'accent' : 'secondary'} />
                    <div>
                      <div className="text-sm font-medium text-ocp-cream">GTA {num}</div>
                      <div className="text-xs text-ocp-400">
                        {isAvailable ? 'Available' : 'Maintenance Mode'}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => updateConfig({ [key]: !isAvailable })}
                    className={`
                      relative w-12 h-6 rounded-full transition-colors
                      ${isAvailable ? 'bg-ocp-accent' : 'bg-ocp-600'}
                    `}
                  >
                    <div
                      className={`
                        absolute top-1 w-4 h-4 bg-white rounded-full transition-transform
                        ${isAvailable ? 'translate-x-7' : 'translate-x-1'}
                      `}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer: Run Button */}
      <div className="p-6 border-t border-ocp-400/30">
        <button
          onClick={() => onRunSimulation(config)}
          disabled={isSimulating}
          className={`
            w-full py-4 rounded-lg font-bold text-lg transition-all
            ${isSimulating
              ? 'bg-ocp-700 text-ocp-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-ocp-accent to-ocp-accent-hover text-primary-dark hover:shadow-lg hover:shadow-ocp-accent/30'
            }
          `}
        >
          {isSimulating ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-ocp-400 border-t-transparent rounded-full animate-spin" />
              Running Simulation...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Icon name="send" size={20} />
              RUN SIMULATION
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
