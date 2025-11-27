'use client';
import Image from "next/image";
import { Button } from "./ui/button";

export function Hero() {
  const scrollToDemo = () => {
    const element = document.getElementById("contact");
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-hero-bg-start via-hero-bg-mid to-hero-bg-end min-h-screen flex items-center pt-16 sm:pt-20 pb-8 sm:pb-12">
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid items-center gap-6 sm:gap-8 lg:gap-12 lg:grid-cols-2">
          {/* Left Content */}
          <div className="max-w-xl space-y-3 sm:space-y-4 lg:space-y-6 z-10">
            <div className="space-y-2 sm:space-y-3 lg:space-y-4">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight text-hero-text tracking-tight">
                Automate customer conversations with an{" "}
                <span className="text-primary">
                  AI copilot
                </span>{" "}
                for Bitrix24
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-hero-subtext leading-relaxed">
                Capture requests instantly, sync context to CRM, and deliver proactive support without slowing your team down.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                size="lg"
                onClick={scrollToDemo}
                className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/40 hover:scale-105 font-semibold rounded-full px-6 sm:px-8"
              >
                Get a demo
              </Button>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative flex justify-center lg:justify-end mt-4 sm:mt-6 lg:mt-0 px-4 sm:px-6 lg:px-0">
            <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-lg">
              {/* Orbiting circles around robot - glowing lights */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute w-[220px] h-[220px] sm:w-[280px] sm:h-[280px] lg:w-[320px] lg:h-[320px] rounded-full border-2 shadow-[0_0_15px] sm:shadow-[0_0_20px] border-hero-circle shadow-hero-circle/60 animate-[spin_20s_linear_infinite]" />
                <div className="absolute w-[280px] h-[280px] sm:w-[350px] sm:h-[350px] lg:w-[400px] lg:h-[400px] rounded-full border-2 shadow-[0_0_15px] sm:shadow-[0_0_20px] border-hero-circle shadow-hero-circle/50 animate-[spin_30s_linear_infinite_reverse]" />
                <div className="absolute w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] lg:w-[480px] lg:h-[480px] rounded-full border-2 shadow-[0_0_15px] sm:shadow-[0_0_20px] border-hero-circle shadow-hero-circle/40 animate-[spin_40s_linear_infinite]" />
              </div>
              <Image
                src="/Floating-Robot.png"
                alt="Floating AI assistant robot"
                width={500}
                height={500}
                priority
                className="relative z-10 h-auto w-full object-contain animate-float drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
