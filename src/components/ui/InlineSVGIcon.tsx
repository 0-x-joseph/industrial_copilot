'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

// Icon name mapping to SVG files
const iconMap = {
  // Header Navigation
  'hamburger-menu': 'menu',
  'agent-selector': 'bot',
  'model-selector': 'settings', 
  'settings': 'settings',
  'settingsprimary': 'settingsprimary',
  
  // Context Bar
  'files': 'file-plus',
  'commands': 'commands',
  'dashboard-tab': 'dot',
  'workspace': 'dot',
  'sidebar': 'sidebar',
  'dropdown': 'ellipsis',
  
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
  'sharecream': 'sharecream',
  'minus': 'minus',
  'dot': 'dot',
  'small-circle': 'small-cercel',
} as const;

type IconName = keyof typeof iconMap;
type IconSize = 16 | 20 | 24 | 28 | 32;
type IconColor = 'primary' | 'secondary' | 'accent' | 'muted' | 'inverse';

interface InlineSVGIconProps {
  name: IconName;
  size?: IconSize;
  color?: IconColor;
  className?: string;
  'aria-label'?: string;
}

// Color mapping to CSS custom properties
const colorMap: Record<IconColor, string> = {
  primary: 'var(--color-icon-primary)',
  secondary: 'var(--color-icon-secondary)', 
  accent: 'var(--color-icon-accent)',
  muted: 'var(--color-icon-muted)',
  inverse: 'var(--color-text-inverse)',
};

export const InlineSVGIcon: React.FC<InlineSVGIconProps> = ({ 
  name, 
  size = 24, 
  color = 'secondary',
  className,
  'aria-label': ariaLabel,
  ...props 
}) => {
  const [svgContent, setSvgContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const svgFileName = iconMap[name];
  
  useEffect(() => {
    if (!svgFileName) {
      console.warn(`Icon "${name}" not found in iconMap`);
      setLoading(false);
      return;
    }

    // Fetch and load SVG content
    fetch(`/icons/ui/${svgFileName}.svg`)
      .then(response => response.text())
      .then(svgText => {
        // Parse and modify the SVG to ensure it uses currentColor
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
        const svgElement = svgDoc.querySelector('svg');
        
        if (svgElement) {
          // Set dimensions and ensure currentColor usage
          svgElement.setAttribute('width', size.toString());
          svgElement.setAttribute('height', size.toString());
          svgElement.setAttribute('stroke', 'currentColor');
          svgElement.setAttribute('fill', 'currentColor');
          
          setSvgContent(svgElement.outerHTML);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error(`Failed to load icon ${name}:`, error);
        setLoading(false);
      });
  }, [name, svgFileName, size]);

  if (loading) {
    // Loading placeholder with same dimensions
    return (
      <div
        className={cn(
          'inline-flex items-center justify-center animate-pulse bg-gray-200 rounded',
          className
        )}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          flexShrink: 0,
        }}
        aria-label={ariaLabel || `Loading ${name} icon`}
      />
    );
  }

  if (!svgContent) {
    return null;
  }

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center',
        'transition-colors duration-200',
        'hover:opacity-80',
        className
      )}
      style={{
        color: colorMap[color],
        flexShrink: 0,
      }}
      aria-label={ariaLabel || name}
      role={ariaLabel ? 'img' : undefined}
      {...props}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};

// Convenience components for common icon patterns
export const HeaderInlineSVGIcon: React.FC<Omit<InlineSVGIconProps, 'color' | 'size'>> = (props) => (
  <InlineSVGIcon {...props} color="primary" size={24} />
);

export const ContextInlineSVGIcon: React.FC<Omit<InlineSVGIconProps, 'color' | 'size'>> = (props) => (
  <InlineSVGIcon {...props} color="secondary" size={20} />
);

export const ActionInlineSVGIcon: React.FC<Omit<InlineSVGIconProps, 'color' | 'size'>> = (props) => (
  <InlineSVGIcon {...props} color="accent" size={20} />
);

export const ChatInlineSVGIcon: React.FC<Omit<InlineSVGIconProps, 'size'> & { interactive?: boolean }> = ({ 
  interactive = false, 
  ...props 
}) => (
  <InlineSVGIcon 
    {...props} 
    size={20} 
    className={cn(
      interactive && 'hover:text-accent cursor-pointer',
      props.className
    )}
  />
);

export type { IconName as InlineSVGIconName, IconSize as InlineSVGIconSize, IconColor as InlineSVGIconColor };