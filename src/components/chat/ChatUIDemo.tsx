'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Icon, HeaderIcon, ContextIcon, ActionIcon, ChatIcon } from '@/components/ui';

// Types for enhanced chat functionality
interface Message {
  id: string;
  type: 'user' | 'assistant' | 'system' | 'error';
  content: string;
  timestamp: Date;
  status?: 'sending' | 'sent' | 'failed';
  metadata?: {
    tokens?: number;
    model?: string;
    hasCode?: boolean;
  };
}

interface ChatState {
  messages: Message[];
  isTyping: boolean;
  currentInput: string;
}

/**
 * Enhanced Header Bar Component with improved interactions and mobile responsiveness
 */
export const ChatHeader: React.FC<{ 
  onSidebarToggle?: () => void;
  onSettings?: () => void;
}> = ({ onSidebarToggle, onSettings }) => {
  return (
    <header className="flex items-center justify-between px-4 py-2.5 bg-[#313647] text-[#FFF8D4] shadow-sm border-b border-[#435663]">
      <div className="flex items-center gap-3">
        <button 
          onClick={onSidebarToggle}
          className="p-1.5 rounded-md hover:bg-[#435663] transition-colors"
          aria-label="Toggle sidebar"
        >
          <Icon name="hamburger-menu" size={20} color="inverse" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[#A3B087] rounded-full flex items-center justify-center">
            <Icon name="agent-selector" size={16} color="inverse" />
          </div>
          <span className="text-base font-semibold">OCP Chat</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">


        {/* Mobile Layout - Compact dropdowns */}
        <div className="flex sm:hidden items-center gap-1">
          <button className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-[#435663] hover:bg-[#A3B087] transition-all duration-200 group">
            <Icon name="agent-selector" size={16} color="inverse" />
            <Icon name="dropdown" size={16} color="inverse" className="group-hover:rotate-180 transition-transform" />
          </button>
          
          <button className="flex items-center gap-1 px-2 py-1.5 rounded-lg bg-[#435663] hover:bg-[#A3B087] transition-all duration-200 group">
            <div className="w-3 h-3 bg-gradient-to-br from-[#A3B087] to-[#313647] rounded-sm flex items-center justify-center">
              <span className="text-[7px] font-bold text-white">AI</span>
            </div>
            <Icon name="dropdown" size={16} color="inverse" className="group-hover:rotate-180 transition-transform" />
          </button>
        </div>
        
        <div className="flex items-center gap-0.5">
          <button 
            onClick={onSettings}
            className="p-1.5 rounded-md hover:bg-[#435663] transition-colors"
            aria-label="Chat settings"
          >
            <Icon name="settingsprimary" size={20} color="inverse" />
          </button>
          <button 
            onClick={onSettings}
            className="p-1.5 rounded-md hover:bg-[#435663] transition-colors"
            aria-label="Share chat"
          >
            <Icon name="sharecream" size={20} color="inverse" />
          </button>
        </div>
      </div>
    </header>
  );
};



/**
 * Example Sidebar Component with mobile improvements
 * Based on Web Chat UI Specification sidebar design
 */
export const ChatSidebar: React.FC<{ onNewChat?: () => void }> = ({ onNewChat }) => {
  const recentChats = [
    { id: 1, title: 'Q3 Energy Analysis', active: false },
    { id: 2, title: 'Sales Visualization', active: true },
    { id: 3, title: 'Dashboard Help', active: false },
  ];

  return (
    <aside className="w-64 bg-[#313647] border-r border-[#435663] p-4 h-full overflow-y-auto">
      {/* Mobile header with close button */}
      <div className="md:hidden flex items-center justify-between mb-4 pb-2 border-b border-[#435663]">
        <h2 className="text-lg font-semibold text-[#FFF8D4]">Chat History</h2>
        <button className="p-1.5 rounded-md hover:bg-[#435663] transition-colors">
          <Icon name="minus" size={16} color="inverse" />
        </button>
      </div>

      <div className="mb-6">
        <button 
          onClick={onNewChat} 
          className="flex items-center gap-2 w-full px-4 py-2 text-sm font-medium transition-colors rounded-lg bg-[#A3B087] text-white hover:bg-[#8B9474] shadow-sm"
        >
          <Icon name="new-chat" size={16} color="inverse" />
          <span>New Chat</span>
        </button>
      </div>
      
      <div>
        <h3 className="text-sm font-semibold text-[#FFF8D4] mb-3">Recent Chats</h3>
        <div className="space-y-1">
          {recentChats.map((chat) => (
            <button
              key={chat.id}
              className={`flex items-center gap-2 w-full px-4 py-2 text-sm font-medium transition-colors rounded-lg text-left group ${
                chat.active 
                  ? 'bg-[#A3B087] text-white' 
                  : 'text-[#FFF8D4] hover:bg-[#435663] hover:text-white'
              }`}
            >
              <Icon 
                name="dot" 
                size={16} 
                color={chat.active ? 'inverse' : 'inverse'} 
              />
              <span className="truncate flex-1">{chat.title}</span>
              <Icon 
                name="chat-options" 
                size={16}
                color={chat.active ? 'inverse' : 'inverse'}
                className="opacity-0 group-hover:opacity-100 flex-shrink-0"
              />
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

/**
 * Message Component with enhanced styling and interactions
 */
export const MessageBubble: React.FC<{ message: Message; onCopy?: () => void }> = ({ message, onCopy }) => {
  const isUser = message.type === 'user';
  const isSystem = message.type === 'system';
  const isError = message.type === 'error';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6 group`}>
      <div className={`flex gap-3 max-w-4xl ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`
          w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1
          ${isUser ? 'bg-[#A3B087]' : isSystem ? 'bg-[#435663]' : isError ? 'bg-red-500' : 'bg-[#313647]'}
        `}>
          <Icon 
            name={isUser ? 'dot' : isSystem ? 'settings' : isError ? 'minus' : 'agent-selector'} 
            size={16} 
            color="inverse" 
            
          />
        </div>

        {/* Message Content */}
        <div className={`
          px-4 py-3 rounded-2xl max-w-2xl relative
          ${isUser 
            ? 'bg-[#A3B087] text-white' 
            : isSystem 
            ? 'bg-[#F3F4F6] text-[#435663] border border-[#E5E7EB]'
            : isError 
            ? 'bg-red-50 text-red-700 border border-red-200'
            : 'bg-white text-[#313647] border border-[#E5E7EB] shadow-sm'
          }
        `}>
          {/* Message Header */}
          {!isUser && (
            <div className="flex items-center gap-2 mb-2 text-xs text-[#9CA3AF]">
              <span className="font-medium">
                {isSystem ? 'System' : isError ? 'Error' : message.metadata?.model || 'Assistant'}
              </span>
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
          <div className="prose prose-sm max-w-none">
            {message.content.includes('```') ? (
              <MessageWithCode content={message.content} />
            ) : (
              <p className="leading-relaxed">{message.content}</p>
            )}
          </div>

          {/* Message Actions */}
          <div className={`
            flex items-center gap-2 mt-3 pt-2 border-t border-opacity-20
            ${isUser ? 'border-white' : 'border-[#E5E7EB]'}
            opacity-0 group-hover:opacity-100 transition-opacity
          `}>
            <button 
              onClick={onCopy}
              className={`
                flex items-center gap-1 px-2 py-1 rounded text-xs hover:bg-black hover:bg-opacity-10 transition-colors
                ${isUser ? 'text-white' : 'text-[#9CA3AF]'}
              `}
            >
              <Icon name="copy" size={16} color={isUser ? 'inverse' : 'muted'} />
              Copy
            </button>
            {!isUser && (
              <>
                <button className="flex items-center gap-1 px-2 py-1 rounded text-xs text-[#9CA3AF] hover:bg-black hover:bg-opacity-10 transition-colors">
                  <Icon name="thumbs-up" size={16} color="muted" />
                  Good
                </button>
                <button className="flex items-center gap-1 px-2 py-1 rounded text-xs text-[#9CA3AF] hover:bg-black hover:bg-opacity-10 transition-colors">
                  <Icon name="share" size={16} color="muted" />
                  Share
                </button>
              </>
            )}
          </div>

          {/* Message Status for User Messages */}
          {isUser && message.status && (
            <div className="flex items-center justify-end gap-1 mt-2 text-xs text-white text-opacity-70">
              {message.status === 'sending' && (
                <>
                  <div className="w-3 h-3 border border-white border-opacity-30 border-t-white rounded-full animate-spin" />
                  <span>Sending...</span>
                </>
              )}
              {message.status === 'sent' && (
                <>
                  <Icon name="thumbs-up" size={16} color="inverse" className="opacity-70" />
                  <span>Sent</span>
                </>
              )}
              {message.status === 'failed' && (
                <>
                  <Icon name="minus" size={16} color="inverse" className="opacity-70" />
                  <span>Failed</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Code Block Component with syntax highlighting
 */
export const MessageWithCode: React.FC<{ content: string }> = ({ content }) => {
  const parts = content.split(/(```[\s\S]*?```)/);
  
  return (
    <div>
      {parts.map((part, index) => {
        if (part.startsWith('```')) {
          const lines = part.split('\n');
          const language = lines[0].replace('```', '').trim();
          const code = lines.slice(1, -1).join('\n');
          
          return (
            <div key={index} className="my-4 rounded-lg overflow-hidden border border-[#E5E7EB]">
              <div className="flex items-center justify-between px-4 py-2 bg-[#F8F9FA] border-b border-[#E5E7EB]">
                <span className="text-xs font-medium text-[#6B7280]">{language || 'code'}</span>
                <button 
                  onClick={() => navigator.clipboard?.writeText(code)}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-[#6B7280] hover:text-[#313647] transition-colors"
                >
                  <Icon name="copy" size={16} color="muted" />
                  Copy
                </button>
              </div>
              <pre className="p-4 bg-[#FAFBFC] text-sm text-[#313647] overflow-x-auto">
                <code>{code}</code>
              </pre>
            </div>
          );
        } else {
          return <p key={index} className="leading-relaxed">{part}</p>;
        }
      })}
    </div>
  );
};



/**
 * Enhanced Context Panel Component - Collapsible file/tab/workspace selectors
 */
const ContextPanel: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
  const [activeTab, setActiveTab] = useState<'files' | 'commands' | 'agents' | 'tabs' | 'workspace'>('files');
  
  // Selection state management for tabs with radio-style selection
  const [selectedAgent, setSelectedAgent] = useState<string>('Data Analyst');
  const [selectedDashboard, setSelectedDashboard] = useState<string>('Energy Dashboard');
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>('Main');
  
  if (!isVisible) return null;

  return (
    <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-[#E5E7EB] rounded-lg shadow-lg overflow-hidden z-50">
      {/* Tab Headers */}
      <div className="flex border-b border-[#E5E7EB] bg-[#F9FAFB]">
        {[
          { id: 'files', label: 'Files', icon: 'files' },
          { id: 'commands', label: 'Commands', icon: 'commands' },
          { id: 'agents', label: 'Agents', icon: 'agent-selector' },
          { id: 'tabs', label: 'Dashboard', icon: 'dashboard-tab' },
          { id: 'workspace', label: 'Workspace', icon: 'workspace' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-[#A3B087] text-[#FFF8D4] border-b-2 border-[#A3B087]'
                : 'bg-white text-[#313647] hover:bg-[#F8FAFC] hover:text-[#313647]'
            }`}
          >
            <Icon name={tab.icon as any} size={16} color={activeTab === tab.id ? 'inverse' : 'primary'} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-4 max-h-64 overflow-y-auto">
        {activeTab === 'files' && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-[#313647] mb-3">Select Context Files</div>
            {[
              { name: 'energy_data.pdf', selected: true, size: '2.4 MB' },
              { name: 'sales_report_q3.xlsx', selected: true, size: '1.8 MB' },
              { name: 'team_notes.docx', selected: false, size: '456 KB' },
              { name: 'budget_2024.pdf', selected: false, size: '3.2 MB' },
            ].map((file) => (
              <label key={file.name} className="flex items-center gap-3 p-2 rounded-md hover:bg-[#F3F4F6] cursor-pointer">
                <input type="checkbox" defaultChecked={file.selected} className="rounded text-[#A3B087] focus:ring-[#A3B087]" />
                <Icon name="files" size={16} color="secondary" />
                <div className="flex-1">
                  <div className="text-sm font-medium text-[#313647]">{file.name}</div>
                  <div className="text-xs text-[#9CA3AF]">{file.size}</div>
                </div>
              </label>
            ))}
            <button className="flex items-center gap-2 w-full p-2 border border-dashed border-[#E5E7EB] rounded-md text-[#435663] hover:bg-[#F3F4F6] transition-colors">
              <Icon name="upload" size={16} color="secondary" />
              <span className="text-sm">Upload new file</span>
            </button>
          </div>
        )}

        {activeTab === 'commands' && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-[#313647] mb-3">Available Commands</div>
            {[
              { name: '/create-chart', enabled: true, desc: 'Generate data visualizations' },
              { name: '/optimize-energy', enabled: true, desc: 'Run energy optimization analysis' },
              { name: '/analyze-data', enabled: true, desc: 'Perform statistical analysis' },
              { name: '/export-dashboard', enabled: false, desc: 'Export current dashboard' },
              { name: '/generate-report', enabled: false, desc: 'Create comprehensive reports' },
            ].map((command) => (
              <label key={command.name} className="flex items-center gap-3 p-2 rounded-md hover:bg-[#F3F4F6] cursor-pointer">
                <input type="checkbox" defaultChecked={command.enabled} className="rounded text-[#A3B087] focus:ring-[#A3B087]" />
                <Icon name="commands" size={16} color="secondary" />
                <div className="flex-1">
                  <div className="text-sm font-mono font-medium text-[#313647]">{command.name}</div>
                  <div className="text-xs text-[#9CA3AF]">{command.desc}</div>
                </div>
              </label>
            ))}
          </div>
        )}

        {activeTab === 'agents' && (
          <div>
            <div className="text-sm font-medium text-[#313647] mb-3">Available Agents</div>
            <div className="flex border-b border-[#E5E7EB] bg-[#F9FAFB]">
              {[
                { name: 'Data Analyst', active: true },
                { name: 'Energy Expert', active: false },
                { name: 'Business Strategist', active: false },
                { name: 'Technical Writer', active: false },
              ].map((agent) => (
                <button
                  key={agent.name}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
                    agent.active
                      ? 'bg-[#A3B087] text-white border-b-2 border-[#A3B087]'
                      : 'text-[#435663] hover:bg-[#E5E7EB] hover:text-[#313647]'
                  }`}
                >
                  <Icon name="agent-selector" size={16} color={agent.active ? 'inverse' : 'secondary'} />
                  {agent.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tabs' && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-[#313647] mb-3">Dashboard Tabs</div>
            {[
              { name: 'Energy Dashboard', desc: 'Energy consumption & optimization' },
              { name: 'Sales Performance', desc: 'Sales metrics and trends' },
              { name: 'Operations', desc: 'Operational efficiency metrics' },
              { name: 'Financial Summary', desc: 'Financial KPIs and reports' },
            ].map((tab) => {
              const isSelected = selectedDashboard === tab.name;
              return (
                <div 
                  key={tab.name}
                  onClick={() => setSelectedDashboard(tab.name)}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#A3B087] text-[#FFF8D4] shadow-md' : 'bg-white border border-[#E5E7EB] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] hover:shadow-sm'
                  }`}
                >
                  <Icon name="dashboard-tab" size={16} color={isSelected ? 'inverse' : 'primary'} />
                  <div className="flex-1">
                    <div className={`text-sm font-medium ${isSelected ? 'text-[#FFF8D4]' : 'text-[#313647]'}`}>{tab.name}</div>
                    <div className={`text-xs ${isSelected ? 'text-[#FFF8D4]' : 'text-[#313647]'}`}>{tab.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'workspace' && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-[#313647] mb-3">Workspaces</div>
            {[
              { name: 'Main', desc: 'Primary workspace', files: 12 },
              { name: 'Q4 Planning', desc: 'Quarterly planning workspace', files: 8 },
              { name: 'Sales Analysis', desc: 'Sales team workspace', files: 15 },
              { name: 'Energy Optimization', desc: 'Energy efficiency projects', files: 6 },
            ].map((workspace) => {
              const isSelected = selectedWorkspace === workspace.name;
              return (
                <div 
                  key={workspace.name}
                  onClick={() => setSelectedWorkspace(workspace.name)}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#A3B087] text-[#FFF8D4] shadow-md' : 'bg-white border border-[#E5E7EB] hover:bg-[#F8FAFC] hover:border-[#CBD5E1] hover:shadow-sm'
                  }`}
                >
                  <Icon name="workspace" size={16} color={isSelected ? 'inverse' : 'primary'} />
                  <div className="flex-1">
                    <div className={`text-sm font-medium ${isSelected ? 'text-[#FFF8D4]' : 'text-[#313647]'}`}>{workspace.name}</div>
                    <div className={`text-xs ${isSelected ? 'text-[#FFF8D4]' : 'text-[#313647]'}`}>
                      {workspace.desc} • {workspace.files} files
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Enhanced Message Input Component with collapsible context panels
 */
export const MessageComposer: React.FC<{
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  disabled?: boolean;
  isTyping?: boolean;
}> = ({ value, onChange, onSubmit, disabled = false, isTyping = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showContextPanels, setShowContextPanels] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !disabled && !isTyping) {
      onSubmit(value.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const toggleContextPanels = () => {
    setShowContextPanels(!showContextPanels);
  };

  return (
    <div className="relative p-3 bg-white border-t border-[#E5E7EB]">
      {/* Context Panels */}
      <ContextPanel isVisible={showContextPanels} />
      
      {/* ChatGPT-style Single Cell Input */}
      <form onSubmit={handleSubmit} className="w-full">
        <div className={`
          flex items-center gap-3 px-4 py-3 border rounded-xl transition-all duration-200 bg-white
          ${isExpanded ? 'border-[#A3B087] ring-2 ring-[#A3B087] ring-opacity-20 shadow-sm' : 'border-[#E5E7EB] hover:border-[#A3B087]'}
          ${disabled ? 'opacity-50' : ''}
          focus-within:border-[#A3B087] focus-within:ring-2 focus-within:ring-[#A3B087] focus-within:ring-opacity-20
        `}>
          {/* Context Toggle Button - Integrated */}
          <button 
            type="button"
            onClick={toggleContextPanels}
            className={`p-1.5 rounded-lg transition-all duration-200 flex items-center justify-center flex-shrink-0 ${
              showContextPanels 
                ? 'bg-[#A3B087] text-white shadow-sm' 
                : 'hover:bg-[#F3F4F6] text-[#435663]'
            }`}
            aria-label={showContextPanels ? "Hide context options" : "Show context options"}
            disabled={disabled}
          >
            <Icon 
              name={showContextPanels ? "minus" : "new-chat"} 
              size={16} 
              color={showContextPanels ? 'inverse' : 'secondary'} 
            />
          </button>

          {/* Input Field - Expanded */}
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsExpanded(true)}
            onBlur={() => setIsExpanded(false)}
            placeholder={isTyping ? "Assistant is responding..." : "Message OCP Chat..."}
            disabled={disabled || isTyping}
            className="flex-1 text-[#313647] placeholder-[#9CA3AF] bg-transparent focus:outline-none text-base py-1"
          />
          
          {/* Upload Button - Integrated */}
          <button 
            type="button"
            className="p-1.5 rounded-lg hover:bg-[#F3F4F6] transition-colors flex-shrink-0"
            aria-label="Upload files"
            disabled={disabled}
          >
            <Icon name="upload" size={16} color="secondary" />
          </button>
          
          {/* Send Button - Integrated */}
          <button 
            type="submit"
            disabled={!value.trim() || disabled || isTyping}
            className={`
              p-1.5 rounded-lg transition-all duration-200 flex items-center justify-center flex-shrink-0
              ${value.trim() && !disabled && !isTyping
                ? 'bg-[#A3B087] hover:bg-[#8B9474] text-white shadow-sm hover:shadow' 
                : 'bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed'
              }
            `}
            aria-label="Send message"
          >
            <Icon name="send" size={16} color={value.trim() && !disabled && !isTyping ? 'inverse' : 'muted'} />
          </button>
        </div>
      </form>
    </div>
  );
};





/**
 * Complete Enhanced Chat UI Demo Component
 * Advanced chat interface with state management and enhanced features
 */
export const ChatUIDemo: React.FC = () => {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [
      {
        id: '1',
        type: 'system',
        content: 'Welcome to OCP Chat! I\'m your AI assistant ready to help with data analysis, energy optimization, and dashboard insights.',
        timestamp: new Date(Date.now() - 300000),
      },
      {
        id: '2',
        type: 'user',
        content: 'Can you help me analyze the Q3 energy consumption data?',
        timestamp: new Date(Date.now() - 240000),
        status: 'sent'
      },
      {
        id: '3',
        type: 'assistant',
        content: 'I\'d be happy to help you analyze Q3 energy consumption! Let me break down what I can do:\n\n1. **Data Overview**: I can summarize key metrics and trends\n2. **Comparative Analysis**: Compare against previous quarters\n3. **Efficiency Insights**: Identify optimization opportunities\n\nHere\'s a sample code snippet to get started:\n\n```python\n# Energy consumption analysis\nimport pandas as pd\nimport matplotlib.pyplot as plt\n\n# Load Q3 data\ndf = pd.read_csv(\'q3_energy_data.csv\')\nprint(f"Total consumption: {df[\'consumption\'].sum():.2f} kWh")\n\n# Create visualization\nplt.plot(df[\'date\'], df[\'consumption\'])\nplt.title(\'Q3 Energy Consumption Trend\')\nplt.show()\n```\n\nWould you like me to focus on any specific aspect of the analysis?',
        timestamp: new Date(Date.now() - 180000),
        metadata: {
          tokens: 156,
          model: 'GPT-4',
          hasCode: true
        }
      },
      {
        id: '4',
        type: 'user',
        content: 'Perfect! Can you also show me how to create a dashboard widget for this?',
        timestamp: new Date(Date.now() - 60000),
        status: 'sent'
      }
    ],
    isTyping: true,
    currentInput: ''
  });

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatState.messages]);

  // Simulate typing response after user message
  useEffect(() => {
    if (chatState.isTyping) {
      const timer = setTimeout(() => {
        const newMessage: Message = {
          id: Date.now().toString(),
          type: 'assistant',
          content: 'Absolutely! Here\'s how to create a dashboard widget for energy consumption:\n\n```typescript\n// Dashboard Widget Component\nimport { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from \'recharts\';\n\nconst EnergyWidget = ({ data }) => {\n  return (\n    <div className="bg-white p-6 rounded-lg shadow">\n      <h3 className="text-lg font-semibold mb-4">Q3 Energy Consumption</h3>\n      <LineChart width={400} height={300} data={data}>\n        <CartesianGrid strokeDasharray="3 3" />\n        <XAxis dataKey="date" />\n        <YAxis />\n        <Tooltip />\n        <Line type="monotone" dataKey="consumption" stroke="#A3B087" strokeWidth={2} />\n      </LineChart>\n    </div>\n  );\n};\n```\n\nThis widget includes:\n✅ Responsive design\n✅ Interactive tooltips\n✅ OCP brand colors\n✅ Real-time data binding\n\nWant me to add any specific features like alerts or comparative views?',
          timestamp: new Date(),
          metadata: {
            tokens: 198,
            model: 'GPT-4',
            hasCode: true
          }
        };

        setChatState(prev => ({
          ...prev,
          messages: [...prev.messages, newMessage],
          isTyping: false
        }));
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [chatState.isTyping]);

  const handleSendMessage = () => {
    if (!chatState.currentInput.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: chatState.currentInput,
      timestamp: new Date(),
      status: 'sending'
    };

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, newMessage],
      currentInput: '',
      isTyping: true
    }));

    // Simulate message sent status
    setTimeout(() => {
      setChatState(prev => ({
        ...prev,
        messages: prev.messages.map(msg => 
          msg.id === newMessage.id ? { ...msg, status: 'sent' } : msg
        )
      }));
    }, 500);
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard?.writeText(content);
  };

  const handleNewChat = () => {
    setChatState({
      messages: [
        {
          id: '1',
          type: 'system',
          content: 'Welcome to OCP Chat! I\'m your AI assistant ready to help with data analysis, energy optimization, and dashboard insights.',
          timestamp: new Date(),
        }
      ],
      isTyping: false,
      currentInput: ''
    });
  };

  const handleSettings = () => {
    // TODO: Implement settings modal/drawer
    console.log('Settings clicked - implement settings modal');
    alert('Settings functionality will be implemented here');
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-[#FFF8D4] to-[#F3F4F6]">
      <ChatHeader 
        onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} 
        onSettings={handleSettings}
      />

      
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop sidebar - always visible when open */}
        {sidebarOpen && (
          <div className="hidden md:block">
            <ChatSidebar />
          </div>
        )}
        
        {/* Mobile sidebar - overlay with smooth animations */}
        {sidebarOpen && (
          <div className="md:hidden absolute inset-0 z-50 flex animate-in fade-in duration-200">
            <div className="w-64 bg-white shadow-xl transform transition-transform duration-300 ease-out animate-in slide-in-from-left">
              <ChatSidebar />
            </div>
            <div 
              className="flex-1 bg-black bg-opacity-50 transition-opacity duration-200"
              onClick={() => setSidebarOpen(false)}
            />
          </div>
        )}
        
        <main className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 p-3 md:p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              {/* Messages */}
              {chatState.messages.map((message) => (
                <MessageBubble 
                  key={message.id} 
                  message={message} 
                  onCopy={() => handleCopyMessage(message.content)}
                />
              ))}
              
              {/* Typing Indicator */}
              {chatState.isTyping && (
                <div className="flex items-center gap-2 p-4 text-[#435663]">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-[#A3B087] rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-[#A3B087] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-[#A3B087] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <span className="text-sm">Assistant is typing...</span>
                </div>
              )}
              
              {/* Empty state if no messages */}
              {chatState.messages.length === 0 && (
                <div className="text-center text-[#435663] py-16">
                  <Icon name="agent-selector" size={32} color="secondary" className="mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Start a conversation</h3>
                  <p className="text-[#9CA3AF] max-w-md mx-auto">
                    Ask me about energy optimization, data analysis, or dashboard creation. 
                    I'm here to help with all your OCP needs!
                  </p>
                </div>
              )}
              
              {/* Scroll anchor */}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          <MessageComposer 
            value={chatState.currentInput}
            onChange={(value: string) => setChatState(prev => ({ ...prev, currentInput: value }))}
            onSubmit={handleSendMessage}
            disabled={false}
            isTyping={chatState.isTyping}
          />
        </main>
      </div>
    </div>
  );
};

export default ChatUIDemo;