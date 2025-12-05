'use client';

import React, { useEffect, useState } from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';

interface PressureHeartbeatProps {
  currentPressure: number;
  criticalThreshold?: number;
}

export const PressureHeartbeat: React.FC<PressureHeartbeatProps> = ({
  currentPressure,
  criticalThreshold = 8.5
}) => {
  const [history, setHistory] = useState<{ value: number; timestamp: number }[]>([]);
  const isCritical = currentPressure < criticalThreshold;

  useEffect(() => {
    setHistory(prev => {
      const newHistory = [...prev, { value: currentPressure, timestamp: Date.now() }];
      // Keep last 40 points (about 3-4 minutes at 5s refresh)
      return newHistory.slice(-40);
    });
  }, [currentPressure]);

  // Brand-aligned colors
  const successColor = '#A3B087';  // ocp-accent
  const dangerColor = '#C47070';   // status-danger

  return (
    <div className="bg-ocp-900/50 backdrop-blur-md border border-ocp-400/30 rounded-lg p-3">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isCritical ? 'bg-status-danger animate-pulse' : 'bg-ocp-accent'}`} />
          <span className="text-xs font-semibold text-ocp-300 uppercase tracking-wide">
            MP Steam Pressure
          </span>
        </div>
        <div className={`text-xs px-2 py-0.5 rounded ${
          isCritical 
            ? 'bg-status-danger-muted text-status-danger border border-status-danger/50' 
            : 'bg-ocp-accent/20 text-ocp-accent border border-ocp-accent/50'
        }`}>
          {isCritical ? 'CRITICAL' : 'STABLE'}
        </div>
      </div>

      {/* Large Display */}
      <div className="mb-2">
        <div className={`text-3xl font-mono font-bold ${
          isCritical ? 'text-status-danger' : 'text-ocp-accent'
        }`}>
          {currentPressure.toFixed(2)}
          <span className="text-sm text-ocp-400 ml-2">bar</span>
        </div>
        <div className="text-[10px] text-ocp-400">
          Target: &gt; {criticalThreshold} bar
        </div>
      </div>

      {/* Sparkline */}
      <div className="h-16 -mx-3">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history}>
            <YAxis 
              domain={[7.5, 10]} 
              hide={true}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={isCritical ? dangerColor : successColor}
              strokeWidth={2}
              dot={false}
              animationDuration={300}
              className={isCritical ? 'animate-pulse' : ''}
            />
            {/* Critical threshold line */}
            <Line
              type="monotone"
              dataKey={() => criticalThreshold}
              stroke="#5a6d7a"
              strokeWidth={1}
              strokeDasharray="3 3"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Stats */}
      <div className="flex justify-between text-[10px] text-ocp-400 mt-2 pt-2 border-t border-ocp-400/30">
        <div>
          <span className="text-ocp-500">Min:</span>{' '}
          <span className="text-ocp-300 font-mono">
            {history.length > 0 ? Math.min(...history.map(h => h.value)).toFixed(2) : '--'}
          </span>
        </div>
        <div>
          <span className="text-ocp-500">Max:</span>{' '}
          <span className="text-ocp-300 font-mono">
            {history.length > 0 ? Math.max(...history.map(h => h.value)).toFixed(2) : '--'}
          </span>
        </div>
        <div>
          <span className="text-ocp-500">Avg:</span>{' '}
          <span className="text-ocp-300 font-mono">
            {history.length > 0 
              ? (history.reduce((sum, h) => sum + h.value, 0) / history.length).toFixed(2)
              : '--'
            }
          </span>
        </div>
      </div>
    </div>
  );
};
