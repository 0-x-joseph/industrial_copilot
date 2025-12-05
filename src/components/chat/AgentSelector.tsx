import React, { useState, useEffect, useRef } from 'react';
import { Icon } from '../ui/Icon';
import { opcClient } from '../../lib/opencode-client';
import type { Agent } from '@/types/opencode';

interface AgentSelectorProps {
  currentAgent?: Agent;
  onAgentChange?: (agent: Agent) => void;
  className?: string;
}

export const AgentSelector: React.FC<AgentSelectorProps> = ({
  currentAgent,
  onAgentChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load available agents from OpenCode API
  useEffect(() => {
    const loadAgents = async () => {
      try {
        setIsLoading(true);
        const response = await opcClient.app.agents();
        if (response.data) {
          setAgents(response.data);
        }
      } catch (error) {
        console.error('Failed to load agents:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAgents();
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

  const handleAgentSelect = (agent: Agent) => {
    onAgentChange?.(agent);
    setIsOpen(false);
  };

  const getAgentDisplayName = (agent?: Agent) => {
    if (!agent) return 'Select Agent';
    return agent.name;
  };

  const getModeBadgeColor = (mode: Agent['mode']) => {
    switch (mode) {
      case 'primary':
        return 'bg-[#A3B087]/20 text-[#A3B087]';
      case 'subagent':
        return 'bg-[#435663]/30 text-[#FFF8D4]';
      case 'all':
        return 'bg-blue-500/20 text-blue-600';
      default:
        return 'bg-gray-500/20 text-gray-600';
    }
  };

  const getPermissionBadges = (agent: Agent) => {
    const badges: { label: string; color: string }[] = [];
    
    if (agent.permission.edit === 'allow') {
      badges.push({ label: 'Edit', color: 'bg-green-500/20 text-green-700' });
    }
    
    if (agent.permission.bash && Object.values(agent.permission.bash).some(val => val === 'allow')) {
      badges.push({ label: 'Bash', color: 'bg-yellow-500/20 text-yellow-700' });
    }
    
    if (agent.permission.webfetch === 'allow') {
      badges.push({ label: 'Web', color: 'bg-blue-500/20 text-blue-700' });
    }
    
    return badges;
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Agent Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#435663] hover:bg-[#A3B087] transition-all duration-200 group min-w-[140px]"
        disabled={isLoading}
      >
        <div className="flex items-center gap-2 flex-1">
          {/* Agent color indicator */}
          <div 
            className="w-2 h-2 rounded-full" 
            style={{ backgroundColor: currentAgent?.color || '#A3B087' }}
          />
          <div className="flex flex-col items-start">
            <span className="text-xs font-medium text-[#FFF8D4] leading-tight">
              {getAgentDisplayName(currentAgent)}
            </span>
            {currentAgent && (
              <span className="text-[10px] text-[#A3B087] leading-none">
                {currentAgent.mode}
                {currentAgent.builtIn && ' • Built-in'}
              </span>
            )}
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
        <div className="absolute top-full left-0 mt-1 w-96 bg-[#313647] border border-[#435663] rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          <div className="p-2 border-b border-[#435663]">
            <h3 className="text-sm font-semibold text-[#FFF8D4] mb-1">Select Agent</h3>
            <p className="text-xs text-[#A3B087]">Choose an AI agent with specific capabilities</p>
          </div>
          
          {isLoading ? (
            <div className="p-4 flex items-center justify-center">
              <div className="animate-spin w-4 h-4 border-2 border-[#A3B087] border-t-transparent rounded-full" />
              <span className="ml-2 text-xs text-[#A3B087]">Loading agents...</span>
            </div>
          ) : (
            <div className="max-h-72 overflow-y-auto">
              {agents.map((agent) => {
                const permissionBadges = getPermissionBadges(agent);
                const isActive = currentAgent?.name === agent.name;
                
                return (
                  <button
                    key={agent.name}
                    onClick={() => handleAgentSelect(agent)}
                    className={`
                      w-full flex flex-col gap-2 px-3 py-2.5 rounded-md text-left transition-colors
                      ${isActive
                        ? 'bg-[#A3B087] bg-opacity-20 text-[#FFF8D4]'
                        : 'hover:bg-[#435663] text-[#FFF8D4] hover:text-white'
                      }
                    `}
                  >
                    <div className="flex items-start gap-2">
                      {/* Agent color indicator */}
                      <div 
                        className="w-2 h-2 rounded-full mt-1 flex-shrink-0"
                        style={{ backgroundColor: agent.color || '#A3B087' }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-sm font-medium truncate">
                            {agent.name}
                          </span>
                          {isActive && (
                            <Icon name="thumbs-up" size={16} color="primary" className="flex-shrink-0" />
                          )}
                        </div>
                        
                        {/* Agent Description */}
                        {agent.description && (
                          <p className="text-xs text-[#A3B087] mt-1 line-clamp-2">
                            {agent.description}
                          </p>
                        )}
                        
                        {/* Mode Badge */}
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${getModeBadgeColor(agent.mode)}`}>
                            {agent.mode.toUpperCase()}
                          </span>
                          
                          {agent.builtIn && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-[#435663]/30 text-[#FFF8D4]">
                              Built-in
                            </span>
                          )}
                        </div>
                        
                        {/* Permission Badges */}
                        {permissionBadges.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {permissionBadges.map((badge, idx) => (
                              <span
                                key={idx}
                                className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${badge.color}`}
                              >
                                {badge.label}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        {/* Model Configuration */}
                        {agent.model && (
                          <div className="mt-2 text-[10px] text-[#A3B087]">
                            <span className="opacity-60">Model:</span>
                            <span className="ml-1 font-medium">
                              {agent.model.providerID}/{agent.model.modelID}
                            </span>
                          </div>
                        )}
                        
                        {/* Temperature and TopP */}
                        {(agent.temperature !== undefined || agent.topP !== undefined) && (
                          <div className="flex items-center gap-2 mt-1 text-[10px] text-[#A3B087]">
                            {agent.temperature !== undefined && (
                              <span className="flex items-center gap-1">
                                <span className="opacity-60">Temp:</span>
                                <span className="font-medium">{agent.temperature}</span>
                              </span>
                            )}
                            {agent.topP !== undefined && (
                              <>
                                <span className="opacity-40">•</span>
                                <span className="flex items-center gap-1">
                                  <span className="opacity-60">TopP:</span>
                                  <span className="font-medium">{agent.topP}</span>
                                </span>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
          
          {!isLoading && agents.length === 0 && (
            <div className="p-4 text-center">
              <p className="text-xs text-[#A3B087]">No agents available</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
