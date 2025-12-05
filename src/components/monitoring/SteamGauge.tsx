'use client';

import React from 'react';
import { Icon } from '@/components/ui';

/**
 * Steam Gauge Component
 * 
 * Displays MP steam pressure with visual gauge and alerts
 * Shows sulfur flow status and recovery metrics
 */

interface LiveData {
  mp_pressure: number | null;
  pressure_alert: boolean;
  sulfur_flow: number;
  free_steam_equivalent: number;
  total_steam_gta: number;
}

interface SteamGaugeProps {
  data: LiveData | null;
  isLoading?: boolean;
}

export const SteamGauge: React.FC<SteamGaugeProps> = ({ data, isLoading }) => {
  if (isLoading || !data) {
    return (
      <div className="bg-[#313647] rounded-lg p-6 border border-[#435663]">
        <div className="animate-pulse">
          <div className="h-8 bg-[#435663] rounded w-1/2 mb-4"></div>
          <div className="h-48 bg-[#435663] rounded"></div>
        </div>
      </div>
    );
  }

  const pressure = data.mp_pressure || 0;
  const minPressure = 7.5;
  const maxPressure = 10.0;
  const criticalPressure = 8.5;
  
  // Calculate gauge angle (-90 to 90 degrees)
  const pressurePercent = ((pressure - minPressure) / (maxPressure - minPressure)) * 100;
  const angle = -90 + (pressurePercent * 1.8); // -90 to 90 degrees
  const clampedAngle = Math.max(-90, Math.min(90, angle));

  // Determine status
  const status = data.pressure_alert ? 'critical' : pressure < 9.0 ? 'warning' : 'normal';
  const statusColor = status === 'critical' ? '#E86C5D' : status === 'warning' ? '#FFD966' : '#A3B087';
  const statusText = status === 'critical' ? 'Low Pressure Alert' : status === 'warning' ? 'Below Optimal' : 'Optimal';

  // Sulfur recovery metrics
  const recoveryRate = data.free_steam_equivalent / data.sulfur_flow;
  const steamContribution = data.total_steam_gta > 0 ? (data.free_steam_equivalent / data.total_steam_gta) * 100 : 0;

  return (
    <div className="bg-[#313647] rounded-lg p-6 border border-[#435663]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Icon name="settings" size={20} color="primary" />
          <h3 className="text-lg font-semibold text-[#FFF8D4]">MP Steam Pressure</h3>
        </div>
        <div 
          className="flex items-center gap-2 px-3 py-1 rounded-lg"
          style={{ backgroundColor: statusColor + '20' }}
        >
          <div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: statusColor }}
          ></div>
          <span className="text-xs font-medium" style={{ color: statusColor }}>
            {statusText}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pressure Gauge */}
        <div className="flex flex-col items-center">
          <div className="relative w-64 h-48">
            {/* Gauge background */}
            <svg width="256" height="192" viewBox="0 0 256 192">
              {/* Gauge arc background */}
              <path
                d="M 28 156 A 100 100 0 0 1 228 156"
                fill="none"
                stroke="#435663"
                strokeWidth="24"
                strokeLinecap="round"
              />
              
              {/* Danger zone (red) */}
              <path
                d="M 28 156 A 100 100 0 0 1 88 80"
                fill="none"
                stroke="#E86C5D"
                strokeWidth="24"
                strokeLinecap="round"
                opacity="0.3"
              />
              
              {/* Warning zone (yellow) */}
              <path
                d="M 88 80 A 100 100 0 0 1 128 56"
                fill="none"
                stroke="#FFD966"
                strokeWidth="24"
                strokeLinecap="round"
                opacity="0.3"
              />
              
              {/* Normal zone (green) */}
              <path
                d="M 128 56 A 100 100 0 0 1 228 156"
                fill="none"
                stroke="#A3B087"
                strokeWidth="24"
                strokeLinecap="round"
                opacity="0.3"
              />

              {/* Needle */}
              <g transform={`rotate(${clampedAngle} 128 156)`}>
                <line
                  x1="128"
                  y1="156"
                  x2="128"
                  y2="76"
                  stroke={statusColor}
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle cx="128" cy="156" r="8" fill={statusColor} />
              </g>

              {/* Tick marks */}
              {[7.5, 8.0, 8.5, 9.0, 9.5, 10.0].map((value, i) => {
                const tickAngle = -90 + (((value - minPressure) / (maxPressure - minPressure)) * 180);
                const isCritical = value === criticalPressure;
                return (
                  <g key={i} transform={`rotate(${tickAngle} 128 156)`}>
                    <line
                      x1="128"
                      y1="68"
                      x2="128"
                      y2={isCritical ? "60" : "64"}
                      stroke={isCritical ? "#E86C5D" : "#8E9098"}
                      strokeWidth={isCritical ? "2" : "1"}
                    />
                    <text
                      x="128"
                      y="52"
                      textAnchor="middle"
                      fill={isCritical ? "#E86C5D" : "#8E9098"}
                      fontSize="10"
                      fontWeight={isCritical ? "700" : "400"}
                      transform={`rotate(${-tickAngle} 128 52)`}
                    >
                      {value.toFixed(1)}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Center value display */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
              <div className="text-4xl font-bold text-[#FFF8D4] tabular-nums">
                {pressure.toFixed(2)}
              </div>
              <div className="text-sm text-[#8E9098] mt-1">bar</div>
            </div>
          </div>

          {/* Alert message */}
          {data.pressure_alert && (
            <div className="mt-4 flex items-start gap-2 p-3 bg-[#E86C5D]/10 border border-[#E86C5D]/30 rounded-lg">
              <Icon name="dot" size={16} color="secondary" />
              <div className="text-sm">
                <div className="text-[#E86C5D] font-semibold">Low Pressure Alert</div>
                <div className="text-[#8E9098] text-xs mt-1">
                  Efficiency impact: -5% | Check steam balance
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sulfur Recovery Info */}
        <div className="space-y-4">
          <div className="bg-[#1E2028] rounded-lg p-4">
            <div className="text-sm font-medium text-[#8E9098] mb-3">Sulfur Heat Recovery</div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#8E9098]">Sulfur Flow</span>
                <span className="text-lg font-semibold text-[#FFF8D4]">
                  {data.sulfur_flow.toFixed(1)} <span className="text-sm text-[#8E9098]">T/hr</span>
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-[#8E9098]">Free Steam Generated</span>
                <span className="text-lg font-semibold text-[#A3B087]">
                  {data.free_steam_equivalent.toFixed(1)} <span className="text-sm text-[#8E9098]">T/hr</span>
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-[#8E9098]">Recovery Ratio</span>
                <span className="text-lg font-semibold text-[#FFF8D4]">
                  {recoveryRate.toFixed(2)}x
                </span>
              </div>

              <div className="pt-3 border-t border-[#435663]">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#8E9098]">Steam Contribution</span>
                  <span className="text-xl font-bold text-[#A3B087]">
                    {steamContribution.toFixed(1)}%
                  </span>
                </div>
                <div className="mt-2 w-full bg-[#435663] rounded-full h-2">
                  <div
                    className="bg-[#A3B087] h-2 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, steamContribution)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#1E2028] rounded-lg p-3">
              <div className="text-xs text-[#8E9098] mb-1">Total Steam</div>
              <div className="text-xl font-bold text-[#FFF8D4]">
                {data.total_steam_gta.toFixed(0)}
              </div>
              <div className="text-xs text-[#8E9098]">T/hr to GTAs</div>
            </div>

            <div className="bg-[#1E2028] rounded-lg p-3">
              <div className="text-xs text-[#8E9098] mb-1">Efficiency Gain</div>
              <div className="text-xl font-bold text-[#A3B087]">
                +{(steamContribution * 0.5).toFixed(1)}%
              </div>
              <div className="text-xs text-[#8E9098]">From recovery</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
