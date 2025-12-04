import React from 'react';
import { cn } from '@/lib/utils';
import { InlineSVGIcon } from './InlineSVGIcon';

// Icon name mapping to SVG files
const iconMap = {
  // Header Navigation
  'hamburger-menu': 'menu',
  'agent-selector': 'bot',
  'model-selector': 'settings', 
  'settings': 'settings',
  
  // Context Bar
  'files': 'file-plus',
  'commands': 'commands',
  'dashboard-tab': 'panel-right',
  'workspace': 'three-line-open',
  'dropdown': 'ellipsis', // Can be used for dropdown arrows
  
  // Chat Interface
  'new-chat': 'plus',
  'add': 'circle-plus',
  'chat-options': 'ellipsis',
  'upload': 'upload-files',
  'send': 'yes',
  'copy': 'copy',
  'star': 'star',
  'thumbs-up': 'thumbs-up',
  'search': 'search',
  'share': 'share',
  'minus': 'minus',
  'dot': 'dot',
  'small-circle': 'small-cercel',
} as const;

type IconName = keyof typeof iconMap;

type IconSize = 16 | 20 | 24 | 28 | 32;

type IconColor = 
  | 'primary'    // #313647 - Deep navy for headers, primary text
  | 'secondary'  // #435663 - Medium blue-grey for secondary elements  
  | 'accent'     // #A3B087 - Sage green for accents, active states
  | 'muted'      // #9CA3AF - Light grey for disabled/muted states
  | 'inverse';   // #FFF8D4 - Cream for dark backgrounds

interface IconProps {
  name: IconName;
  size?: IconSize;
  color?: IconColor;
  className?: string;
  'aria-label'?: string;
  /** Use inline SVG for better color theming (recommended) */
  inline?: boolean;
}

// Color mapping to CSS custom properties
const colorMap: Record<IconColor, string> = {
  primary: 'var(--color-icon-primary)',
  secondary: 'var(--color-icon-secondary)', 
  accent: 'var(--color-icon-accent)',
  muted: 'var(--color-icon-muted)',
  inverse: 'var(--color-text-inverse)',
};

export const Icon: React.FC<IconProps> = ({ 
  name, 
  size = 24, 
  color = 'secondary',
  className,
  'aria-label': ariaLabel,
  inline = false,
  ...props 
}) => {
  // Use inline SVG for better color theming if requested
  if (inline) {
    return (
      <InlineSVGIcon
        name={name}
        size={size}
        color={color}
        className={className}
        aria-label={ariaLabel}
        {...props}
      />
    );
  }

  // Fallback to img-based approach for compatibility
  const svgFileName = iconMap[name];
  
  if (!svgFileName) {
    console.warn(`Icon "${name}" not found in iconMap`);
    return null;
  }

  const iconStyle = {
    width: `${size}px`,
    height: `${size}px`,
    color: colorMap[color],
    flexShrink: 0,
  };

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center',
        'transition-colors duration-200',
        'hover:opacity-80',
        className
      )}
      style={iconStyle}
      aria-label={ariaLabel || name}
      role={ariaLabel ? 'img' : undefined}
      {...props}
    >
      <img
        src={`/icons/ui/${svgFileName}.svg`}
        alt={ariaLabel || name}
        width={size}
        height={size}
        className="w-full h-full"
        style={{ filter: `invert(0)` }}
      />
    </div>
  );
};

// Convenience components for common icon patterns (using enhanced inline SVG)
export const HeaderIcon: React.FC<Omit<IconProps, 'color' | 'size' | 'inline'>> = (props) => (
  <Icon {...props} color="primary" size={24} inline={true} />
);

export const ContextIcon: React.FC<Omit<IconProps, 'color' | 'size' | 'inline'>> = (props) => (
  <Icon {...props} color="secondary" size={20} inline={true} />
);

export const ActionIcon: React.FC<Omit<IconProps, 'color' | 'size' | 'inline'>> = (props) => (
  <Icon {...props} color="accent" size={20} inline={true} />
);

export const ChatIcon: React.FC<Omit<IconProps, 'size' | 'inline'> & { interactive?: boolean }> = ({ 
  interactive = false, 
  ...props 
}) => (
  <Icon 
    {...props} 
    size={20}
    inline={true}
    className={cn(
      interactive && 'hover:text-accent cursor-pointer',
      props.className
    )}
  />
);

// Export icon names for TypeScript autocomplete
export type { IconName, IconSize, IconColor };
export { iconMap };