/**
 * Energy Copilot API Client
 * 
 * Axios-based client for communicating with the FastAPI backend.
 * Provides typed interfaces and error handling for all optimization endpoints.
 */

import axios, { AxiosError, AxiosInstance } from 'axios';

// ==================== TYPE DEFINITIONS ====================

export interface GTAResult {
  gta_number: number;
  admission: number;
  soutirage: number;
  power: number;
}

export interface CostBreakdown {
  grid: number;
  boiler: number;
  sulfur: number;
  gta_fuel: number;
}

export interface BaselineComparison {
  grid_import: number;
  boiler_output: number;
  gta_load_percent: number;
}

export interface OperationalRecommendation {
  icon: string;
  title: string;
  instruction: string;
  safety_check?: string;
  impact: string;
  priority: 'high' | 'medium' | 'low';
}

export interface OptimizationResult {
  status: string;
  gtas: GTAResult[];
  grid_import: number;
  boiler_output: number;
  sulfur_steam: number;
  total_cost: number;
  cost_breakdown: CostBreakdown;
  baseline_cost: number;
  baseline: BaselineComparison;
  savings: number;
  recommendations: OperationalRecommendation[];
  demands: {
    electricity: number;
    steam: number;
  };
  constraints_applied: Record<string, any>;
  timestamp: string;
}

export interface OptimizationRequest {
  elec_demand: number;
  steam_demand: number;
  constraints?: Record<string, any>;
  hour?: number;
  verbose?: boolean;
}

export interface LiveDataResponse {
  timestamp: string;
  gta_operations: {
    gta1: { power: number; admission: number; soutirage: number };
    gta2: { power: number; admission: number; soutirage: number };
    gta3: { power: number; admission: number; soutirage: number };
  };
  total_power_generated: number;
  total_steam_gta: number;
  sulfur_flow: number;
  free_steam_equivalent: number;
  mp_pressure: number | null;
  pressure_alert: boolean;
  grid_import_estimated: number;
  boiler_usage_estimated: number;
  efficiency_percent: number;
  cost_per_hour: number;
  co2_emissions_kg_per_hour: number;
  free_energy_percent: number;
  demands: {
    electricity: number;
    steam: number;
  };
  steam_economics: {
    blended_cost_per_ton: number;
    total_steam_cost_per_hour: number;
    source_breakdown: {
      sulfur_percent: number;
      gta_percent: number;
      boiler_percent: number;
      sulfur_tons: number;
      gta_tons: number;
      boiler_tons: number;
    };
  };
  opportunity_cost: {
    lost_power_mw: number;
    lost_revenue_per_hour: number;
    extraction_efficiency: number;
  };
}

export interface SystemInfo {
  financial_constants: Record<string, number>;
  physics_coefficients: Record<string, any>;
  system_constraints: Record<string, number>;
  gta_models: Array<{
    gta_number: number;
    formula: string;
  }>;
}

export interface Scenario {
  name: string;
  description: string;
  params: OptimizationRequest;
}

export interface HealthStatus {
  status: string;
  timestamp: string;
  optimizer_ready: boolean;
  sulfur_data_loaded: boolean;
}

// ==================== API CLIENT CLASS ====================

export class EnergyAPI {
  private client: AxiosInstance;

  constructor(baseURL: string = 'http://localhost:8000') {
    this.client = axios.create({
      baseURL,
      timeout: 30000, // 30 second timeout for optimization
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        console.error('API Error:', error.message);
        if (error.response) {
          console.error('Response data:', error.response.data);
          console.error('Response status:', error.response.status);
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Run optimization with given demands and constraints
   */
  async optimize(request: OptimizationRequest): Promise<OptimizationResult> {
    try {
      const response = await this.client.post<OptimizationResult>('/api/optimize', request);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.detail || 'Optimization failed');
      }
      throw error;
    }
  }

  /**
   * Get system configuration and constraints
   */
  async getSystemInfo(): Promise<SystemInfo> {
    const response = await this.client.get<SystemInfo>('/api/system-info');
    return response.data;
  }

  /**
   * Get pre-defined optimization scenarios
   */
  async getScenarios(): Promise<Scenario[]> {
    const response = await this.client.get<{ scenarios: Scenario[] }>('/api/scenarios');
    return response.data.scenarios;
  }

  /**
   * Health check endpoint
   */
  async healthCheck(): Promise<HealthStatus> {
    const response = await this.client.get<HealthStatus>('/api/health');
    return response.data;
  }

  /**
   * Get live plant data (real-time monitoring)
   */
  async getLiveData(): Promise<LiveDataResponse> {
    const response = await this.client.get<{ success: boolean; data: LiveDataResponse }>('/api/live');
    return response.data.data;
  }

  /**
   * Get API root information
   */
  async getApiInfo(): Promise<any> {
    const response = await this.client.get('/api');
    return response.data;
  }
}

// ==================== SINGLETON INSTANCE ====================

// Create singleton instance with environment-aware base URL
const getBaseURL = (): string => {
  // Check if we're in browser environment
  if (typeof window !== 'undefined') {
    // Use environment variable if available, otherwise default to localhost
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  }
  // Server-side rendering fallback
  return 'http://localhost:8000';
};

export const energyAPI = new EnergyAPI(getBaseURL());

// ==================== REACT HOOKS (Optional) ====================

/**
 * Custom hook for optimization API calls
 * Usage: const { optimize, isLoading, error, result } = useOptimization();
 */
export const useOptimization = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<OptimizationResult | null>(null);

  const optimize = async (request: OptimizationRequest) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await energyAPI.optimize(request);
      setResult(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { optimize, isLoading, error, result, setResult };
};

/**
 * Custom hook for system info
 */
export const useSystemInfo = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [systemInfo, setSystemInfo] = React.useState<SystemInfo | null>(null);

  const fetchSystemInfo = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await energyAPI.getSystemInfo();
      setSystemInfo(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch system info';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { fetchSystemInfo, isLoading, error, systemInfo };
};

/**
 * Custom hook for scenarios
 */
export const useScenarios = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [scenarios, setScenarios] = React.useState<Scenario[]>([]);

  const fetchScenarios = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await energyAPI.getScenarios();
      setScenarios(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch scenarios';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { fetchScenarios, isLoading, error, scenarios };
};

/**
 * Custom hook for live data monitoring
 * Usage: const { liveData, isLoading, error, refresh } = useLiveData(5000);
 */
export const useLiveData = (refreshInterval: number = 5000) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [liveData, setLiveData] = React.useState<LiveDataResponse | null>(null);

  const fetchLiveData = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await energyAPI.getLiveData();
      setLiveData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch live data';
      setError(errorMessage);
      console.error('Live data error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auto-refresh
  React.useEffect(() => {
    fetchLiveData(); // Initial fetch

    const interval = setInterval(fetchLiveData, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchLiveData, refreshInterval]);

  return { liveData, isLoading, error, refresh: fetchLiveData };
};

// Import React for hooks (conditional)
import React from 'react';

// ==================== UTILITY FUNCTIONS ====================

/**
 * Format optimization result for display
 */
export const formatOptimizationResult = (result: OptimizationResult): string => {
  const lines = [
    `Status: ${result.status}`,
    `Total Cost: ${result.total_cost.toFixed(2)} DH/hr`,
    `Savings: ${result.savings.toFixed(2)} DH/hr (${(result.savings / result.baseline_cost * 100).toFixed(1)}%)`,
    ``,
    `GTAs:`,
    ...result.gtas.map(gta => 
      `  GTA ${gta.gta_number}: ${gta.power.toFixed(2)} MW (A=${gta.admission.toFixed(1)} T/hr, S=${gta.soutirage.toFixed(1)} T/hr)`
    ),
    ``,
    `Grid Import: ${result.grid_import.toFixed(2)} MW`,
    `Boiler: ${result.boiler_output.toFixed(2)} T/hr`,
    `Sulfur Recovery: ${result.sulfur_steam.toFixed(2)} T/hr`,
  ];
  
  return lines.join('\n');
};

/**
 * Validate optimization request
 */
export const validateOptimizationRequest = (request: OptimizationRequest): string[] => {
  const errors: string[] = [];

  if (request.elec_demand < 0 || request.elec_demand > 150) {
    errors.push('Electricity demand must be between 0 and 150 MW');
  }

  if (request.steam_demand < 0 || request.steam_demand > 600) {
    errors.push('Steam demand must be between 0 and 600 T/hr');
  }

  if (request.hour !== undefined && (request.hour < 0 || request.hour > 23)) {
    errors.push('Hour must be between 0 and 23');
  }

  return errors;
};

export default energyAPI;
