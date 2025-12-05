'use client';

import React, { useEffect, useState } from 'react';
import { Icon } from '@/components/ui';

/**
 * Cost data interface
 */
export interface CostData {
  total_cost: number;
  baseline_cost: number;
  savings: number;
  cost_breakdown?: {
    grid: number;
    boiler: number;
    sulfur: number;
    gta_fuel: number;
  };
}

export interface CostTickerProps {
  costData: CostData | null;
  isLoading?: boolean;
}

/**
 * CostTicker Component
 * 
 * Displays real-time cost metrics and savings in an animated "ticker" style.
 * Shows the business value of optimization with clear financial impact.
 * 
 * Features:
 * - Animated counter for savings
 * - Color-coded indicators (green for savings, red for high costs)
 * - Cost breakdown tooltip
 * - Percentage savings calculation
 */
export const CostTicker: React.FC<CostTickerProps> = ({
  costData,
  isLoading = false
}) => {
  const [animatedSavings, setAnimatedSavings] = useState(0);
  const [showBreakdown, setShowBreakdown] = useState(false);

  /**
   * Animate the savings counter
   */
  useEffect(() => {
    if (!costData) {
      setAnimatedSavings(0);
      return;
    }

    const targetSavings = costData.savings;
    const duration = 1000; // 1 second animation
    const steps = 50;
    const increment = targetSavings / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setAnimatedSavings(targetSavings);
        clearInterval(timer);
      } else {
        setAnimatedSavings(currentStep * increment);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [costData?.savings]);

  /**
   * Calculate percentage savings
   */
  const savingsPercentage = costData 
    ? (costData.savings / costData.baseline_cost * 100) 
    : 0;

  /**
   * Format currency (Moroccan Dirham)
   */
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="bg-[#313647] rounded-lg p-6 border border-[#435663]">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A3B087]"></div>
        </div>
      </div>
    );
  }

  if (!costData) {
    return (
      <div className="bg-[#313647] rounded-lg p-6 border border-[#435663]">
        <div className="flex items-center gap-2 mb-4">
          <Icon name="dashboard-tab" size={20} color="primary" />
          <h3 className="text-lg font-semibold text-[#FFF8D4]">Cost Analysis</h3>
        </div>
        <div className="text-center py-8 text-[#8E9098]">
          <Icon name="files" size={32} color="secondary" className="mx-auto mb-3 opacity-50" />
          <p>Run an optimization to see cost savings</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#313647] rounded-lg p-6 border border-[#435663]">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Icon name="dashboard-tab" size={20} color="primary" />
          <h3 className="text-lg font-semibold text-[#FFF8D4]">Cost Analysis</h3>
        </div>
        <button
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="text-sm text-[#A3B087] hover:text-[#8A9670] transition-colors flex items-center gap-1"
        >
          {showBreakdown ? 'Hide' : 'Show'} Breakdown
          <Icon 
            name="dropdown" 
            size={16} 
            color="primary" 
            className={`transition-transform ${showBreakdown ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {/* Main Savings Display */}
      <div className="bg-gradient-to-br from-[#A3B087]/20 to-[#A3B087]/5 rounded-lg p-6 mb-6 border border-[#A3B087]/30">
        <div className="text-center">
          <div className="text-[#8E9098] text-sm uppercase tracking-wide mb-2">
            Hourly Savings
          </div>
          <div className="flex items-center justify-center gap-3 mb-2">
            <Icon name="star" size={32} color="primary" />
            <div className="text-5xl font-bold text-[#A3B087]">
              {formatCurrency(animatedSavings)}
              <span className="text-2xl ml-2">DH/hr</span>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-[#FFF8D4]">
            <span className="text-lg">
              {savingsPercentage.toFixed(1)}% cost reduction
            </span>
            {savingsPercentage > 20 && (
              <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-semibold">
                EXCELLENT
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Cost Comparison */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[#1E2028] rounded-lg p-4 border border-[#435663]">
          <div className="text-[#8E9098] text-xs uppercase mb-2">Optimized Cost</div>
          <div className="text-[#A3B087] text-2xl font-bold">
            {formatCurrency(costData.total_cost)}
            <span className="text-sm ml-1">DH/hr</span>
          </div>
        </div>
        <div className="bg-[#1E2028] rounded-lg p-4 border border-[#435663]">
          <div className="text-[#8E9098] text-xs uppercase mb-2">Baseline Cost</div>
          <div className="text-red-400 text-2xl font-bold line-through opacity-70">
            {formatCurrency(costData.baseline_cost)}
            <span className="text-sm ml-1">DH/hr</span>
          </div>
        </div>
      </div>

      {/* Cost Breakdown (Collapsible) */}
      {showBreakdown && costData.cost_breakdown && (
        <div className="bg-[#1E2028] rounded-lg p-4 border border-[#435663] space-y-3">
          <div className="text-[#FFF8D4] font-medium text-sm mb-3">Cost Breakdown</div>
          
          {/* Grid Cost */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-yellow-500"></div>
              <span className="text-[#FFF8D4] text-sm">Grid Import</span>
            </div>
            <span className="text-[#FFF8D4] font-semibold">
              {formatCurrency(costData.cost_breakdown.grid)} DH/hr
            </span>
          </div>

          {/* GTA Fuel Cost */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-blue-500"></div>
              <span className="text-[#FFF8D4] text-sm">GTA Fuel</span>
            </div>
            <span className="text-[#FFF8D4] font-semibold">
              {formatCurrency(costData.cost_breakdown.gta_fuel)} DH/hr
            </span>
          </div>

          {/* Boiler Cost */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-red-500"></div>
              <span className="text-[#FFF8D4] text-sm">Boiler</span>
            </div>
            <span className="text-[#FFF8D4] font-semibold">
              {formatCurrency(costData.cost_breakdown.boiler)} DH/hr
            </span>
          </div>

          {/* Sulfur Recovery (Free/Cheap) */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-500"></div>
              <span className="text-[#FFF8D4] text-sm">Sulfur Recovery</span>
            </div>
            <span className="text-[#A3B087] font-semibold">
              {formatCurrency(costData.cost_breakdown.sulfur)} DH/hr
              <span className="text-xs ml-1">(Free)</span>
            </span>
          </div>

          <div className="pt-3 border-t border-[#435663]">
            <div className="flex items-center justify-between">
              <span className="text-[#FFF8D4] font-semibold">Total</span>
              <span className="text-[#A3B087] text-lg font-bold">
                {formatCurrency(costData.total_cost)} DH/hr
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Daily/Monthly Projections */}
      <div className="mt-6 pt-4 border-t border-[#435663]">
        <div className="text-[#8E9098] text-xs uppercase mb-3">Projected Savings</div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-[#FFF8D4] text-lg font-semibold">
              {formatCurrency(costData.savings * 24)}
            </div>
            <div className="text-[#8E9098] text-xs">Daily</div>
          </div>
          <div>
            <div className="text-[#FFF8D4] text-lg font-semibold">
              {formatCurrency(costData.savings * 24 * 7)}
            </div>
            <div className="text-[#8E9098] text-xs">Weekly</div>
          </div>
          <div>
            <div className="text-[#A3B087] text-lg font-bold">
              {formatCurrency(costData.savings * 24 * 30)}
            </div>
            <div className="text-[#8E9098] text-xs">Monthly</div>
          </div>
        </div>
      </div>

      {/* Efficiency Badge */}
      {savingsPercentage > 15 && (
        <div className="mt-4 p-3 bg-[#A3B087]/10 border border-[#A3B087]/30 rounded-lg flex items-center gap-2">
          <Icon name="star" size={16} color="primary" />
          <span className="text-[#A3B087] text-sm font-medium">
            High efficiency optimization achieved!
          </span>
        </div>
      )}
    </div>
  );
};

export default CostTicker;
