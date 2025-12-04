import Link from 'next/link';
import { Icon } from '@/components/ui';

export default function ColorsTestPage() {
  const colors = [
    { name: 'Primary Dark', hex: '#313647', bg: 'bg-[#313647]', usage: 'Headers, navigation, primary text' },
    { name: 'Primary Medium', hex: '#435663', bg: 'bg-[#435663]', usage: 'Secondary elements, borders' },
    { name: 'Primary Light', hex: '#A3B087', bg: 'bg-[#A3B087]', usage: 'Accents, active states' },
    { name: 'Primary Cream', hex: '#FFF8D4', bg: 'bg-[#FFF8D4]', usage: 'Backgrounds, highlights' },
  ];

  return (
    <div className="min-h-screen bg-primary-cream">
      <nav className="bg-white shadow-sm border-b border-primary-medium/20 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-primary-dark hover:text-primary-light">
            <Icon name="hamburger-menu" size={20} />
            <span>Back to Home</span>
          </Link>
          <h1 className="text-xl font-semibold text-primary-dark">Color System Test</h1>
        </div>
      </nav>
      
      <div className="container mx-auto px-4 py-8">
        {/* Color Palette */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-primary-dark mb-6">🎨 Brand Color Palette</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {colors.map((color) => (
              <div key={color.name} className="bg-white rounded-lg shadow-md overflow-hidden border border-primary-medium/20">
                <div className={`${color.bg} h-32 ${color.hex === '#FFF8D4' ? 'border-b border-gray-200' : ''}`}></div>
                <div className="p-4">
                  <h3 className="font-semibold text-primary-dark">{color.name}</h3>
                  <code className="text-sm text-primary-medium font-mono">{color.hex}</code>
                  <p className="text-sm text-gray-600 mt-2">{color.usage}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Color Usage Examples */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-primary-dark mb-6">🖌️ Usage Examples</h2>
          
          <div className="space-y-8">
            {/* Header Example */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-primary-medium/20">
              <h3 className="text-lg font-semibold text-primary-dark mb-4">Header Component</h3>
              <div className="bg-[#313647] text-[#FFF8D4] p-4 rounded-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon name="hamburger-menu" color="inverse" />
                    <span className="font-semibold">OCP Chat</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button className="px-3 py-1 bg-[#435663] rounded-md hover:bg-[#A3B087] transition-colors">
                      Agent
                    </button>
                    <Icon name="settings" color="inverse" />
                  </div>
                </div>
              </div>
            </div>

            {/* Context Bar Example */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-primary-medium/20">
              <h3 className="text-lg font-semibold text-primary-dark mb-4">Context Bar Component</h3>
              <div className="bg-gray-50 p-4 rounded-md border border-[#435663]/20">
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 px-3 py-2 text-[#435663] hover:bg-[#A3B087] hover:text-white rounded-md transition-colors">
                    <Icon name="files" size={16} />
                    <span>Files</span>
                  </button>
                  <button className="flex items-center gap-2 px-3 py-2 bg-[#A3B087] text-white rounded-md">
                    <Icon name="dashboard-tab" size={16} color="inverse" />
                    <span>Active Tab</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Interactive States */}
            <div className="bg-white rounded-lg shadow-md p-6 border border-primary-medium/20">
              <h3 className="text-lg font-semibold text-primary-dark mb-4">Interactive States</h3>
              <div className="flex flex-wrap gap-4">
                <button className="px-4 py-2 bg-[#435663] text-white rounded-md hover:bg-[#A3B087] transition-colors">
                  Default → Hover
                </button>
                <button className="px-4 py-2 bg-[#A3B087] text-white rounded-md">
                  Active State
                </button>
                <button className="px-4 py-2 bg-gray-300 text-gray-500 rounded-md cursor-not-allowed">
                  Disabled
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Contrast Testing */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-primary-dark mb-6">🔍 Accessibility Contrast</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 border border-primary-medium/20">
              <h3 className="text-lg font-semibold text-primary-dark mb-4">Light Backgrounds</h3>
              <div className="space-y-3">
                <div className="p-3 bg-[#FFF8D4] rounded">
                  <span className="text-[#313647]">Primary text on cream (AAA)</span>
                </div>
                <div className="p-3 bg-white rounded border">
                  <span className="text-[#435663]">Secondary text on white (AA)</span>
                </div>
                <div className="p-3 bg-gray-100 rounded">
                  <span className="text-[#A3B087]">Accent text on light gray (AA)</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 border border-primary-medium/20">
              <h3 className="text-lg font-semibold text-primary-dark mb-4">Dark Backgrounds</h3>
              <div className="space-y-3">
                <div className="p-3 bg-[#313647] rounded">
                  <span className="text-[#FFF8D4]">Cream text on dark navy (AAA)</span>
                </div>
                <div className="p-3 bg-[#435663] rounded">
                  <span className="text-white">White text on medium blue (AAA)</span>
                </div>
                <div className="p-3 bg-[#A3B087] rounded">
                  <span className="text-white">White text on sage green (AA)</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}