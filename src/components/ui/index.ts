/**
 * OCP Dashboard Icon System
 * Centralized icon management with color palette integration
 */

export { Icon, HeaderIcon, ContextIcon, ActionIcon, ChatIcon } from './Icon';
export { IconPreview } from './IconPreview';
export type { IconName, IconSize, IconColor } from './Icon';
export { iconMap } from './Icon';

// Icon categories for easy reference
export const iconCategories = {
  header: ['hamburger-menu', 'agent-selector', 'model-selector', 'settings'] as const,
  context: ['files', 'commands', 'dashboard-tab', 'workspace', 'dropdown'] as const,
  chat: ['new-chat', 'add', 'upload', 'send', 'copy', 'star', 'thumbs-up', 'search', 'share'] as const,
  utility: ['minus', 'dot', 'small-circle', 'chat-options'] as const,
} as const;

// Color system constants
export const colors = {
  primary: '#313647',    // Deep Navy
  secondary: '#435663',  // Medium Blue-Grey  
  accent: '#A3B087',     // Sage Green
  cream: '#FFF8D4',      // Warm Cream
} as const;

// Size presets for different use cases
export const iconSizes = {
  small: 16,    // Dense UI, inline text
  medium: 20,   // Standard UI elements  
  large: 24,    // Primary actions, headers
  xlarge: 28,   // Hero elements, main navigation
  xxlarge: 32,  // Showcase, preview displays
} as const;