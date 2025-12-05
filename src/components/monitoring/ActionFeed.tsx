'use client';

import React, { useEffect, useState } from 'react';

interface ActionEvent {
  id: string;
  timestamp: Date;
  type: 'INFO' | 'WARN' | 'CRITICAL' | 'AI' | 'SUCCESS';
  message: string;
}

interface ActionFeedProps {
  mpPressure: number;
  boilerActive: boolean;
  gridImport: number;
  efficiency: number;
  blendedCost: number;
}

export const ActionFeed: React.FC<ActionFeedProps> = ({
  mpPressure,
  boilerActive,
  gridImport,
  efficiency,
  blendedCost
}) => {
  const [events, setEvents] = useState<ActionEvent[]>([]);

  useEffect(() => {
    // Generate contextual events based on real data
    const newEvents: ActionEvent[] = [];
    const now = new Date();

    // Pressure monitoring
    if (mpPressure < 8.5) {
      newEvents.push({
        id: `pressure-${Date.now()}`,
        timestamp: now,
        type: 'CRITICAL',
        message: `MP Pressure ${mpPressure.toFixed(2)} bar - Below critical threshold`
      });
    } else if (mpPressure < 9.0) {
      newEvents.push({
        id: `pressure-${Date.now()}`,
        timestamp: now,
        type: 'WARN',
        message: `MP Pressure ${mpPressure.toFixed(2)} bar - Below optimal range`
      });
    }

    // Boiler status
    if (boilerActive) {
      newEvents.push({
        id: `boiler-${Date.now()}`,
        timestamp: now,
        type: 'WARN',
        message: `Aux Boiler active - Cost impact +284 DH/T`
      });
      newEvents.push({
        id: `ai-boiler-${Date.now()}`,
        timestamp: now,
        type: 'AI',
        message: `Recommendation: Reduce steam demand or increase GTA extraction`
      });
    }

    // Grid status
    const hour = now.getHours();
    const isPeakHour = hour >= 17 && hour < 22;
    if (isPeakHour && gridImport > 10) {
      newEvents.push({
        id: `grid-${Date.now()}`,
        timestamp: now,
        type: 'WARN',
        message: `Peak tariff active - Grid cost 1.27 DH/kWh (${gridImport.toFixed(1)} MW)`
      });
      newEvents.push({
        id: `ai-grid-${Date.now()}`,
        timestamp: now,
        type: 'AI',
        message: `Optimization opportunity: Increase GTA output to reduce grid import`
      });
    } else {
      newEvents.push({
        id: `grid-${Date.now()}`,
        timestamp: now,
        type: 'INFO',
        message: `Grid tariff: ${isPeakHour ? 'Peak' : 'Off-Peak'} (${gridImport.toFixed(1)} MW import)`
      });
    }

    // Efficiency monitoring
    if (efficiency > 85) {
      newEvents.push({
        id: `efficiency-${Date.now()}`,
        timestamp: now,
        type: 'SUCCESS',
        message: `Plant efficiency ${efficiency.toFixed(1)}% - Optimal performance`
      });
    } else if (efficiency < 75) {
      newEvents.push({
        id: `efficiency-${Date.now()}`,
        timestamp: now,
        type: 'WARN',
        message: `Plant efficiency ${efficiency.toFixed(1)}% - Below target`
      });
    }

    // Cost optimization insights
    if (blendedCost < 100) {
      newEvents.push({
        id: `cost-${Date.now()}`,
        timestamp: now,
        type: 'SUCCESS',
        message: `Excellent steam cost mix: ${blendedCost.toFixed(1)} DH/T (vs 284 boiler-only)`
      });
    }

    // Add to event stream (keep last 20)
    setEvents(prev => [...newEvents, ...prev].slice(0, 20));
  }, [mpPressure, boilerActive, gridImport, efficiency, blendedCost]);

  const getEventStyle = (type: ActionEvent['type']) => {
    switch (type) {
      case 'CRITICAL':
        return 'border-l-status-danger bg-status-danger-muted text-status-danger';
      case 'WARN':
        return 'border-l-status-warning bg-status-warning-muted text-status-warning';
      case 'SUCCESS':
        return 'border-l-ocp-accent bg-ocp-accent/10 text-ocp-accent';
      case 'AI':
        return 'border-l-ocp-500 bg-ocp-500/10 text-ocp-300';
      default:
        return 'border-l-status-info bg-status-info-muted text-status-info';
    }
  };

  const getEventIcon = (type: ActionEvent['type']) => {
    switch (type) {
      case 'CRITICAL':
        return '!';
      case 'WARN':
        return '!';
      case 'SUCCESS':
        return '✓';
      case 'AI':
        return '◆';
      default:
        return 'i';
    }
  };

  return (
    <div className="bg-ocp-900/50 backdrop-blur-md border border-ocp-400/30 rounded-lg p-3 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-ocp-400/30">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-status-info animate-pulse" />
          <span className="text-xs font-semibold text-ocp-300 uppercase tracking-wide">
            Live Event Feed
          </span>
        </div>
        <div className="text-[10px] text-ocp-400">
          {events.length} events
        </div>
      </div>

      {/* Events List */}
      <div className="flex-1 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-ocp-600 scrollbar-track-transparent">
        {events.length === 0 ? (
          <div className="text-center py-8 text-ocp-400 text-xs">
            Monitoring system events...
          </div>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className={`border-l-2 pl-3 pr-2 py-2 rounded-r text-xs transition-all duration-300 ${getEventStyle(event.type)}`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold">{getEventIcon(event.type)}</span>
                  <span className="font-semibold text-[10px] uppercase tracking-wide opacity-80">
                    {event.type}
                  </span>
                </div>
                <span className="text-[9px] text-ocp-400 font-mono">
                  {event.timestamp.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit', 
                    second: '2-digit' 
                  })}
                </span>
              </div>
              <div className="text-[11px] leading-tight opacity-90">
                {event.message}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="mt-3 pt-2 border-t border-ocp-400/30 text-[10px] text-ocp-400 text-center">
        Auto-refresh every 5s
      </div>
    </div>
  );
};
