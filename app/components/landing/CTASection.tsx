'use client';
import { Button } from "./ui/button";
import { Calendar, CheckCircle2, Zap } from "lucide-react";
import Image from "next/image";
interface CTASectionProps {
  onShowDemo: () => void;
}

export function CTASection({ onShowDemo }: CTASectionProps) {
  const handleDemoClick = () => {
    onShowDemo();
    // Scroll to the form after a brief delay to allow it to render
    setTimeout(() => {
      const element = document.getElementById("contact");
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    }, 100);
  };

  return (
    <section className="relative py-8 sm:py-12 md:py-16 lg:py-20 px-3 sm:px-4 md:px-6 lg:px-8 bg-gradient-to-bl from-hero-bg-start via-hero-bg-mid to-hero-bg-end overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-1/4 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-96 lg:h-96 bg-hero-circle/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/4 -left-1/4 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-96 lg:h-96 bg-hero-circle/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 bg-hero-circle/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 sm:gap-6 md:gap-8 lg:gap-12 items-center">
          {/* Floating Robot - Left Side (2 columns) */}
          <div className="lg:col-span-2 flex justify-center lg:justify-start">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
              <Image 
                width={256}
                height={256}
                src="/Floating-Robot.png"
                alt="Floating AI assistant robot"
                className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-56 lg:h-56 xl:w-64 xl:h-64 object-contain drop-shadow-2xl animate-circular-float"
                style={{
                  filter: 'drop-shadow(0 10px 30px rgba(0, 160, 189, 0.3))'
                }}
              />
            </div>
          </div>

          {/* Content - Right Side (4 columns) */}
          <div className="lg:col-span-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-hero-circle/10 backdrop-blur-sm border border-hero-circle/20 px-2.5 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 rounded-full mb-3 sm:mb-4 md:mb-6 lg:mb-8 hover:bg-hero-circle/20 transition-all duration-300">
              <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 text-primary animate-pulse" />
              <span className="text-hero-text text-[10px] sm:text-xs md:text-sm font-medium">Limited time offer</span>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-hero-text mb-2 sm:mb-3 md:mb-4 lg:mb-6 tracking-tight leading-tight">
              Ready to transform your Bitrix24 support?
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-hero-subtext mb-4 sm:mb-6 md:mb-8 lg:mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Join forward-thinking ops and IT leaders who are already using BureauBot
              to deliver exceptional customer experiences at scale.
            </p>

            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 md:gap-4 justify-center lg:justify-start mb-4 sm:mb-6 md:mb-8 lg:mb-10">
              <Button 
                size="sm" 
                onClick={handleDemoClick}
                className="gap-1 sm:gap-1.5 md:gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl shadow-primary/30 transition-all duration-300 font-semibold rounded-full animate-circular-float-delayed text-[10px] sm:text-xs md:text-sm lg:text-base px-2.5 sm:px-3 md:px-4 lg:px-6 py-1 sm:py-1.5 md:py-2 lg:py-2.5 h-8 sm:h-9 md:h-10 lg:h-11"
              >
                <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4 xl:w-5 xl:h-5" />
                Schedule a demo
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-2 sm:gap-3 md:gap-4 lg:gap-8 text-hero-subtext text-[10px] sm:text-xs md:text-sm">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-primary flex-shrink-0" />
                <span className="font-medium">Free 30-day trial</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-primary flex-shrink-0" />
                <span className="font-medium">No credit card required</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-primary flex-shrink-0" />
                <span className="font-medium">Setup in 15 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
