import { IconPreview } from '@/components/ui/IconPreview';
import Link from 'next/link';
import { Icon } from '@/components/ui';

export default function IconsTestPage() {
  return (
    <div className="min-h-screen bg-primary-cream">
      <nav className="bg-white shadow-sm border-b border-primary-medium/20 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-primary-dark hover:text-primary-light">
            <Icon name="hamburger-menu" size={20} />
            <span>Back to Home</span>
          </Link>
          <h1 className="text-xl font-semibold text-primary-dark">Icon System Test</h1>
        </div>
      </nav>
      
      <div className="container mx-auto">
        <IconPreview />
      </div>
    </div>
  );
}