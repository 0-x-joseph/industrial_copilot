'use client';

import React, { useState } from 'react';
import { Icon } from '@/components/ui';

/**
 * Dashboard Header Component - Using same design as ChatHeader
 */
const DashboardHeader: React.FC<{ 
  onChat?: () => void;
  onWorkspace?: () => void;
  onSettings?: () => void;
}> = ({ onChat, onWorkspace, onSettings }) => {
  return (
    <header className="flex items-center justify-between px-4 py-2.5 bg-[#313647] text-[#FFF8D4] shadow-sm border-b border-[#435663]">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[#A3B087] rounded-full flex items-center justify-center">
            <Icon name="dashboard-tab" size={16} color="inverse" />
          </div>
          <span className="text-base font-semibold">OCP Dashboard</span>
        </div>
        
        {/* Chat and Workspace buttons */}
        <div className="flex items-center gap-1">
          <button 
            onClick={onChat}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors rounded-lg text-[#FFF8D4] hover:bg-[#435663] hover:text-white"
            aria-label="Chat"
          >
            <Icon name="agent-selector" size={16} color="inverse" />
            <span>Chat</span>
          </button>
          <button 
            onClick={onWorkspace}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors rounded-lg text-[#FFF8D4] hover:bg-[#435663] hover:text-white"
            aria-label="Workspace"
          >
            <Icon name="workspace" size={16} color="inverse" />
            <span>Workspace</span>
          </button>
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
            aria-label="Dashboard settings"
          >
            <Icon name="settingsprimary" size={20} color="inverse" />
          </button>
          <button 
            onClick={onSettings}
            className="p-1.5 rounded-md hover:bg-[#435663] transition-colors"
            aria-label="Share dashboard"
          >
            <Icon name="sharecream" size={20} color="inverse" />
          </button>
        </div>
      </div>
    </header>
  );
};

/**
 * Dashboard Main Content Component
 */
const DashboardContent: React.FC = () => {
  return (
    <div className="flex-1 bg-[#FFF8D4] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Empty dashboard placeholder */}
        <div className="bg-white rounded-lg border border-[#435663]/20 p-8 text-center">
          <div className="w-16 h-16 bg-[#A3B087]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="dashboard-tab" size={32} color="primary" />
          </div>
          <h2 className="text-2xl font-semibold text-[#313647] mb-2">
            Welcome to Your Dashboard
          </h2>
          <p className="text-[#435663] mb-6 max-w-md mx-auto">
            Your dashboard is ready for customization. Start by adding charts, visualizations, and widgets to track your data.
          </p>
          
          {/* Quick action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="flex items-center gap-2 px-6 py-3 bg-[#A3B087] text-white rounded-lg font-medium hover:bg-[#A3B087]/90 transition-colors">
              <Icon name="add" size={20} color="inverse" />
              <span>Add Chart</span>
            </button>
            <button className="flex items-center gap-2 px-6 py-3 border border-[#A3B087] text-[#A3B087] rounded-lg font-medium hover:bg-[#A3B087]/5 transition-colors">
              <Icon name="workspace" size={20} color="accent" />
              <span>Browse Templates</span>
            </button>
          </div>
        </div>
        
        {/* Future dashboard sections placeholder */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Chart placeholders */}
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-lg border border-[#435663]/20 p-4 h-48">
              <div className="w-full h-full bg-[#A3B087]/5 rounded flex items-center justify-center">
                <div className="text-center">
                  <div className="w-8 h-8 bg-[#A3B087]/20 rounded mx-auto mb-2 flex items-center justify-center">
                    <Icon name="dashboard-tab" size={16} color="accent" />
                  </div>
                  <p className="text-sm text-[#435663]">Chart {i}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Main Dashboard Page Component
 */
export default function DashboardPage() {
  const [notifications] = useState<string[]>([]);

  // Navigation handlers
  const handleChatNavigation = () => {
    window.location.href = '/test/chat';
  };

  const handleWorkspaceNavigation = () => {
    console.log('Navigate to Workspace');
    // TODO: Implement workspace navigation
  };

  const handleSettingsNavigation = () => {
    console.log('Open Dashboard Settings');
    // TODO: Implement settings modal/page
  };

  return (
    <div className="h-screen flex flex-col bg-[#FFF8D4]">
      {/* Dashboard Header */}
      <DashboardHeader 
        onChat={handleChatNavigation}
        onWorkspace={handleWorkspaceNavigation}
        onSettings={handleSettingsNavigation}
      />
      
      {/* Main Dashboard Content */}
      <DashboardContent />
      
      {/* Notification system (future enhancement) */}
      {notifications.length > 0 && (
        <div className="fixed bottom-4 right-4 z-50">
          {notifications.map((notification, index) => (
            <div 
              key={index}
              className="bg-[#A3B087] text-white px-4 py-2 rounded-lg shadow-lg mb-2"
            >
              {notification}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}