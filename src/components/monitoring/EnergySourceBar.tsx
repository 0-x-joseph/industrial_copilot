'use client';

import React from 'react';

interface EnergySourceBarProps {
  sulfurSteam: number;
  gtaSteam: number;
  boilerSteam: number;
}

export const EnergySourceBar: React.FC<EnergySourceBarProps> = ({
  sulfurSteam,
  gtaSteam,
  boilerSteam
}) => {
  const totalSteam = sulfurSteam + gtaSteam + boilerSteam;
  
  const sulfurPercent = totalSteam > 0 ? (sulfurSteam / totalSteam) * 100 : 0;
  const gtaPercent = totalSteam > 0 ? (gtaSteam / totalSteam) * 100 : 0;
  const boilerPercent = totalSteam > 0 ? (boilerSteam / totalSteam) * 100 : 0;

  const freeEnergyPercent = sulfurPercent; // Sulfur is free
  const isFreeEnergyDominant = freeEnergyPercent > 50;
  const isBoilerActive = boilerPercent > 0;

  const getFinancialState = () => {
    if (freeEnergyPercent > 80) return 'Excellent';
    if (freeEnergyPercent > 50) return 'Good';
    if (freeEnergyPercent > 20) return 'Fair';
    return 'Poor';
  };

  const getStateColor = () => {
    if (freeEnergyPercent > 80) return 'text-ocp-accent';
    if (freeEnergyPercent > 50) return 'text-status-info';
    if (freeEnergyPercent > 20) return 'text-status-warning';
    return 'text-status-danger';
  };

  return (
    <div className="bg-ocp-900/50 backdrop-blur-md border border-ocp-400/30 rounded-lg p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-ocp-300 uppercase tracking-wide">
            Energy Source Mix
          </h3>
          <p className="text-[10px] text-ocp-400 mt-0.5">
            Total Steam Production: <span className="text-ocp-300 font-mono font-bold">{totalSteam.toFixed(0)} T/h</span>
          </p>
        </div>
        <div className={`px-3 py-1 rounded ${
          isFreeEnergyDominant 
            ? 'bg-ocp-accent/20 text-ocp-accent border border-ocp-accent/50' 
            : 'bg-status-warning-muted text-status-warning border border-status-warning/50'
        }`}>
          <span className="text-xs font-bold">
            {getFinancialState()} Energy Mix
          </span>
        </div>
      </div>

      {/* Horizontal Stacked Bar */}
      <div className="relative h-16 bg-ocp-800/50 rounded-lg overflow-hidden mb-3">
        <div className="absolute inset-0 flex">
          {/* Sulfur Segment (Sage Green - Free) */}
          <div 
            className="relative bg-gradient-to-r from-ocp-accent to-ocp-accent-hover transition-all duration-1000"
            style={{ width: `${sulfurPercent}%` }}
          >
            {sulfurPercent > 10 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <div className="text-xs font-bold drop-shadow-lg">{sulfurPercent.toFixed(0)}%</div>
                <div className="text-[9px] font-semibold drop-shadow-lg">Sulfur</div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ocp-accent/30 to-transparent" />
          </div>

          {/* GTA Segment (Blue - Extracted) */}
          <div 
            className="relative bg-gradient-to-r from-status-info to-status-info/80 transition-all duration-1000"
            style={{ width: `${gtaPercent}%` }}
          >
            {gtaPercent > 10 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <div className="text-xs font-bold drop-shadow-lg">{gtaPercent.toFixed(0)}%</div>
                <div className="text-[9px] font-semibold drop-shadow-lg">GTA</div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-status-info/30 to-transparent" />
          </div>

          {/* Boiler Segment (Rose - Expensive) */}
          <div 
            className="relative bg-gradient-to-r from-status-danger to-status-danger/80 transition-all duration-1000"
            style={{ width: `${boilerPercent}%` }}
          >
            {boilerPercent > 5 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <div className="text-xs font-bold drop-shadow-lg">{boilerPercent.toFixed(0)}%</div>
                <div className="text-[9px] font-semibold drop-shadow-lg">Boiler</div>
              </div>
            )}
            {boilerPercent > 0 && (
              <div className="absolute inset-0 bg-gradient-to-t from-status-danger/30 to-transparent animate-pulse" />
            )}
          </div>
        </div>
      </div>

      {/* Financial State Overlay */}
      <div className="flex items-center justify-between text-sm">
        <div className={`font-bold ${getStateColor()}`}>
          Running on <span className="text-2xl">{freeEnergyPercent.toFixed(0)}%</span> Free Energy
        </div>
        {isBoilerActive && (
          <div className="flex items-center gap-2 px-2 py-1 bg-status-danger-muted border border-status-danger/50 rounded text-xs text-status-danger">
            <div className="w-2 h-2 rounded-full bg-status-danger animate-pulse" />
            <span>Boiler Active (+284 DH/T)</span>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-3 pt-3 border-t border-ocp-400/30 flex items-center justify-between text-[10px]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-ocp-accent" />
            <span className="text-ocp-300">
              Sulfur Recovery: <span className="text-ocp-accent font-mono font-bold">{sulfurSteam.toFixed(0)} T/h</span>
              <span className="text-ocp-400 ml-1">(20 DH/T)</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-status-info" />
            <span className="text-ocp-300">
              GTA Extraction: <span className="text-status-info font-mono font-bold">{gtaSteam.toFixed(0)} T/h</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-status-danger" />
            <span className="text-ocp-300">
              Aux Boiler: <span className="text-status-danger font-mono font-bold">{boilerSteam.toFixed(0)} T/h</span>
              <span className="text-ocp-400 ml-1">(284 DH/T)</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
