import React from 'react';
import { Icon, IconName, iconMap } from './Icon';

export const IconPreview: React.FC = () => {
  const iconNames = Object.keys(iconMap) as IconName[];
  
  return (
    <div className="p-8 bg-background-primary">
      <h1 className="text-2xl font-bold text-text-primary mb-8">
        OCP Dashboard Icons Preview
      </h1>
      
      {/* Color Palette Preview */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-text-primary mb-4">
          Color Palette
        </h2>
        <div className="flex gap-4 mb-4">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-[#313647] rounded-lg mb-2"></div>
            <span className="text-sm text-text-secondary">#313647</span>
            <span className="text-xs text-text-muted">Primary</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-[#435663] rounded-lg mb-2"></div>
            <span className="text-sm text-text-secondary">#435663</span>
            <span className="text-xs text-text-muted">Secondary</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-[#A3B087] rounded-lg mb-2"></div>
            <span className="text-sm text-text-secondary">#A3B087</span>
            <span className="text-xs text-text-muted">Accent</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-[#FFF8D4] rounded-lg border border-border-secondary mb-2"></div>
            <span className="text-sm text-text-secondary">#FFF8D4</span>
            <span className="text-xs text-text-muted">Cream</span>
          </div>
        </div>
      </div>

      {/* Icon Grid by Category */}
      <div className="space-y-12">
        {/* Header Icons */}
        <div>
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            Header Navigation Icons
          </h2>
          <div className="grid grid-cols-4 gap-6">
            {(['hamburger-menu', 'agent-selector', 'model-selector', 'settings'] as IconName[]).map((name) => (
              <div key={name} className="flex flex-col items-center p-4 border border-border-secondary rounded-lg bg-white">
                <Icon name={name} size={32} color="primary" className="mb-2" />
                <span className="text-sm text-text-secondary text-center">{name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Context Bar Icons */}
        <div>
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            Context Bar Icons
          </h2>
          <div className="grid grid-cols-4 gap-6">
            {(['files', 'commands', 'dashboard-tab', 'workspace'] as IconName[]).map((name) => (
              <div key={name} className="flex flex-col items-center p-4 border border-border-secondary rounded-lg bg-white">
                <Icon name={name} size={28} color="secondary" className="mb-2" />
                <span className="text-sm text-text-secondary text-center">{name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Interface Icons */}
        <div>
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            Chat Interface Icons
          </h2>
          <div className="grid grid-cols-6 gap-6">
            {(['new-chat', 'add', 'upload', 'send', 'copy', 'star', 'thumbs-up', 'search', 'share'] as IconName[]).map((name) => (
              <div key={name} className="flex flex-col items-center p-4 border border-border-secondary rounded-lg bg-white">
                <Icon name={name} size={24} color="accent" className="mb-2" />
                <span className="text-sm text-text-secondary text-center">{name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Size Variations */}
        <div>
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            Size Variations (using 'settings' icon)
          </h2>
          <div className="flex items-center gap-8">
            <div className="flex flex-col items-center">
              <Icon name="settings" size={16} color="secondary" className="mb-2" />
              <span className="text-sm text-text-muted">16px</span>
            </div>
            <div className="flex flex-col items-center">
              <Icon name="settings" size={20} color="secondary" className="mb-2" />
              <span className="text-sm text-text-muted">20px</span>
            </div>
            <div className="flex flex-col items-center">
              <Icon name="settings" size={24} color="secondary" className="mb-2" />
              <span className="text-sm text-text-muted">24px</span>
            </div>
            <div className="flex flex-col items-center">
              <Icon name="settings" size={28} color="secondary" className="mb-2" />
              <span className="text-sm text-text-muted">28px</span>
            </div>
            <div className="flex flex-col items-center">
              <Icon name="settings" size={32} color="secondary" className="mb-2" />
              <span className="text-sm text-text-muted">32px</span>
            </div>
          </div>
        </div>

        {/* Color Variations */}
        <div>
          <h2 className="text-xl font-semibold text-text-primary mb-4">
            Color Variations (using 'bot' icon)
          </h2>
          <div className="flex items-center gap-8">
            <div className="flex flex-col items-center">
              <Icon name="agent-selector" size={28} color="primary" className="mb-2" />
              <span className="text-sm text-text-muted">Primary</span>
            </div>
            <div className="flex flex-col items-center">
              <Icon name="agent-selector" size={28} color="secondary" className="mb-2" />
              <span className="text-sm text-text-muted">Secondary</span>
            </div>
            <div className="flex flex-col items-center">
              <Icon name="agent-selector" size={28} color="accent" className="mb-2" />
              <span className="text-sm text-text-muted">Accent</span>
            </div>
            <div className="flex flex-col items-center">
              <Icon name="agent-selector" size={28} color="muted" className="mb-2" />
              <span className="text-sm text-text-muted">Muted</span>
            </div>
            <div className="flex flex-col items-center bg-[#313647] p-2 rounded">
              <Icon name="agent-selector" size={28} color="inverse" className="mb-2" />
              <span className="text-sm text-[#FFF8D4]">Inverse</span>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Examples */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-text-primary mb-4">
          Usage Examples
        </h2>
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
          <div className="font-mono text-sm space-y-2">
            <div>
              <span className="text-gray-600">// Basic usage:</span>
            </div>
            <div>
              <span className="text-blue-600">{'<Icon name="hamburger-menu" />'}</span>
            </div>
            <div className="mt-4">
              <span className="text-gray-600">// With custom size and color:</span>
            </div>
            <div>
              <span className="text-blue-600">{'<Icon name="send" size={20} color="accent" />'}</span>
            </div>
            <div className="mt-4">
              <span className="text-gray-600">// Using convenience components:</span>
            </div>
            <div>
              <span className="text-blue-600">{'<HeaderIcon name="settings" />'}</span>
            </div>
            <div>
              <span className="text-blue-600">{'<ActionIcon name="thumbs-up" />'}</span>
            </div>
            <div>
              <span className="text-blue-600">{'<ChatIcon name="copy" interactive />'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IconPreview;