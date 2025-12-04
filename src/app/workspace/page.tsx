'use client';

import React, { useState } from 'react';
import { Icon } from '@/components/ui';

// Types for workspace items
interface WorkspaceItem {
  id: string;
  name: string;
  type: 'chart' | 'visualization' | 'dataset' | 'template' | 'notebook';
  category: string;
  tags: string[];
  created_at: string;
  modified_at: string;
  is_favorite: boolean;
  description?: string;
  preview_url?: string;
}

interface WorkspaceFolder {
  id: string;
  name: string;
  path: string;
  parent_folder_id?: string;
  items_count: number;
}

/**
 * Workspace Header Component - Consistent with Dashboard design
 */
const WorkspaceHeader: React.FC<{ 
  onChat?: () => void;
  onDashboard?: () => void;
  onSettings?: () => void;
}> = ({ onChat, onDashboard, onSettings }) => {
  return (
    <header className="flex items-center justify-between px-4 py-2.5 bg-[#313647] text-[#FFF8D4] shadow-sm border-b border-[#435663]">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-[#A3B087] rounded-full flex items-center justify-center">
            <Icon name="workspace" size={16} color="inverse" />
          </div>
          <span className="text-base font-semibold">OCP Workspace</span>
        </div>
        
        {/* Chat and Dashboard buttons */}
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
            onClick={onDashboard}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors rounded-lg text-[#FFF8D4] hover:bg-[#435663] hover:text-white"
            aria-label="Dashboard"
          >
            <Icon name="dashboard-tab" size={16} color="inverse" />
            <span>Dashboard</span>
          </button>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {/* Search bar */}
        <div className="hidden md:flex items-center gap-2 bg-[#435663] rounded-lg px-3 py-1.5">
          <Icon name="search" size={16} color="inverse" />
          <input 
            type="text" 
            placeholder="Search workspace..." 
            className="bg-transparent text-[#FFF8D4] text-sm placeholder-[#FFF8D4]/60 outline-none w-48"
          />
        </div>
        
        <div className="flex items-center gap-0.5">
          <button 
            onClick={onSettings}
            className="p-1.5 rounded-md hover:bg-[#435663] transition-colors"
            aria-label="Workspace settings"
          >
            <Icon name="settingsprimary" size={20} color="inverse" />
          </button>
          <button 
            onClick={onSettings}
            className="p-1.5 rounded-md hover:bg-[#435663] transition-colors"
            aria-label="Share workspace"
          >
            <Icon name="sharecream" size={20} color="inverse" />
          </button>
        </div>
      </div>
    </header>
  );
};

/**
 * Workspace Sidebar Component
 */
const WorkspaceSidebar: React.FC<{
  folders: WorkspaceFolder[];
  selectedFolder?: string;
  onFolderSelect: (folderId: string) => void;
}> = ({ folders, selectedFolder, onFolderSelect }) => {
  return (
    <div className="w-64 bg-white border-r border-[#435663]/20 p-4">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-[#313647]">Folders</h3>
          <button className="p-1 hover:bg-[#A3B087]/10 rounded">
            <Icon name="plus" size={16} color="accent" />
          </button>
        </div>
        
        {/* Folder tree */}
        <div className="space-y-1">
          <button 
            onClick={() => onFolderSelect('all')}
            className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
              selectedFolder === 'all' 
                ? 'bg-[#A3B087]/10 text-[#A3B087] font-medium' 
                : 'text-[#435663] hover:bg-[#435663]/5'
            }`}
          >
            <Icon name="workspace" size={16} color={selectedFolder === 'all' ? 'accent' : 'secondary'} />
            <span>All Items</span>
            <span className="ml-auto text-xs text-[#435663]/60">142</span>
          </button>
          
          <button 
            onClick={() => onFolderSelect('favorites')}
            className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
              selectedFolder === 'favorites' 
                ? 'bg-[#A3B087]/10 text-[#A3B087] font-medium' 
                : 'text-[#435663] hover:bg-[#435663]/5'
            }`}
          >
            <Icon name="star" size={16} color={selectedFolder === 'favorites' ? 'accent' : 'secondary'} />
            <span>Favorites</span>
            <span className="ml-auto text-xs text-[#435663]/60">23</span>
          </button>
          
          {folders.map((folder) => (
            <button 
              key={folder.id}
              onClick={() => onFolderSelect(folder.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                selectedFolder === folder.id 
                  ? 'bg-[#A3B087]/10 text-[#A3B087] font-medium' 
                  : 'text-[#435663] hover:bg-[#435663]/5'
              }`}
            >
              <Icon name="file-plus" size={16} color={selectedFolder === folder.id ? 'accent' : 'secondary'} />
              <span>{folder.name}</span>
              <span className="ml-auto text-xs text-[#435663]/60">{folder.items_count}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Categories */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-[#313647] mb-3">Categories</h3>
        <div className="space-y-1">
          {[
            { name: 'Charts', count: 45, icon: 'dashboard-tab' },
            { name: 'Visualizations', count: 28, icon: 'share' },
            { name: 'Datasets', count: 34, icon: 'file-plus' },
            { name: 'Templates', count: 19, icon: 'copy' },
            { name: 'Notebooks', count: 16, icon: 'commands' }
          ].map((category) => (
            <button 
              key={category.name}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#435663] hover:bg-[#435663]/5 rounded-lg transition-colors"
            >
              <Icon name={category.icon as any} size={16} color="secondary" />
              <span>{category.name}</span>
              <span className="ml-auto text-xs text-[#435663]/60">{category.count}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Workspace Item Card Component
 */
const WorkspaceItemCard: React.FC<{
  item: WorkspaceItem;
  onSelect: (item: WorkspaceItem) => void;
  onFavorite: (itemId: string) => void;
  onAddToDashboard: (item: WorkspaceItem) => void;
}> = ({ item, onSelect, onFavorite, onAddToDashboard }) => {
  const getItemIcon = (type: WorkspaceItem['type']) => {
    switch (type) {
      case 'chart': return 'dashboard-tab';
      case 'visualization': return 'share';
      case 'dataset': return 'file-plus';
      case 'template': return 'copy';
      case 'notebook': return 'commands';
      default: return 'file-plus';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-[#435663]/20 p-4 hover:shadow-md transition-all duration-200 group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#A3B087]/10 rounded flex items-center justify-center">
            <Icon name={getItemIcon(item.type) as any} size={16} color="accent" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-[#313647] line-clamp-1">{item.name}</h3>
            <p className="text-xs text-[#435663]/60 capitalize">{item.type} • {item.category}</p>
          </div>
        </div>
        
        <button 
          onClick={() => onFavorite(item.id)}
          className="p-1 hover:bg-[#A3B087]/10 rounded opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Icon 
            name="star" 
            size={16} 
            color={item.is_favorite ? 'accent' : 'secondary'} 
            className={item.is_favorite ? 'fill-current' : ''}
          />
        </button>
      </div>
      
      {item.description && (
        <p className="text-xs text-[#435663] mb-3 line-clamp-2">{item.description}</p>
      )}
      
      {/* Tags */}
      {item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {item.tags.slice(0, 3).map((tag) => (
            <span 
              key={tag}
              className="px-2 py-1 text-xs bg-[#A3B087]/10 text-[#A3B087] rounded-full"
            >
              {tag}
            </span>
          ))}
          {item.tags.length > 3 && (
            <span className="px-2 py-1 text-xs bg-[#435663]/10 text-[#435663] rounded-full">
              +{item.tags.length - 3}
            </span>
          )}
        </div>
      )}
      
      {/* Actions */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#435663]/60">
          Modified {new Date(item.modified_at).toLocaleDateString()}
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={() => onSelect(item)}
            className="px-3 py-1.5 text-xs bg-[#A3B087] text-white rounded-lg hover:bg-[#A3B087]/90 transition-colors"
          >
            Open
          </button>
          <button 
            onClick={() => onAddToDashboard(item)}
            className="px-3 py-1.5 text-xs border border-[#A3B087] text-[#A3B087] rounded-lg hover:bg-[#A3B087]/5 transition-colors"
          >
            Add to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Main Workspace Content Component
 */
const WorkspaceContent: React.FC<{
  items: WorkspaceItem[];
  selectedFolder: string;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}> = ({ items, selectedFolder, viewMode, onViewModeChange }) => {
  const [sortBy, setSortBy] = useState<'name' | 'modified' | 'type'>('modified');

  const handleItemSelect = (item: WorkspaceItem) => {
    console.log('Opening item:', item);
    // TODO: Implement item preview/edit
  };

  const handleFavorite = (itemId: string) => {
    console.log('Toggle favorite:', itemId);
    // TODO: Implement favorite toggle
  };

  const handleAddToDashboard = (item: WorkspaceItem) => {
    console.log('Adding to dashboard:', item);
    // TODO: Implement add to dashboard functionality
  };

  return (
    <div className="flex-1 bg-[#FFF8D4] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-lg font-semibold text-[#313647]">
              {selectedFolder === 'all' && 'All Items'}
              {selectedFolder === 'favorites' && 'Favorites'}
              {!['all', 'favorites'].includes(selectedFolder) && 'Folder Items'}
            </h2>
            <span className="text-sm text-[#435663]/60">{items.length} items</span>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Sort dropdown */}
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 text-sm border border-[#435663]/20 rounded-lg bg-white text-[#313647] focus:outline-none focus:ring-2 focus:ring-[#A3B087]"
            >
              <option value="modified">Sort by Modified</option>
              <option value="name">Sort by Name</option>
              <option value="type">Sort by Type</option>
            </select>
            
            {/* View mode toggle */}
            <div className="flex items-center bg-white rounded-lg border border-[#435663]/20">
              <button 
                onClick={() => onViewModeChange('grid')}
                className={`p-2 rounded-l-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-[#A3B087] text-white' 
                    : 'text-[#435663] hover:bg-[#435663]/5'
                }`}
              >
                <Icon name="dashboard-tab" size={16} color={viewMode === 'grid' ? 'inverse' : 'secondary'} />
              </button>
              <button 
                onClick={() => onViewModeChange('list')}
                className={`p-2 rounded-r-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-[#A3B087] text-white' 
                    : 'text-[#435663] hover:bg-[#435663]/5'
                }`}
              >
                <Icon name="menu" size={16} color={viewMode === 'list' ? 'inverse' : 'secondary'} />
              </button>
            </div>
            
            {/* New item button */}
            <button className="flex items-center gap-2 px-4 py-2 bg-[#A3B087] text-white rounded-lg font-medium hover:bg-[#A3B087]/90 transition-colors">
              <Icon name="plus" size={16} color="inverse" />
              <span>New Item</span>
            </button>
          </div>
        </div>
        
        {/* Items grid/list */}
        {items.length === 0 ? (
          <div className="bg-white rounded-lg border border-[#435663]/20 p-8 text-center">
            <div className="w-16 h-16 bg-[#A3B087]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="workspace" size={32} color="accent" />
            </div>
            <h3 className="text-xl font-semibold text-[#313647] mb-2">
              Your Workspace is Empty
            </h3>
            <p className="text-[#435663] mb-6 max-w-md mx-auto">
              Start building your chart library by creating visualizations, importing datasets, or using templates.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button className="flex items-center gap-2 px-6 py-3 bg-[#A3B087] text-white rounded-lg font-medium hover:bg-[#A3B087]/90 transition-colors">
                <Icon name="plus" size={20} color="inverse" />
                <span>Create Chart</span>
              </button>
              <button className="flex items-center gap-2 px-6 py-3 border border-[#A3B087] text-[#A3B087] rounded-lg font-medium hover:bg-[#A3B087]/5 transition-colors">
                <Icon name="upload-files" size={20} color="accent" />
                <span>Import Data</span>
              </button>
            </div>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {items.map((item) => (
              <WorkspaceItemCard
                key={item.id}
                item={item}
                onSelect={handleItemSelect}
                onFavorite={handleFavorite}
                onAddToDashboard={handleAddToDashboard}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Main Workspace Page Component
 */
export default function WorkspacePage() {
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Mock data - in real app, this would come from the database
  const mockFolders: WorkspaceFolder[] = [
    { id: '1', name: 'Energy Analytics', path: '/energy', items_count: 24 },
    { id: '2', name: 'Sales Reports', path: '/sales', items_count: 18 },
    { id: '3', name: 'Dashboard Templates', path: '/templates', items_count: 12 },
    { id: '4', name: 'ML Models', path: '/ml', items_count: 8 }
  ];
  
  const mockItems: WorkspaceItem[] = [
    {
      id: '1',
      name: 'Q3 Energy Consumption',
      type: 'chart',
      category: 'Energy Analytics',
      tags: ['energy', 'q3', 'consumption'],
      created_at: '2024-12-01T10:00:00Z',
      modified_at: '2024-12-04T15:30:00Z',
      is_favorite: true,
      description: 'Quarterly energy consumption analysis with trend predictions'
    },
    {
      id: '2',
      name: 'Sales Performance Dashboard',
      type: 'visualization',
      category: 'Sales Reports',
      tags: ['sales', 'performance', 'kpi'],
      created_at: '2024-11-28T09:15:00Z',
      modified_at: '2024-12-03T14:20:00Z',
      is_favorite: false,
      description: 'Interactive sales performance dashboard with KPI tracking'
    },
    {
      id: '3',
      name: 'Customer Dataset 2024',
      type: 'dataset',
      category: 'Data Sources',
      tags: ['customers', 'dataset', '2024'],
      created_at: '2024-11-25T08:00:00Z',
      modified_at: '2024-12-02T11:45:00Z',
      is_favorite: false,
      description: 'Comprehensive customer data for 2024 analysis'
    }
  ];

  // Navigation handlers
  const handleChatNavigation = () => {
    window.location.href = '/test/chat';
  };

  const handleDashboardNavigation = () => {
    window.location.href = '/dashboard';
  };

  const handleSettingsNavigation = () => {
    console.log('Open Workspace Settings');
    // TODO: Implement settings modal/page
  };

  return (
    <div className="h-screen flex flex-col bg-[#FFF8D4]">
      {/* Workspace Header */}
      <WorkspaceHeader 
        onChat={handleChatNavigation}
        onDashboard={handleDashboardNavigation}
        onSettings={handleSettingsNavigation}
      />
      
      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <WorkspaceSidebar 
          folders={mockFolders}
          selectedFolder={selectedFolder}
          onFolderSelect={setSelectedFolder}
        />
        
        {/* Main Content */}
        <WorkspaceContent 
          items={mockItems}
          selectedFolder={selectedFolder}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      </div>
    </div>
  );
}