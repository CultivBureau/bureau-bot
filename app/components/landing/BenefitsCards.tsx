import { Card } from "./ui/card";
import { Zap, Shield, Globe, Clock, Users, TrendingUp } from "lucide-react";

export function BenefitsCards() {
  const benefits = [
    {
      icon: Zap,
      title: "Instant Knowledge Access",
      description: "Tap into your entire knowledge base instantly with semantic search and RAG technology. No more hunting through documentation.",
      color: "text-yellow-500 dark:text-yellow-400",
      gradientFrom: "from-yellow-500 dark:from-yellow-400",
      gradientTo: "to-orange-500 dark:to-orange-400",
      bgColor: "bg-yellow-500/10 dark:bg-yellow-500/20"
    },
    {
      icon: Shield,
      title: "Enterprise-Grade Security",
      description: "Role-based access control, audit trails, and compliance with GDPR, MENA, and industry standards built-in from day one.",
      color: "text-red-500 dark:text-red-400",
      gradientFrom: "from-red-500 dark:from-red-400",
      gradientTo: "to-pink-500 dark:to-pink-400",
      bgColor: "bg-red-500/10 dark:bg-red-500/20"
    },
    {
      icon: Globe,
      title: "Multi-Channel Support",
      description: "Unify conversations across email, chat, social media, and phone through Bitrix24 Open Channels integration.",
      color: "text-cyan-500 dark:text-cyan-400",
      gradientFrom: "from-cyan-500 dark:from-cyan-400",
      gradientTo: "to-blue-500 dark:to-blue-400",
      bgColor: "bg-cyan-500/10 dark:bg-cyan-500/20"
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Provide consistent support around the clock without burning out your team. Handle peak loads effortlessly.",
      color: "text-green-500 dark:text-green-400",
      gradientFrom: "from-green-500 dark:from-green-400",
      gradientTo: "to-emerald-500 dark:to-emerald-400",
      bgColor: "bg-green-500/10 dark:bg-green-500/20"
    },
    {
      icon: Users,
      title: "Smart Escalation",
      description: "Automatically route complex issues to the right human expert based on skills, availability, and historical performance.",
      color: "text-purple-500 dark:text-purple-400",
      gradientFrom: "from-purple-500 dark:from-purple-400",
      gradientTo: "to-pink-500 dark:to-pink-400",
      bgColor: "bg-purple-500/10 dark:bg-purple-500/20"
    },
    {
      icon: TrendingUp,
      title: "Continuous Learning",
      description: "AI improves over time by learning from agent interactions, customer feedback, and resolution patterns.",
      color: "text-orange-500 dark:text-orange-400",
      gradientFrom: "from-orange-500 dark:from-orange-400",
      gradientTo: "to-red-500 dark:to-red-400",
      bgColor: "bg-orange-500/10 dark:bg-orange-500/20"
    }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-hero-bg-start via-hero-bg-mid to-hero-bg-end">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-hero-text tracking-tight">
            Why{" "}
            <span className="text-primary">
              BureauBot
            </span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-hero-subtext max-w-3xl mx-auto leading-relaxed">
            Built for enterprise teams who need reliability, security, and measurable ROI
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {benefits.map((benefit) => {
            const Icon = benefit.icon;
            return (
              <Card key={benefit.title} className="group p-5 sm:p-6 hover:shadow-xl hover:shadow-primary/20 transition-all duration-500 border-2 border-hero-circle/20 hover:border-primary/50 bg-card/70 backdrop-blur-sm hover:scale-105 rounded-full">
                <div className="flex flex-col items-center">
                  <div className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-full ${benefit.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${benefit.color}`} />
                    <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${benefit.gradientFrom} ${benefit.gradientTo} opacity-0 group-hover:opacity-20 blur transition-opacity duration-300`} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 text-hero-text text-center">{benefit.title}</h3>
                  <p className="text-xs sm:text-sm text-hero-subtext leading-relaxed text-center">{benefit.description}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
