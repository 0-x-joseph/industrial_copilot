'use client';

import React from 'react';

interface CriticalSteamGaugeProps {
  pressure: number;
  minValue?: number;
  maxValue?: number;
  criticalThreshold?: number;
}

export const CriticalSteamGauge: React.FC<CriticalSteamGaugeProps> = ({
  pressure,
  minValue = 0,
  maxValue = 15,
  criticalThreshold = 8.5
}) => {
  // Calculate needle rotation (0deg = left, 180deg = right for semicircle)
  const percentage = Math.max(0, Math.min(100, ((pressure - minValue) / (maxValue - minValue)) * 100));
  const rotation = -90 + (percentage * 180 / 100);

  const isCritical = pressure < criticalThreshold;
  const isWarning = pressure >= criticalThreshold && pressure < 9.0;
  const isOptimal = pressure >= 9.0;

  const getStatusText = () => {
    if (isCritical) return 'CRITICAL';
    if (isWarning) return 'WARNING';
    return 'OPTIMAL';
  };

  const getReliabilityText = () => {
    if (isCritical) return 'Process Reliability: CRITICAL';
    if (isWarning) return 'Process Reliability: Degraded';
    return 'Process Reliability: Stable';
  };

  // Brand-aligned colors
  const criticalColor = '#C47070';  // status-danger
  const warningColor = '#D4A574';   // status-warning
  const successColor = '#A3B087';   // ocp-accent (sage green)

  const getStatusColor = () => {
    if (isCritical) return criticalColor;
    if (isWarning) return warningColor;
    return successColor;
  };

  return (
    <div className="bg-ocp-900/50 backdrop-blur-md border border-ocp-400/30 rounded-lg p-6 h-full flex flex-col">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-ocp-300 uppercase tracking-wide">
            MP Steam Pressure
          </h3>
          <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
            isCritical ? 'bg-status-danger-muted text-status-danger border border-status-danger/50 animate-pulse' :
            isWarning ? 'bg-status-warning-muted text-status-warning border border-status-warning/50' :
            'bg-ocp-accent/20 text-ocp-accent border border-ocp-accent/50'
          }`}>
            {getStatusText()}
          </div>
        </div>
      </div>

      {/* Gauge Container */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative w-64 h-32 mb-6">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 110">
            {/* Background Arc */}
            <defs>
              <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: criticalColor, stopOpacity: 0.3 }} />
                <stop offset="50%" style={{ stopColor: warningColor, stopOpacity: 0.3 }} />
                <stop offset="100%" style={{ stopColor: successColor, stopOpacity: 0.3 }} />
              </linearGradient>
            </defs>

            {/* Background Track */}
            <path
              d="M 20 90 A 80 80 0 0 1 180 90"
              fill="none"
              stroke="#2d313c"
              strokeWidth="20"
              strokeLinecap="round"
            />

            {/* Colored Zone Arc */}
            <path
              d="M 20 90 A 80 80 0 0 1 180 90"
              fill="none"
              stroke="url(#gaugeGradient)"
              strokeWidth="20"
              strokeLinecap="round"
            />

            {/* Active Progress Arc */}
            <path
              d={`M 20 90 A 80 80 0 ${percentage > 50 ? 1 : 0} 1 ${
                100 + 80 * Math.cos((rotation * Math.PI) / 180)
              } ${90 + 80 * Math.sin((rotation * Math.PI) / 180)}`}
              fill="none"
              stroke={getStatusColor()}
              strokeWidth="20"
              strokeLinecap="round"
              className="transition-all duration-1000"
            />

            {/* Threshold Marker */}
            <line
              x1="100"
              y1="90"
              x2={100 + 85 * Math.cos((((criticalThreshold - minValue) / (maxValue - minValue) * 180 - 90) * Math.PI) / 180)}
              y2={90 + 85 * Math.sin((((criticalThreshold - minValue) / (maxValue - minValue) * 180 - 90) * Math.PI) / 180)}
              stroke="#5a6d7a"
              strokeWidth="2"
              strokeDasharray="3 3"
            />

            {/* Center Pivot */}
            <circle cx="100" cy="90" r="8" fill="#435663" />

            {/* Needle */}
            <line
              x1="100"
              y1="90"
              x2="100"
              y2="20"
              stroke={getStatusColor()}
              strokeWidth="4"
              strokeLinecap="round"
              style={{
                transform: `rotate(${rotation}deg)`,
                transformOrigin: '100px 90px',
                transition: 'transform 1s cubic-bezier(0.4, 0.0, 0.2, 1)'
              }}
            />

            {/* Needle Tip */}
            <circle
              cx="100"
              cy="20"
              r="6"
              fill={getStatusColor()}
              style={{
                transform: `rotate(${rotation}deg)`,
                transformOrigin: '100px 90px',
                transition: 'transform 1s cubic-bezier(0.4, 0.0, 0.2, 1)'
              }}
            />

            {/* Scale Labels */}
            <text x="15" y="105" className="text-[10px] fill-ocp-400 font-mono">{minValue}</text>
            <text x="95" y="105" className="text-[10px] fill-ocp-400 font-mono" textAnchor="middle">
              {((minValue + maxValue) / 2).toFixed(0)}
            </text>
            <text x="185" y="105" className="text-[10px] fill-ocp-400 font-mono" textAnchor="end">{maxValue}</text>
          </svg>
        </div>

        {/* Digital Display */}
        <div className="text-center mb-4">
          <div className={`text-5xl font-mono font-bold tabular-nums ${
            isCritical ? 'text-status-danger' :
            isWarning ? 'text-status-warning' :
            'text-ocp-accent'
          }`}>
            {pressure.toFixed(2)}
          </div>
          <div className="text-lg text-ocp-400 font-semibold mt-1">bar</div>
        </div>

        {/* Status Text */}
        <div className={`text-sm font-semibold text-center ${
          isCritical ? 'text-status-danger' :
          isWarning ? 'text-status-warning' :
          'text-ocp-accent'
        }`}>
          {getReliabilityText()}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-4 border-t border-ocp-400/30 grid grid-cols-2 gap-4 text-xs">
        <div>
          <div className="text-ocp-400">Target</div>
          <div className="text-ocp-accent font-mono font-bold">&gt; {criticalThreshold} bar</div>
        </div>
        <div>
          <div className="text-ocp-400">Range</div>
          <div className="text-ocp-300 font-mono font-bold">{minValue}-{maxValue} bar</div>
        </div>
      </div>
    </div>
  );
};
