'use client';

import React, { useState } from 'react';
import { AgentSelector } from '@/components/chat/AgentSelector';
import type { Agent } from '@/types/opencode';

/**
 * AgentSelector Test Page
 * 
 * Purpose: Interactive testing environment for the AgentSelector component
 * Tests:
 * - Agent loading from OpenCode API
 * - Agent selection and state updates
 * - Visual rendering of agent properties
 * - Dropdown open/close behavior
 * - LocalStorage persistence
 * - Loading and empty states
 */
export default function AgentSelectorTestPage() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | undefined>();
  const [selectionHistory, setSelectionHistory] = useState<Agent[]>([]);

  const handleAgentChange = (agent: Agent) => {
    setSelectedAgent(agent);
    setSelectionHistory(prev => [...prev, agent]);
  };

  const clearHistory = () => {
    setSelectionHistory([]);
  };

  const clearLocalStorage = () => {
    localStorage.removeItem('ocp-preferred-agent');
    alert('LocalStorage cleared! Refresh page to test initial load behavior.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF8D4] to-[#F3F4F6] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#313647] mb-4">
            AgentSelector Component Test
          </h1>
          <p className="text-lg text-[#435663]">
            Interactive testing for agent selection with OpenCode API integration
          </p>
        </div>

        {/* Main Test Area */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Left Column: Component Demo */}
          <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-[#A3B087]">
            <h2 className="text-2xl font-bold text-[#313647] mb-6">
              Live Component
            </h2>
            
            {/* AgentSelector in simulated header context */}
            <div className="bg-[#313647] p-4 rounded-lg mb-6">
              <div className="flex items-center justify-between">
                <span className="text-[#FFF8D4] font-semibold">Chat Header</span>
                <div className="flex items-center gap-3">
                  <AgentSelector
                    currentAgent={selectedAgent}
                    onAgentChange={handleAgentChange}
                  />
                  <span className="text-[#FFF8D4] text-sm">Other Controls</span>
                </div>
              </div>
            </div>

            {/* Standalone Component */}
            <div className="border-2 border-dashed border-[#435663] p-4 rounded-lg">
              <h3 className="text-sm font-semibold text-[#435663] mb-3">
                Standalone (No Background)
              </h3>
              <AgentSelector
                currentAgent={selectedAgent}
                onAgentChange={handleAgentChange}
              />
            </div>
          </div>

          {/* Right Column: Current State */}
          <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-[#435663]">
            <h2 className="text-2xl font-bold text-[#313647] mb-6">
              Current State
            </h2>

            {selectedAgent ? (
              <div className="space-y-4">
                {/* Agent Name & Description */}
                <div>
                  <h3 className="text-sm font-semibold text-[#435663] mb-1">
                    Agent Name
                  </h3>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: selectedAgent.color || '#A3B087' }}
                    />
                    <p className="text-lg font-medium text-[#313647]">
                      {selectedAgent.name}
                    </p>
                  </div>
                </div>

                {selectedAgent.description && (
                  <div>
                    <h3 className="text-sm font-semibold text-[#435663] mb-1">
                      Description
                    </h3>
                    <p className="text-sm text-[#435663]">
                      {selectedAgent.description}
                    </p>
                  </div>
                )}

                {/* Mode */}
                <div>
                  <h3 className="text-sm font-semibold text-[#435663] mb-1">
                    Mode
                  </h3>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                    selectedAgent.mode === 'primary' ? 'bg-blue-100 text-blue-800' :
                    selectedAgent.mode === 'subagent' ? 'bg-purple-100 text-purple-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedAgent.mode.toUpperCase()}
                  </span>
                </div>

                {/* Built-in Status */}
                <div>
                  <h3 className="text-sm font-semibold text-[#435663] mb-1">
                    Built-in
                  </h3>
                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                    selectedAgent.builtIn ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedAgent.builtIn ? 'System Agent' : 'Custom Agent'}
                  </span>
                </div>

                {/* Permissions */}
                <div>
                  <h3 className="text-sm font-semibold text-[#435663] mb-2">
                    Permissions
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#435663]">Edit:</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${
                        selectedAgent.permission.edit === 'allow' ? 'bg-green-100 text-green-800' :
                        selectedAgent.permission.edit === 'deny' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedAgent.permission.edit}
                      </span>
                    </div>
                    {selectedAgent.permission.webfetch && (
                      <div className="flex justify-between">
                        <span className="text-[#435663]">Web Fetch:</span>
                        <span className={`px-2 py-0.5 rounded text-xs ${
                          selectedAgent.permission.webfetch === 'allow' ? 'bg-green-100 text-green-800' :
                          selectedAgent.permission.webfetch === 'deny' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {selectedAgent.permission.webfetch}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Model Configuration */}
                {selectedAgent.model && (
                  <div>
                    <h3 className="text-sm font-semibold text-[#435663] mb-1">
                      Model
                    </h3>
                    <div className="bg-[#F3F4F6] rounded p-2 text-sm">
                      <p className="text-[#313647]">
                        <span className="font-medium">Provider:</span> {selectedAgent.model.providerID}
                      </p>
                      <p className="text-[#313647]">
                        <span className="font-medium">Model:</span> {selectedAgent.model.modelID}
                      </p>
                    </div>
                  </div>
                )}

                {/* Parameters */}
                {(selectedAgent.temperature !== undefined || selectedAgent.topP !== undefined) && (
                  <div>
                    <h3 className="text-sm font-semibold text-[#435663] mb-1">
                      Parameters
                    </h3>
                    <div className="bg-[#F3F4F6] rounded p-2 text-sm space-y-1">
                      {selectedAgent.temperature !== undefined && (
                        <p className="text-[#313647]">
                          <span className="font-medium">Temperature:</span> {selectedAgent.temperature}
                        </p>
                      )}
                      {selectedAgent.topP !== undefined && (
                        <p className="text-[#313647]">
                          <span className="font-medium">TopP:</span> {selectedAgent.topP}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-[#9CA3AF]">
                <p>No agent selected yet</p>
                <p className="text-sm mt-2">Click the AgentSelector button to choose an agent</p>
              </div>
            )}
          </div>
        </div>

        {/* Selection History */}
        <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-[#435663] mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#313647]">
              Selection History ({selectionHistory.length})
            </h2>
            <button
              onClick={clearHistory}
              className="px-4 py-2 bg-[#435663] text-white rounded-lg hover:bg-[#313647] transition-colors text-sm"
            >
              Clear History
            </button>
          </div>

          {selectionHistory.length > 0 ? (
            <div className="space-y-2">
              {selectionHistory.map((agent, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-[#F3F4F6] rounded-lg"
                >
                  <span className="text-sm text-[#9CA3AF] w-8">#{index + 1}</span>
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: agent.color || '#A3B087' }}
                  />
                  <span className="text-sm font-medium text-[#313647] flex-1">
                    {agent.name}
                  </span>
                  <span className="text-xs text-[#9CA3AF]">
                    {agent.mode}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-[#9CA3AF]">
              <p>No selections yet</p>
              <p className="text-sm mt-1">Agent selections will appear here</p>
            </div>
          )}
        </div>

        {/* Testing Controls */}
        <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-[#A3B087]">
          <h2 className="text-2xl font-bold text-[#313647] mb-6">
            Testing Controls
          </h2>

          <div className="grid md:grid-cols-3 gap-4">
            <button
              onClick={clearLocalStorage}
              className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
            >
              Clear LocalStorage
            </button>

            <button
              onClick={() => window.location.reload()}
              className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Reload Page
            </button>

            <button
              onClick={() => {
                console.log('Current Agent:', selectedAgent);
                console.log('Selection History:', selectionHistory);
                console.log('LocalStorage:', localStorage.getItem('ocp-preferred-agent'));
              }}
              className="px-4 py-3 bg-[#A3B087] text-white rounded-lg hover:bg-[#8B9474] transition-colors font-medium"
            >
              Log to Console
            </button>
          </div>

          <div className="mt-6 p-4 bg-[#FFF8D4] rounded-lg">
            <h3 className="font-semibold text-[#313647] mb-2">Test Scenarios:</h3>
            <ul className="space-y-2 text-sm text-[#435663]">
              <li className="flex items-start gap-2">
                <span className="text-[#A3B087] font-bold">1.</span>
                <span>Select different agents and verify state updates in Current State panel</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#A3B087] font-bold">2.</span>
                <span>Clear localStorage and reload to test first-time user experience</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#A3B087] font-bold">3.</span>
                <span>Select an agent, reload page, and verify it persists from localStorage</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#A3B087] font-bold">4.</span>
                <span>Test dropdown open/close by clicking inside and outside the component</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#A3B087] font-bold">5.</span>
                <span>Check console logs for API calls and agent loading behavior</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Documentation Links */}
        <div className="mt-8 text-center">
          <a
            href="/test/chat"
            className="inline-block px-6 py-3 bg-[#313647] text-white rounded-lg hover:bg-[#435663] transition-colors font-medium"
          >
            View AgentSelector in Chat UI →
          </a>
        </div>
      </div>
    </div>
  );
}
