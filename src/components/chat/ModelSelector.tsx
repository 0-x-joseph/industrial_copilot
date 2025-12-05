import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '../ui/Icon';
import { opcClient } from '../../lib/opencode-client';

interface ModelInfo {
  providerID: string;
  modelID: string;
  displayName?: string;
}

interface ProviderInfo {
  id: string;
  name: string;
  models: { [key: string]: any };
}

interface ModelSelectorProps {
  currentModel?: ModelInfo;
  tokensUsed?: number;
  tokensLimit?: number;
  onModelChange?: (model: ModelInfo) => void;
  className?: string;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  currentModel,
  tokensUsed = 0,
  tokensLimit,
  onModelChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [providers, setProviders] = useState<ProviderInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load available providers and models
  useEffect(() => {
    const loadProviders = async () => {
      try {
        setIsLoading(true);
        const response = await opcClient.config.providers();
        if (response.data) {
          // Transform the response data to match our interface
          const transformedProviders = (response.data.providers || []).map((provider: any) => ({
            id: provider.id,
            name: provider.name || provider.id,
            models: provider.models || {}
          }));
          setProviders(transformedProviders);
        }
      } catch (error) {
        console.error('Failed to load providers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProviders();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleModelSelect = (model: ModelInfo) => {
    onModelChange?.(model);
    setIsOpen(false);
  };

  const getModelDisplayName = (model?: ModelInfo) => {
    if (!model) return 'Select Model';
    
    // Format model name for display
    const modelName = model.modelID.replace(/^.*\//, '').replace(/-/g, ' ');
    return modelName.charAt(0).toUpperCase() + modelName.slice(1);
  };

  const formatTokenCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Model Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#435663] bg-opacity-50 hover:bg-[#A3B087] hover:bg-opacity-50 transition-all duration-200 group min-w-[140px]"
        disabled={isLoading}
      >
        <div className="flex items-center gap-2 flex-1">
          <div className="w-2 h-2 rounded-full bg-blue-400" />
          <div className="flex flex-col items-start">
            <span className="text-xs font-medium text-[#FFF8D4] leading-tight">
              {getModelDisplayName(currentModel)}
            </span>
            <span className="text-[10px] text-[#A3B087] leading-none">
              {formatTokenCount(tokensUsed)} tokens
              {tokensLimit && ` / ${formatTokenCount(tokensLimit)}`}
            </span>
          </div>
        </div>
        <Icon 
          name="dropdown" 
          size={16} 
          color="inverse" 
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-80 bg-[#313647] border border-[#435663] rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          <div className="p-2 border-b border-[#435663]">
            <h3 className="text-sm font-semibold text-[#FFF8D4] mb-1">Select Model</h3>
            <p className="text-xs text-[#A3B087]">Choose your AI model for chat interactions</p>
          </div>
          
          {isLoading ? (
            <div className="p-4 flex items-center justify-center">
              <div className="animate-spin w-4 h-4 border-2 border-[#A3B087] border-t-transparent rounded-full" />
              <span className="ml-2 text-xs text-[#A3B087]">Loading models...</span>
            </div>
          ) : (
            <div className="max-h-72 overflow-y-auto">
              {providers.map((provider) => (
                <div key={provider.id} className="p-2">
                  <div className="text-xs font-medium text-[#A3B087] mb-2 px-2">
                    {provider.name}
                  </div>
                  {Object.entries(provider.models || {}).map(([modelKey, model]: [string, any]) => {
                    const modelInfo: ModelInfo = {
                      providerID: provider.id,
                      modelID: modelKey,
                      displayName: model.name || modelKey
                    };
                    
                    return (
                      <button
                        key={`${provider.id}-${modelKey}`}
                        onClick={() => handleModelSelect(modelInfo)}
                        className={`
                          w-full flex items-center gap-3 px-3 py-2 rounded-md text-left transition-colors
                          ${currentModel?.modelID === modelKey && currentModel?.providerID === provider.id
                            ? 'bg-[#A3B087] bg-opacity-20 text-[#FFF8D4]'
                            : 'hover:bg-[#435663] text-[#FFF8D4] hover:text-white'
                          }
                        `}
                      >
                        <div className={`
                          w-2 h-2 rounded-full
                          ${currentModel?.modelID === modelKey && currentModel?.providerID === provider.id
                            ? 'bg-[#A3B087]'
                            : 'bg-blue-400'
                          }
                        `} />
                        <div className="flex-1">
                          <div className="text-sm font-medium">
                            {getModelDisplayName(modelInfo)}
                          </div>
                          <div className="text-xs text-[#A3B087]">
                            {provider.id} • {modelKey}
                          </div>
                        </div>
                        {currentModel?.modelID === modelKey && currentModel?.providerID === provider.id && (
                          <Icon name="thumbs-up" size={16} color="primary" />
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
          
          {!isLoading && providers.length === 0 && (
            <div className="p-4 text-center">
              <p className="text-xs text-[#A3B087]">No models available</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};