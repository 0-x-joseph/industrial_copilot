import Link from 'next/link';
import { Icon } from '@/components/ui';

export default function Home() {
  return (
    <main className="min-h-screen bg-primary-cream">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Icon name="agent-selector" size={32} color="primary" />
            <h1 className="text-4xl font-bold text-primary-dark">OCP Dashboard</h1>
          </div>
          <p className="text-lg text-primary-medium">
            LLM-Powered Analytics with Integrated Chat Interface
          </p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Icon System Test */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-primary-medium/20">
            <div className="flex items-center gap-3 mb-4">
              <Icon name="star" size={24} color="accent" />
              <h2 className="text-xl font-semibold text-primary-dark">Icon System</h2>
            </div>
            <p className="text-primary-medium mb-4">
              Test all icons with color palette integration
            </p>
            <div className="flex gap-2">
              <Link
                href="/test/icons"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-light text-white rounded-md hover:bg-primary-medium transition-colors"
              >
                <Icon name="search" size={16} color="inverse" />
                Basic Icons
              </Link>
              <Link
                href="/test/inline-icons"
                className="inline-flex items-center gap-2 px-3 py-2 border border-primary-medium text-primary-dark rounded-md hover:bg-primary-cream transition-colors"
              >
                <Icon name="settings" size={16} color="primary" />
                Enhanced
              </Link>
            </div>
          </div>

          {/* Chat UI Test */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-primary-medium/20">
            <div className="flex items-center gap-3 mb-4">
              <Icon name="agent-selector" size={24} color="accent" />
              <h2 className="text-xl font-semibold text-primary-dark">Chat Interface</h2>
            </div>
            <p className="text-primary-medium mb-4">
              Full chat UI from Web Specification
            </p>
            <Link
              href="/test/chat"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-light text-white rounded-md hover:bg-primary-medium transition-colors"
            >
              <Icon name="send" size={16} color="inverse" />
              Test Chat
            </Link>
          </div>

          {/* Components Test */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-primary-medium/20">
            <div className="flex items-center gap-3 mb-4">
              <Icon name="commands" size={24} color="accent" />
              <h2 className="text-xl font-semibold text-primary-dark">Components</h2>
            </div>
            <p className="text-primary-medium mb-4">
              Individual component testing
            </p>
            <Link
              href="/test/components"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-light text-white rounded-md hover:bg-primary-medium transition-colors"
            >
              <Icon name="settings" size={16} color="inverse" />
              Test Components
            </Link>
          </div>

          {/* Color System Test */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-primary-medium/20">
            <div className="flex items-center gap-3 mb-4">
              <Icon name="thumbs-up" size={24} color="accent" />
              <h2 className="text-xl font-semibold text-primary-dark">Color System</h2>
            </div>
            <p className="text-primary-medium mb-4">
              Palette and theme testing
            </p>
            <Link
              href="/test/colors"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-light text-white rounded-md hover:bg-primary-medium transition-colors"
            >
              <Icon name="dot" size={16} color="inverse" />
              View Colors
            </Link>
          </div>

          {/* Responsive Test */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-primary-medium/20">
            <div className="flex items-center gap-3 mb-4">
              <Icon name="share" size={24} color="accent" />
              <h2 className="text-xl font-semibold text-primary-dark">Responsive</h2>
            </div>
            <p className="text-primary-medium mb-4">
              Mobile and tablet layouts
            </p>
            <Link
              href="/test/responsive" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-light text-white rounded-md hover:bg-primary-medium transition-colors"
            >
              <Icon name="dashboard-tab" size={16} color="inverse" />
              Test Layout
            </Link>
          </div>

          {/* Accessibility Test */}
          <div className="bg-white rounded-lg shadow-md p-6 border border-primary-medium/20">
            <div className="flex items-center gap-3 mb-4">
              <Icon name="send" size={24} color="accent" />
              <h2 className="text-xl font-semibold text-primary-dark">Accessibility</h2>
            </div>
            <p className="text-primary-medium mb-4">
              A11y compliance testing
            </p>
            <Link
              href="/test/accessibility"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-light text-white rounded-md hover:bg-primary-medium transition-colors"
            >
              <Icon name="copy" size={16} color="inverse" />
              Test A11y
            </Link>
          </div>
        </div>

        {/* Quick Start Guide */}
        <div className="mt-16 bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto border border-primary-medium/20">
          <h2 className="text-2xl font-bold text-primary-dark mb-6">🚀 Testing Guide</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-primary-dark mb-3">🖥️ Development Server</h3>
              <div className="bg-gray-100 rounded p-4 font-mono text-sm">
                <div>npm run dev</div>
                <div className="text-gray-600"># Starts on localhost:3000</div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-primary-dark mb-3">🔍 Browser Testing</h3>
              <div className="space-y-2 text-sm text-primary-medium">
                <div>• Chrome DevTools for responsive testing</div>
                <div>• Firefox for accessibility checks</div>
                <div>• Safari for cross-browser validation</div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-primary-cream rounded-lg">
            <p className="text-sm text-primary-dark">
              <strong>💡 Pro Tip:</strong> Use the Chrome DevTools device simulator to test different screen sizes. 
              Each test page includes responsive breakpoint indicators.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}