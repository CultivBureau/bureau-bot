'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Settings,
  FileText,
  Database,
  Code,
  Link as LinkIcon,
  ArrowRightLeft,
} from 'lucide-react';
import { cn } from '../../landing/ui/utils';
import { SimpleToast } from '../../shared/SimpleToast';

interface BotDetailsSidebarProps {
  botId: string;
}

const navItems = [
  {
    id: 'overview',
    label: 'Overview',
    icon: LayoutDashboard,
    href: (botId: string) => `/pages/bot-details/overview?botId=${botId}`,
    comingSoon: true,
  },
  {
    id: 'configure',
    label: 'Configure',
    icon: Settings,
    href: (botId: string) => `/pages/bot-details/configure?botId=${botId}`,
    comingSoon: false,
  },
  {
    id: 'functions',
    label: 'Functions',
    icon: Code,
    href: (botId: string) => `/pages/bot-details/functions?botId=${botId}`,
    comingSoon: false,
  },
  {
    id: 'instructions',
    label: 'Instructions',
    icon: FileText,
    href: (botId: string) => `/pages/bot-details/instructions?botId=${botId}`,
    comingSoon: false,
  },
  {
    id: 'integration',
    label: 'Integrations',
    icon: LinkIcon,
    href: (botId: string) => `/pages/bot-details/integration?botId=${botId}`,
    comingSoon: false,
  },
  {
    id: 'transfer',
    label: 'Transfer',
    icon: ArrowRightLeft,
    href: (botId: string) => `/pages/bot-details/transfer?botId=${botId}`,
    comingSoon: true,
  },
  {
    id: 'knowledgebase',
    label: 'Knowledgebase',
    icon: Database,
    href: (botId: string) => `/pages/bot-details/knowledgebase?botId=${botId}`,
    comingSoon: false,
  },
];

export function BotDetailsSidebar({ botId }: BotDetailsSidebarProps) {
  const pathname = usePathname();
  const [showToast, setShowToast] = useState(false);

  const isActive = (href: string) => {
    const hrefPathname = href.split('?')[0];
    return pathname === hrefPathname;
  };

  const handleComingSoonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowToast(true);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-60 lg:shrink-0">
        <nav className="flex flex-col gap-1 p-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const href = item.href(botId);
            const active = isActive(href);

            if (item.comingSoon) {
              return (
                <button
                  key={item.id}
                  onClick={handleComingSoonClick}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-not-allowed opacity-60',
                    'text-muted-foreground hover:bg-card/30'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              );
            }

            return (
              <Link
                key={item.id}
                href={href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                  active
                    ? 'bg-primary/15 text-primary border border-primary/20'
                    : 'text-muted-foreground hover:bg-card/50 hover:text-card-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile/Tablet Horizontal Tabs */}
      <div className="lg:hidden overflow-x-auto mb-6">
        <nav className="flex gap-2 px-2 min-w-max">
          {navItems.map((item) => {
            const Icon = item.icon;
            const href = item.href(botId);
            const active = isActive(href);

            if (item.comingSoon) {
              return (
                <button
                  key={item.id}
                  onClick={handleComingSoonClick}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap cursor-not-allowed opacity-60',
                    'text-muted-foreground hover:bg-card/30 border border-transparent'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            }

            return (
              <Link
                key={item.id}
                href={href}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap',
                  active
                    ? 'bg-primary/15 text-primary border border-primary/20'
                    : 'text-muted-foreground hover:bg-card/50 hover:text-card-foreground border border-transparent'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Toast Notification */}
      <SimpleToast
        message="Coming Soon! This feature is currently under development."
        onClose={() => setShowToast(false)}
        isOpen={showToast}
      />
    </>
  );
}

