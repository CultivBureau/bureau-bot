'use client';

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

interface BotDetailsSidebarProps {
  botId: string;
}

const navItems = [
  {
    id: 'overview',
    label: 'Overview',
    icon: LayoutDashboard,
    href: (botId: string) => `/pages/bot-details/overview?botId=${botId}`,
  },
  {
    id: 'configure',
    label: 'Configure',
    icon: Settings,
    href: (botId: string) => `/pages/bot-details/configure?botId=${botId}`,
  },
  {
    id: 'functions',
    label: 'Functions',
    icon: Code,
    href: (botId: string) => `/pages/bot-details/functions?botId=${botId}`,
  },
  {
    id: 'instructions',
    label: 'Instructions',
    icon: FileText,
    href: (botId: string) => `/pages/bot-details/instructions?botId=${botId}`,
  },
  {
    id: 'integration',
    label: 'Integrations',
    icon: LinkIcon,
    href: (botId: string) => `/pages/bot-details/integration?botId=${botId}`,
  },
  {
    id: 'transfer',
    label: 'Transfer',
    icon: ArrowRightLeft,
    href: (botId: string) => `/pages/bot-details/transfer?botId=${botId}`,
  },
  {
    id: 'knowledgebase',
    label: 'Knowledgebase',
    icon: Database,
    href: (botId: string) => `/pages/bot-details/knowledgebase?botId=${botId}`,
  },
];

export function BotDetailsSidebar({ botId }: BotDetailsSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    const hrefPathname = href.split('?')[0];
    return pathname === hrefPathname;
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-60 lg:flex-shrink-0">
        <nav className="flex flex-col gap-1 p-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const href = item.href(botId);
            const active = isActive(href);

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
    </>
  );
}

