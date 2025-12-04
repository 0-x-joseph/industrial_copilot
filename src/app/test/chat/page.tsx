import { ChatUIDemo } from '@/components/chat/ChatUIDemo';
import Link from 'next/link';
import { Icon } from '@/components/ui';

export default function ChatTestPage() {
  return (
    <div className="min-h-screen">
      {/* Test Navigation */}
      <div className="fixed top-4 left-4 z-50">
        <Link 
          href="/" 
          className="flex items-center gap-2 px-3 py-2 bg-white/90 backdrop-blur-sm rounded-md shadow-md text-primary-dark hover:bg-primary-light hover:text-white transition-colors"
        >
          <Icon name="hamburger-menu" size={16} />
          <span className="text-sm font-medium">Exit Test</span>
        </Link>
      </div>
      
      {/* Full Chat UI Demo */}
      <ChatUIDemo />
      
      {/* Test Instructions Overlay (Toggleable) */}
      <div className="fixed bottom-4 right-4 z-40">
        <details className="bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-4 max-w-sm">
          <summary className="cursor-pointer font-semibold text-primary-dark mb-2">
            📋 Test Instructions
          </summary>
          <div className="text-sm text-primary-medium space-y-2">
            <div><strong>Header:</strong> Test agent & model dropdowns</div>
            <div><strong>Context:</strong> Click each context selector</div>
            <div><strong>Sidebar:</strong> Test chat navigation</div>
            <div><strong>Input:</strong> Test message composition</div>
            <div><strong>Responsive:</strong> Resize browser window</div>
          </div>
        </details>
      </div>
    </div>
  );
}