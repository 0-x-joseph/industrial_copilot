'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '@/components/ui';
import { energyAPI } from '@/lib/api';

/**
 * Chat Page - Full-featured chat interface with custom LLM integration
 * 
 * Features:
 * - Agent selection (Energy Expert, Cost Optimizer, etc.)
 * - Model display from settings
 * - Session management (sidebar)
 * - Real-time plant context injection
 */

// Types
interface Message {
  id: string;
  type: 'user' | 'assistant' | 'system' | 'error';
  content: string;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'failed';
  metadata?: {
    tokens?: number;
    model?: string;
  };
}

interface LLMSettings {
  apiEndpoint: string;
  apiKey: string;
  modelName: string;
}

interface Agent {
  id: string;
  name: string;
  description: string;
  systemPrompt: string;
  icon: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  agentId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Pre-defined agents for Energy Copilot
const AGENTS: Agent[] = [
  {
    id: 'energy-expert',
    name: 'Energy Expert',
    description: 'GTA operations, steam systems, and plant optimization',
    icon: 'settings',
    systemPrompt: `You are Energy Copilot, an expert AI assistant for industrial energy optimization at a chemical plant.

Your expertise includes:
- Gas Turbine Alternators (GTA) operations and optimization
- Steam production and distribution (HP/MP steam systems)
- Grid electricity management and peak/off-peak tariff optimization
- Sulfuric acid heat recovery systems
- Cost optimization and operational efficiency

Key plant parameters:
- 3 GTAs (Gas Turbine Alternators) producing electricity and extractable MP steam
- Sulfur recovery provides "free" steam at ~20 DH/ton
- Auxiliary boilers produce expensive steam at 284 DH/ton
- Grid peak hours: 17:00-22:00 at 1.271 DH/kWh, off-peak at 0.55 DH/kWh
- Critical MP pressure threshold: 8.5 bar minimum

When answering:
- Provide specific, actionable recommendations
- Include safety considerations when relevant
- Quantify financial impacts when possible
- Reference relevant operational parameters

Be concise but thorough. Use technical language appropriate for plant operators and engineers.`
  },
  {
    id: 'cost-optimizer',
    name: 'Cost Optimizer',
    description: 'Financial analysis and cost reduction strategies',
    icon: 'star',
    systemPrompt: `You are a Cost Optimization Specialist for an industrial chemical plant.

Focus areas:
- Minimizing operating costs (DH/hour)
- Peak vs off-peak electricity tariff optimization
- Steam source prioritization (Sulfur recovery > GTA extraction > Boiler)
- Grid import minimization strategies
- ROI calculations for operational changes

Cost reference points:
- Grid electricity: 1.271 DH/kWh (peak), 0.55 DH/kWh (off-peak)
- Sulfur recovery steam: ~20 DH/ton (essentially free, waste heat)
- GTA extraction steam: Variable cost based on power opportunity cost
- Auxiliary boiler steam: 284 DH/ton (most expensive)

Always quantify savings in DH/hour, DH/day, and annual projections.`
  },
  {
    id: 'safety-advisor',
    name: 'Safety Advisor',
    description: 'Process safety and operational limits',
    icon: 'dot',
    systemPrompt: `You are a Process Safety Specialist for an industrial chemical plant.

Critical safety parameters:
- MP steam pressure must stay above 8.5 bar (GTA trip risk below this)
- Monitor condenser vacuum during high GTA loading
- GTA startup/shutdown procedures require careful sequencing
- Steam flow ramp rates should be gradual to avoid thermal shock

Your role:
- Flag safety concerns in any operational change
- Recommend monitoring points for critical parameters
- Provide safety checks before major operational adjustments
- Explain consequences of safety limit violations

Always prioritize safety over cost optimization.`
  },
  {
    id: 'general',
    name: 'General Assistant',
    description: 'General questions and explanations',
    icon: 'agent-selector',
    systemPrompt: `You are a helpful AI assistant for an industrial energy management platform called Energy Copilot.

You can help with:
- Explaining plant operations and terminology
- General questions about energy systems
- Data interpretation and trend analysis
- Report generation assistance

Be helpful, clear, and educational in your responses.`
  }
];

// Header Component
const ChatHeader: React.FC<{
  currentAgent: Agent;
  modelName: string;
  onAgentChange: (agent: Agent) => void;
  onSettings: () => void;
  onDashboard: () => void;
}> = ({ currentAgent, modelName, onAgentChange, onSettings, onDashboard }) => {
  const [showAgentDropdown, setShowAgentDropdown] = useState(false);

  return (
    <header className="flex items-center justify-between px-4 py-2.5 bg-ocp-900 text-ocp-cream shadow-sm border-b border-ocp-400/30">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-ocp-accent to-ocp-500 rounded-lg flex items-center justify-center">
            <Icon name="agent-selector" size={16} color="inverse" />
          </div>
          <span className="text-base font-semibold">Energy Copilot</span>
        </div>
        
        {/* Navigation buttons */}
        <div className="flex items-center gap-1">
          <button 
            onClick={onDashboard}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium transition-colors rounded-lg text-ocp-cream-muted hover:bg-ocp-800 hover:text-ocp-cream"
          >
            <Icon name="dashboard-tab" size={16} color="inverse" />
            <span className="hidden sm:inline">Dashboard</span>
          </button>
          <a 
            href="/optimize"
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium transition-colors rounded-lg text-ocp-cream-muted hover:bg-ocp-800 hover:text-ocp-cream"
          >
            <Icon name="settings" size={16} color="inverse" />
            <span className="hidden sm:inline">Optimize</span>
          </a>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {/* Agent Selector */}
        <div className="relative">
          <button
            onClick={() => setShowAgentDropdown(!showAgentDropdown)}
            className="flex items-center gap-2 px-3 py-1.5 bg-ocp-800 rounded-lg border border-ocp-400/30 hover:border-ocp-accent transition-colors"
          >
            <Icon name={currentAgent.icon as any} size={16} color="accent" />
            <span className="text-sm text-ocp-cream hidden sm:inline">{currentAgent.name}</span>
            <Icon name="dropdown" size={16} color="inverse" />
          </button>

          {showAgentDropdown && (
            <div className="absolute right-0 top-full mt-1 w-64 bg-ocp-800 border border-ocp-400/30 rounded-lg shadow-xl z-50">
              <div className="p-2 border-b border-ocp-400/20">
                <div className="text-xs text-ocp-400 uppercase tracking-wide px-2">Select Agent</div>
              </div>
              <div className="p-1">
                {AGENTS.map((agent) => (
                  <button
                    key={agent.id}
                    onClick={() => {
                      onAgentChange(agent);
                      setShowAgentDropdown(false);
                    }}
                    className={`w-full flex items-start gap-3 p-2 rounded-lg transition-colors ${
                      currentAgent.id === agent.id
                        ? 'bg-ocp-accent/20 text-ocp-accent'
                        : 'text-ocp-cream hover:bg-ocp-700'
                    }`}
                  >
                    <Icon name={agent.icon as any} size={16} color={currentAgent.id === agent.id ? 'accent' : 'inverse'} />
                    <div className="text-left">
                      <div className="text-sm font-medium">{agent.name}</div>
                      <div className="text-xs text-ocp-400">{agent.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Model indicator */}
        {modelName && (
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-ocp-800 rounded-lg border border-ocp-400/30">
            <div className="w-2 h-2 rounded-full bg-ocp-accent animate-pulse" />
            <span className="text-xs text-ocp-300">{modelName}</span>
          </div>
        )}
        
        {/* Settings button */}
        <button 
          onClick={onSettings}
          className="p-2 rounded-lg hover:bg-ocp-800 transition-colors"
          aria-label="Settings"
        >
          <Icon name="settingsprimary" size={20} color="inverse" />
        </button>
      </div>
    </header>
  );
};

// Sidebar Component
const ChatSidebar: React.FC<{
  sessions: ChatSession[];
  currentSessionId: string | null;
  onNewChat: () => void;
  onSelectSession: (session: ChatSession) => void;
  onDeleteSession: (sessionId: string) => void;
  onCollapse: () => void;
}> = ({ sessions, currentSessionId, onNewChat, onSelectSession, onDeleteSession, onCollapse }) => {
  return (
    <aside className="w-64 bg-ocp-900 border-r border-ocp-400/30 flex flex-col h-full">
      <div className="p-4 border-b border-ocp-400/30">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-ocp-cream">Chat History</h2>
          <button onClick={onCollapse} className="p-1 hover:bg-ocp-800 rounded">
            <Icon name="sidebar" size={16} color="inverse" />
          </button>
        </div>
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-ocp-accent text-ocp-950 font-medium rounded-lg hover:bg-ocp-accent/90 transition-colors"
        >
          <Icon name="new-chat" size={16} color="primary" />
          New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {sessions.length === 0 ? (
          <div className="text-center py-8 text-ocp-400 text-sm">
            No chat history yet
          </div>
        ) : (
          <div className="space-y-1">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                  currentSessionId === session.id
                    ? 'bg-ocp-accent/20 text-ocp-accent'
                    : 'text-ocp-300 hover:bg-ocp-800 hover:text-ocp-cream'
                }`}
                onClick={() => onSelectSession(session)}
              >
                <Icon name="dot" size={16} color={currentSessionId === session.id ? 'accent' : 'inverse'} />
                <span className="flex-1 truncate text-sm">{session.title}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSession(session.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-ocp-700 rounded transition-opacity"
                >
                  <Icon name="minus" size={16} color="inverse" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

// Message Component
const MessageBubble: React.FC<{
  message: Message;
  onCopy: () => void;
}> = ({ message, onCopy }) => {
  const isUser = message.type === 'user';
  const isSystem = message.type === 'system';
  const isError = message.type === 'error';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 group`}>
      <div className={`flex gap-3 max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`
          w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
          ${isUser ? 'bg-ocp-accent' : isError ? 'bg-status-danger' : 'bg-ocp-700'}
        `}>
          <Icon 
            name={isUser ? 'dot' : isError ? 'minus' : 'agent-selector'} 
            size={16} 
            color="inverse" 
          />
        </div>

        {/* Message Content */}
        <div className={`
          px-4 py-3 rounded-2xl
          ${isUser 
            ? 'bg-ocp-accent text-ocp-950' 
            : isSystem
            ? 'bg-ocp-800 text-ocp-300 border border-ocp-400/30'
            : isError
            ? 'bg-status-danger-muted text-status-danger border border-status-danger/30'
            : 'bg-ocp-800 text-ocp-cream border border-ocp-400/30'
          }
        `}>
          {/* Header for assistant messages */}
          {!isUser && !isSystem && (
            <div className="flex items-center gap-2 mb-2 text-xs text-ocp-400">
              <span>{message.metadata?.model || 'Assistant'}</span>
              <span>•</span>
              <span>{message.timestamp.toLocaleTimeString()}</span>
              {message.metadata?.tokens && (
                <>
                  <span>•</span>
                  <span>{message.metadata.tokens} tokens</span>
                </>
              )}
            </div>
          )}

          {/* Message Text */}
          <div className="text-sm whitespace-pre-wrap leading-relaxed">
            {message.content}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-current/10 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={onCopy}
              className="flex items-center gap-1 px-2 py-1 text-xs rounded hover:bg-black/10 transition-colors"
            >
              <Icon name="copy" size={16} color={isUser ? 'primary' : 'inverse'} />
              Copy
            </button>
          </div>

          {/* Status indicator */}
          {isUser && message.status && (
            <div className="flex items-center justify-end gap-1 mt-1 text-xs opacity-70">
              {message.status === 'sending' && <span>Sending...</span>}
              {message.status === 'sent' && <span>Sent</span>}
              {message.status === 'failed' && <span className="text-status-danger">Failed</span>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Chat Page Component
export default function ChatPage() {
  const [settings, setSettings] = useState<LLMSettings | null>(null);
  const [currentAgent, setCurrentAgent] = useState<Agent>(AGENTS[0]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [liveData, setLiveData] = useState<any>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load settings and sessions from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('llm_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }

    const savedSessions = localStorage.getItem('chat_sessions');
    if (savedSessions) {
      const parsed = JSON.parse(savedSessions);
      setSessions(parsed.map((s: any) => ({
        ...s,
        createdAt: new Date(s.createdAt),
        updatedAt: new Date(s.updatedAt),
        messages: s.messages.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }))
      })));
    }

    const savedAgent = localStorage.getItem('chat_agent');
    if (savedAgent) {
      const agent = AGENTS.find(a => a.id === savedAgent);
      if (agent) setCurrentAgent(agent);
    }
  }, []);

  // Save sessions to localStorage
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('chat_sessions', JSON.stringify(sessions));
    }
  }, [sessions]);

  // Fetch live plant data
  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const data = await energyAPI.getLiveData();
        setLiveData(data);
      } catch (e) {
        console.error('Failed to fetch live data:', e);
      }
    };

    fetchLiveData();
    const interval = setInterval(fetchLiveData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [currentSession?.messages]);

  // Generate plant context
  const generateContext = () => {
    if (!liveData) return '';
    return `
Current Plant Status (Real-Time):
- Total Power: ${liveData.total_power_generated?.toFixed(1)} MW
- GTA 1: ${liveData.gta_operations?.gta1?.power?.toFixed(1)} MW
- GTA 2: ${liveData.gta_operations?.gta2?.power?.toFixed(1)} MW
- GTA 3: ${liveData.gta_operations?.gta3?.power?.toFixed(1)} MW
- MP Pressure: ${liveData.mp_pressure?.toFixed(2)} bar
- Grid Import: ${liveData.grid_import_estimated?.toFixed(1)} MW
- Operating Cost: ${liveData.cost_per_hour?.toFixed(0)} DH/hr
- Efficiency: ${liveData.efficiency_percent?.toFixed(1)}%
`;
  };

  // Create new chat session
  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [{
        id: '1',
        type: 'system',
        content: `Welcome! I'm ${currentAgent.name}. ${currentAgent.description}. How can I help you today?`,
        timestamp: new Date()
      }],
      agentId: currentAgent.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setSessions(prev => [newSession, ...prev]);
    setCurrentSession(newSession);
  };

  // Select session
  const handleSelectSession = (session: ChatSession) => {
    setCurrentSession(session);
    const agent = AGENTS.find(a => a.id === session.agentId);
    if (agent) setCurrentAgent(agent);
  };

  // Delete session
  const handleDeleteSession = (sessionId: string) => {
    setSessions(prev => prev.filter(s => s.id !== sessionId));
    if (currentSession?.id === sessionId) {
      setCurrentSession(null);
    }
  };

  // Change agent
  const handleAgentChange = (agent: Agent) => {
    setCurrentAgent(agent);
    localStorage.setItem('chat_agent', agent.id);
    
    // Update current session's agent if exists
    if (currentSession) {
      const updated = {
        ...currentSession,
        agentId: agent.id,
        updatedAt: new Date()
      };
      setCurrentSession(updated);
      setSessions(prev => prev.map(s => s.id === updated.id ? updated : s));
    }
  };

  // Send message
  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    if (!settings?.apiEndpoint) {
      alert('Please configure your LLM settings first. Go to Settings.');
      return;
    }

    // Create session if none exists
    let session = currentSession;
    if (!session) {
      session = {
        id: Date.now().toString(),
        title: input.slice(0, 30) + (input.length > 30 ? '...' : ''),
        messages: [],
        agentId: currentAgent.id,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      setSessions(prev => [session!, ...prev]);
      setCurrentSession(session);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date(),
      status: 'sending'
    };

    // Update session with user message
    const updatedSession = {
      ...session,
      title: session.messages.length === 0 ? input.slice(0, 30) + (input.length > 30 ? '...' : '') : session.title,
      messages: [...session.messages, userMessage],
      updatedAt: new Date()
    };
    setCurrentSession(updatedSession);
    setSessions(prev => prev.map(s => s.id === updatedSession.id ? updatedSession : s));
    
    setInput('');
    setIsTyping(true);

    try {
      const apiMessages = [
        { role: 'system', content: currentAgent.systemPrompt + '\n\n' + generateContext() },
        ...updatedSession.messages
          .filter(m => m.type !== 'system')
          .map(m => ({ role: m.type === 'user' ? 'user' : 'assistant', content: m.content })),
        { role: 'user', content: userMessage.content }
      ];

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages, settings })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      // Mark user message as sent and add assistant response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: data.content,
        timestamp: new Date(),
        metadata: {
          model: settings.modelName,
          tokens: data.usage?.total_tokens
        }
      };

      const finalSession = {
        ...updatedSession,
        messages: [
          ...updatedSession.messages.map(m => 
            m.id === userMessage.id ? { ...m, status: 'sent' as const } : m
          ),
          assistantMessage
        ],
        updatedAt: new Date()
      };
      
      setCurrentSession(finalSession);
      setSessions(prev => prev.map(s => s.id === finalSession.id ? finalSession : s));

    } catch (error) {
      console.error('Chat error:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'error',
        content: `Error: ${error instanceof Error ? error.message : 'Failed to get response'}`,
        timestamp: new Date()
      };

      const errorSession = {
        ...updatedSession,
        messages: [
          ...updatedSession.messages.map(m => 
            m.id === userMessage.id ? { ...m, status: 'failed' as const } : m
          ),
          errorMessage
        ],
        updatedAt: new Date()
      };
      
      setCurrentSession(errorSession);
      setSessions(prev => prev.map(s => s.id === errorSession.id ? errorSession : s));
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard?.writeText(content);
  };

  return (
    <div className="h-screen flex flex-col bg-ocp-950">
      <ChatHeader
        currentAgent={currentAgent}
        modelName={settings?.modelName || ''}
        onAgentChange={handleAgentChange}
        onSettings={() => window.location.href = '/settings'}
        onDashboard={() => window.location.href = '/dashboard'}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        {sidebarOpen && (
          <ChatSidebar
            sessions={sessions}
            currentSessionId={currentSession?.id || null}
            onNewChat={handleNewChat}
            onSelectSession={handleSelectSession}
            onDeleteSession={handleDeleteSession}
            onCollapse={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Sidebar toggle when collapsed */}
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="absolute top-20 left-4 z-10 p-2 bg-ocp-accent text-ocp-950 rounded-lg shadow-lg hover:bg-ocp-accent/90 transition-colors"
            >
              <Icon name="sidebar" size={16} color="primary" />
            </button>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="max-w-3xl mx-auto">
              {/* Settings warning */}
              {!settings?.apiKey && !settings?.apiEndpoint?.includes('localhost') && (
                <div className="mb-4 p-4 bg-status-warning-muted border border-status-warning/30 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Icon name="settings" size={20} color="secondary" />
                    <div>
                      <h4 className="font-semibold text-status-warning">Configure LLM Settings</h4>
                      <p className="text-sm text-ocp-300 mt-1">
                        <a href="/settings" className="text-ocp-accent underline">Go to Settings</a> to configure your AI provider.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Empty state */}
              {!currentSession && (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-gradient-to-br from-ocp-accent/20 to-ocp-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-ocp-400/30">
                    <Icon name="agent-selector" size={32} color="accent" />
                  </div>
                  <h2 className="text-xl font-bold text-ocp-cream mb-2">Energy Copilot</h2>
                  <p className="text-ocp-300 text-sm max-w-md mx-auto mb-6">
                    Your AI assistant for industrial energy optimization. Select an agent and start a conversation.
                  </p>
                  <button
                    onClick={handleNewChat}
                    className="px-4 py-2 bg-ocp-accent text-ocp-950 font-medium rounded-lg hover:bg-ocp-accent/90 transition-colors"
                  >
                    Start New Chat
                  </button>
                </div>
              )}

              {/* Messages */}
              {currentSession?.messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  message={message}
                  onCopy={() => handleCopyMessage(message.content)}
                />
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-center gap-2 p-4 text-ocp-400">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-ocp-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-ocp-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-ocp-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-sm">Assistant is thinking...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t border-ocp-400/30 bg-ocp-900/50 p-4">
            <div className="max-w-3xl mx-auto">
              <div className="flex gap-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Message ${currentAgent.name}...`}
                  disabled={isTyping}
                  className="flex-1 px-4 py-3 bg-ocp-800 border border-ocp-400/30 rounded-lg text-ocp-cream placeholder-ocp-400 focus:outline-none focus:border-ocp-accent transition-colors disabled:opacity-50"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="px-4 py-3 bg-ocp-accent text-ocp-950 font-semibold rounded-lg hover:bg-ocp-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Icon name="send" size={20} color="primary" />
                </button>
              </div>
              <div className="mt-2 text-xs text-ocp-500 text-center">
                Press Enter to send • Using {currentAgent.name}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
