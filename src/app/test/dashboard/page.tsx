import Link from 'next/link';

export default function TestDashboardPage() {
  return (
    <div className="min-h-screen bg-[#FFF8D4] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#313647] mb-6">OCP Dashboard Test</h1>
        
        <div className="bg-white rounded-lg border border-[#435663]/20 p-6 mb-6">
          <h2 className="text-xl font-semibold text-[#313647] mb-4">Navigation Tests</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link 
              href="/dashboard" 
              className="flex items-center gap-3 p-4 bg-[#A3B087] text-white rounded-lg hover:bg-[#A3B087]/90 transition-colors"
            >
              <span className="text-lg">📊</span>
              <div>
                <h3 className="font-medium">Main Dashboard</h3>
                <p className="text-sm text-white/80">View the main dashboard with header</p>
              </div>
            </Link>
            
            <Link 
              href="/test/chat" 
              className="flex items-center gap-3 p-4 bg-[#435663] text-white rounded-lg hover:bg-[#435663]/90 transition-colors"
            >
              <span className="text-lg">💬</span>
              <div>
                <h3 className="font-medium">Chat Interface</h3>
                <p className="text-sm text-white/80">Test the completed chat UI</p>
              </div>
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-[#435663]/20 p-6">
          <h2 className="text-xl font-semibold text-[#313647] mb-4">Dashboard Features Status</h2>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-green-500">✅</span>
              <span>Header Component with Navigation</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-green-500">✅</span>
              <span>Same Design System as Chat</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-green-500">✅</span>
              <span>Responsive Mobile Layout</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-green-500">✅</span>
              <span>Empty Dashboard Content Area</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-yellow-500">🟡</span>
              <span>Placeholder Chart Grid</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-400">⚪</span>
              <span>Live Chart Integration (Future)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}