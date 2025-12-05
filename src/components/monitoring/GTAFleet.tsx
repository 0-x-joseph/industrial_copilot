'use client';

import React from 'react';

interface GTAData {
  name: string;
  power: number;
  steam: number;
  admission: number;
  status: 'ON' | 'OFF';
  load?: number;
}

interface GTAFleetProps {
  gta1: GTAData;
  gta2: GTAData;
  gta3: GTAData;
}

const GTACard: React.FC<{ gta: GTAData }> = ({ gta }) => {
  const isRunning = gta.status === 'ON';
  const efficiency = gta.steam > 0 ? gta.power / gta.steam : 0;
  const maxPower = 40; // MW
  const maxSteam = 200; // T/h
  
  const powerPercent = Math.min(100, (gta.power / maxPower) * 100);
  const steamPercent = Math.min(100, (gta.steam / maxSteam) * 100);

  return (
    <div className={`
      bg-ocp-900/50 backdrop-blur-md border rounded-lg p-4 
      transition-all duration-300 border-ocp-400/30
      ${isRunning ? 'border-l-4 border-l-ocp-accent' : 'border-l-4 border-l-ocp-600'}
    `}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {/* Turbine Icon */}
          <div className={`w-8 h-8 rounded-lg bg-status-info/10 flex items-center justify-center ${
            isRunning ? 'animate-pulse' : ''
          }`}>
            <svg 
              className={`w-5 h-5 ${isRunning ? 'text-status-info' : 'text-ocp-400'}`}
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L8 6h3v5H8l4 4 4-4h-3V6h3l-4-4zm0 20l4-4h-3v-5h3l-4-4-4 4h3v5H8l4 4z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-bold text-ocp-cream">{gta.name}</h4>
            <p className="text-[10px] text-ocp-400">Turbo-Alternator</p>
          </div>
        </div>
        <div className={`w-3 h-3 rounded-full ${
          isRunning ? 'bg-ocp-accent animate-pulse' : 'bg-ocp-600'
        }`} />
      </div>

      {/* Progress Bars */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Power Bar */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-ocp-400 uppercase">Power</span>
            <span className="text-xs font-mono font-bold text-status-info">{gta.power.toFixed(1)}</span>
          </div>
          <div className="h-24 bg-ocp-800/50 rounded-lg overflow-hidden relative">
            <div 
              className="absolute bottom-0 w-full bg-gradient-to-t from-status-info to-status-info/70 transition-all duration-500"
              style={{ height: `${powerPercent}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-status-info/50 to-transparent animate-pulse" />
            </div>
            <div className="absolute inset-0 flex items-end justify-center pb-2">
              <span className="text-[10px] font-mono font-bold text-white drop-shadow-lg">
                {powerPercent.toFixed(0)}%
              </span>
            </div>
          </div>
          <div className="text-center text-[10px] text-ocp-400 mt-1">MW</div>
        </div>

        {/* Steam Bar */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-ocp-400 uppercase">Steam Out</span>
            <span className="text-xs font-mono font-bold text-ocp-accent">{gta.steam.toFixed(1)}</span>
          </div>
          <div className="h-24 bg-ocp-800/50 rounded-lg overflow-hidden relative">
            <div 
              className="absolute bottom-0 w-full bg-gradient-to-t from-ocp-accent to-ocp-accent/70 transition-all duration-500"
              style={{ height: `${steamPercent}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-ocp-accent/50 to-transparent animate-pulse" />
            </div>
            <div className="absolute inset-0 flex items-end justify-center pb-2">
              <span className="text-[10px] font-mono font-bold text-white drop-shadow-lg">
                {steamPercent.toFixed(0)}%
              </span>
            </div>
          </div>
          <div className="text-center text-[10px] text-ocp-400 mt-1">T/h</div>
        </div>
      </div>

      {/* Footer - Efficiency KPI */}
      <div className="pt-3 border-t border-ocp-400/30">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-ocp-400 uppercase">Efficiency</span>
          <div className="flex items-center gap-2">
            <span className={`text-sm font-mono font-bold ${
              efficiency > 0.2 ? 'text-ocp-accent' : 'text-ocp-400'
            }`}>
              {efficiency.toFixed(2)}
            </span>
            <span className="text-[10px] text-ocp-400">MW/T</span>
          </div>
        </div>
        <div className="mt-1 text-[10px] text-ocp-400">
          Admission: <span className="text-ocp-300 font-mono">{gta.admission.toFixed(0)} T/h</span>
        </div>
      </div>
    </div>
  );
};

export const GTAFleet: React.FC<GTAFleetProps> = ({ gta1, gta2, gta3 }) => {
  const totalPower = gta1.power + gta2.power + gta3.power;
  const activeCount = [gta1, gta2, gta3].filter(g => g.status === 'ON').length;

  return (
    <div className="h-full flex flex-col">
      {/* Fleet Header */}
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-ocp-300 uppercase tracking-wide">
            GTA Fleet Status
          </h3>
          <p className="text-[10px] text-ocp-400">
            {activeCount}/3 Active • Total Output: <span className="text-ocp-accent font-mono font-bold">{totalPower.toFixed(1)} MW</span>
          </p>
        </div>
      </div>

      {/* GTA Grid */}
      <div className="grid grid-cols-3 gap-3 flex-1">
        <GTACard gta={gta1} />
        <GTACard gta={gta2} />
        <GTACard gta={gta3} />
      </div>
    </div>
  );
};
