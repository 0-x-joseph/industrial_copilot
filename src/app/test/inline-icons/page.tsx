import React from 'react';
import Link from 'next/link';
import { Icon, HeaderIcon, ContextIcon, ActionIcon, ChatIcon } from '@/components/ui/Icon';

export default function InlineIconTestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream to-white p-8">
      <nav className="mb-8">
        <Link href="/" className="text-primary-dark hover:text-accent transition-colors">
          ← Back to Home
        </Link>
        <h1 className="text-2xl font-bold text-primary-dark mt-4">Enhanced Icon System Test</h1>
      </nav>

      <div className="max-w-4xl mx-auto space-y-12">
        {/* Inline SVG vs Img Comparison */}
        <section className="bg-white rounded-lg p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-primary-dark mb-6">Inline SVG vs Image Icons</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-medium text-primary-medium">Traditional Image Icons</h3>
              <div className="flex flex-wrap gap-4">
                <Icon name="agent-selector" color="primary" inline={false} />
                <Icon name="settings" color="secondary" inline={false} />
                <Icon name="star" color="accent" inline={false} />
                <Icon name="thumbs-up" color="muted" inline={false} />
              </div>
              <p className="text-sm text-gray-600">Limited color theming with CSS filters</p>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-primary-medium">Enhanced Inline SVG Icons</h3>
              <div className="flex flex-wrap gap-4">
                <Icon name="agent-selector" color="primary" inline={true} />
                <Icon name="settings" color="secondary" inline={true} />
                <Icon name="star" color="accent" inline={true} />
                <Icon name="thumbs-up" color="muted" inline={true} />
              </div>
              <p className="text-sm text-gray-600">Perfect color theming with currentColor</p>
            </div>
          </div>
        </section>

        {/* Color Theming Showcase */}
        <section className="bg-white rounded-lg p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-primary-dark mb-6">Advanced Color Theming</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-6">
            {(['primary', 'secondary', 'accent', 'muted', 'inverse'] as const).map(color => (
              <div key={color} className={`p-4 rounded-lg ${color === 'inverse' ? 'bg-primary-dark' : 'bg-gray-50'}`}>
                <h3 className={`font-medium mb-3 ${color === 'inverse' ? 'text-cream' : 'text-primary-dark'}`}>
                  {color.charAt(0).toUpperCase() + color.slice(1)}
                </h3>
                 <div className="flex flex-wrap gap-2">
                   <Icon name="agent-selector" color={color} inline={true} />
                   <Icon name="settings" color={color} inline={true} />
                   <Icon name="star" color={color} inline={true} />
                   <Icon name="commands" color={color} inline={true} />
                 </div>
              </div>
            ))}
          </div>
        </section>

        {/* Convenience Components */}
        <section className="bg-white rounded-lg p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-primary-dark mb-6">Convenience Components</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-medium text-primary-medium">Header Icons (24px, Primary)</h3>
               <div className="flex flex-wrap gap-3">
                 <HeaderIcon name="hamburger-menu" />
                 <HeaderIcon name="agent-selector" />
                 <HeaderIcon name="settings" />
               </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-primary-medium">Context Icons (20px, Secondary)</h3>
               <div className="flex flex-wrap gap-3">
                 <ContextIcon name="files" />
                 <ContextIcon name="commands" />
                 <ContextIcon name="dashboard-tab" />
                 <ContextIcon name="workspace" />
               </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-primary-medium">Action Icons (20px, Accent)</h3>
               <div className="flex flex-wrap gap-3">
                 <ActionIcon name="new-chat" />
                 <ActionIcon name="add" />
                 <ActionIcon name="star" />
                 <ActionIcon name="thumbs-up" />
               </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium text-primary-medium">Chat Icons (20px, Interactive)</h3>
               <div className="flex flex-wrap gap-3">
                 <ChatIcon name="copy" interactive />
                 <ChatIcon name="share" interactive />
                 <ChatIcon name="send" interactive />
                 <ChatIcon name="upload" interactive />
               </div>
            </div>
          </div>
        </section>

        {/* Real-world Usage Example */}
        <section className="bg-white rounded-lg p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-primary-dark mb-6">Real-World Usage Example</h2>
          
          {/* Mock header bar */}
          <div className="bg-primary-dark text-cream p-4 rounded-lg mb-4 flex items-center justify-between">
             <div className="flex items-center gap-4">
                <HeaderIcon name="hamburger-menu" />
               <span className="font-medium">OCP Chat</span>
             </div>
            <div className="flex items-center gap-4">
               <HeaderIcon name="agent-selector" />
               <HeaderIcon name="settings" />
            </div>
          </div>

          {/* Mock context bar */}
           <div className="bg-gray-100 p-3 rounded-lg mb-4 flex items-center gap-4">
             <ContextIcon name="files" />
             <span className="text-sm">Files</span>
             <ContextIcon name="commands" />
             <span className="text-sm">Commands</span>
             <ContextIcon name="dashboard-tab" />
             <span className="text-sm">Tab: Energy</span>
           </div>

          {/* Mock message input */}
          <div className="bg-gray-50 p-4 rounded-lg flex items-center gap-3">
            <input 
              type="text" 
              placeholder="💬 Type your message..." 
              className="flex-1 bg-white border border-gray-200 rounded-md px-3 py-2 text-sm"
              disabled
            />
             <ChatIcon name="upload" interactive />
             <ChatIcon name="send" interactive />
          </div>
        </section>

        {/* Performance Note */}
        <section className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-medium text-blue-900 mb-2">💡 Performance Note</h3>
          <p className="text-blue-800 text-sm">
            Inline SVG icons provide better theming but require client-side JavaScript to load. 
            For server-side rendering or critical above-the-fold content, consider using the traditional 
            image-based approach with <code>inline={'{false}'}</code>.
          </p>
        </section>

        {/* Usage Examples */}
        <section className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-xl font-semibold text-primary-dark mb-4">Code Examples</h2>
          <div className="space-y-4 text-sm font-mono">
            <div>
              <span className="text-gray-600">// Enhanced inline SVG (recommended):</span>
              <br />
               <span className="text-blue-600">{`<Icon name="agent-selector" color="primary" inline={true} />`}</span>
             </div>
             <div>
               <span className="text-gray-600">// Traditional image fallback:</span>
               <br />
               <span className="text-blue-600">{`<Icon name="agent-selector" color="primary" inline={false} />`}</span>
            </div>
            <div>
              <span className="text-gray-600">// Convenience components (inline by default):</span>
              <br />
              <span className="text-blue-600">{`<HeaderIcon name="settings" />`}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}