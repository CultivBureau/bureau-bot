import { Badge } from "./ui/badge";
import { Check, MessageSquare, Database, GitBranch, Workflow, ArrowRight } from "lucide-react";

export function Bitrix24Integration() {
  const features = [
    {
      icon: MessageSquare,
      title: "Open Channels",
      color: "from-cyan-500 to-blue-500",
      items: [
        "WhatsApp, Facebook Messenger, Instagram",
        "Telegram, Viber, Apple Messages",
        "Website chat widget integration",
        "Email conversations unified"
      ]
    },
    {
      icon: Database,
      title: "Field Mapping",
      color: "from-purple-500 to-pink-500",
      items: [
        "Custom CRM field synchronization",
        "Contact & company enrichment",
        "Deal and lead auto-creation",
        "Product catalog integration"
      ]
    },
    {
      icon: GitBranch,
      title: "Stage Changes",
      color: "from-blue-500 to-indigo-500",
      items: [
        "Automated deal stage progression",
        "Lead qualification workflows",
        "Status updates based on conversation",
        "Custom business process triggers"
      ]
    },
    {
      icon: Workflow,
      title: "Automation",
      color: "from-orange-500 to-red-500",
      items: [
        "Task creation and assignment",
        "Follow-up reminders scheduling",
        "Document generation",
        "Approval workflow initiation"
      ]
    }
  ];

  return (
    <section className="py-2 sm:py-4 lg:py-6 bg-gradient-to-bl from-hero-bg-start via-hero-bg-mid to-hero-bg-end">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <Badge className="mb-3 sm:mb-4 bg-primary text-primary-foreground border-0 shadow-lg shadow-primary/30">Native Integration</Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-3 sm:mb-4 text-hero-text font-bold">
            Deep Bitrix24 integration
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-hero-subtext max-w-3xl mx-auto">
            BureauBot is built specifically for Bitrix24, leveraging every capability of the platform for seamless automation
          </p>
        </div>
      </div>

      {/* Horizontal Feature Cards - 2 per row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          const isLeft = index % 2 === 0;
          return (
            <div
              key={feature.title}
              className={`group relative overflow-hidden bg-card/70 backdrop-blur-sm border-2 border-hero-circle/30 hover:border-primary/50 transition-all duration-500 hover:shadow-xl hover:shadow-primary/20 ${isLeft ? 'rounded-r-full' : 'rounded-l-full'
                }`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className={`relative flex items-center gap-4 sm:gap-6 p-4 sm:p-6 lg:p-8  ${isLeft ? 'flex-row-reverse' : ''}`}>
                {/* Icon Circle */}
                <div className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br ${feature.color} backdrop-blur-md flex items-center justify-center shadow-lg border-2 border-hero-circle/30 group-hover:scale-110 group-hover:border-primary/50 transition-all duration-300`}>
                  <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-hero-text mb-2 uppercase tracking-wide">
                    {feature.title}
                  </h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                    {feature.items.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <Check className="w-3 h-3 sm:w-4 sm:h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm text-hero-subtext">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Integration Visual */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mt-8 sm:mt-10 p-6 sm:p-8 lg:p-10 overflow-hidden relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 lg:gap-12 relative">
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl mb-3 sm:mb-4 text-primary font-bold">Real-time CRM Sync</h3>
              <p className="text-hero-subtext text-sm sm:text-base lg:text-lg mb-4 sm:mb-6">
                Every conversation instantly updates your CRM with enriched contact data,
                sentiment analysis, and next-best-action recommendations.
              </p>
              <div className="flex flex-wrap gap-2 sm:gap-3 justify-center md:justify-start">
                <Badge className="bg-secondary/50 text-hero-text border-hero-circle/30 text-xs sm:text-sm">Bi-directional sync</Badge>
                <Badge className="bg-secondary/50 text-hero-text border-hero-circle/30 text-xs sm:text-sm">Sub-second latency</Badge>
                <Badge className="bg-secondary/50 text-hero-text border-hero-circle/30 text-xs sm:text-sm">Conflict resolution</Badge>
              </div>
            </div>
            <div className="flex-1 max-w-sm p-4 sm:p-5">
              <div className="space-y-3 sm:space-y-4">
                <div className="bg-primary/20 backdrop-blur rounded-full p-3 sm:p-4 border border-primary/30">
                  <div className="text-[10px] sm:text-xs text-white/70 mb-1 font-medium">Conversation Event</div>
                  <div className="text-xs sm:text-sm font-semibold text-white">Customer asks about pricing</div>
                </div>
                <div className="flex justify-center">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-primary rotate-90 animate-pulse" />
                  </div>
                </div>
                <div className="bg-primary/20 backdrop-blur rounded-full p-3 sm:p-4 border border-primary/30">
                  <div className="text-[10px] sm:text-xs text-white/70 mb-1 font-medium">CRM Action</div>
                  <div className="text-xs sm:text-sm font-semibold text-white">Deal created, stage: Qualification</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
