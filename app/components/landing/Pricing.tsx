'use client';
import { useState, useEffect, useRef } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Check } from "lucide-react";
import { PRICING_PLANS } from "../../constants/pricing";

export function Pricing() {
  const [isYearly, setIsYearly] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimeout(() => {
      setIsVisible(true);
    }, 100);
  }, []);

  const scrollToCard = (index: number) => {
    if (cardsRef.current) {
      const cardElement = cardsRef.current.children[index] as HTMLElement;
      if (cardElement) {
        cardElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  };

  const plans = PRICING_PLANS;

  return (
    <section className="py-8 sm:py-12 md:py-16 lg:py-20 px-3 sm:px-4 md:px-6 lg:px-8 bg-gradient-to-br from-hero-bg-start via-hero-bg-mid to-hero-bg-end">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className={`text-center transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <span className="text-primary text-[10px] sm:text-xs md:text-sm font-medium mb-2 sm:mb-3 md:mb-4 inline-block">Pricing</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-3 sm:mb-4 md:mb-6 text-hero-text font-bold leading-tight">
            Enterprise AI at startup prices
          </h2>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-2 sm:mb-3 md:mb-4">
            <div className="relative inline-flex bg-hero-circle/10 backdrop-blur-sm border border-hero-circle/20 rounded-full p-0.5 sm:p-1">
              <button
                onClick={() => setIsYearly(false)}
                className={`px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 text-[10px] sm:text-xs md:text-sm font-medium rounded-full transition-all duration-300 ${
                  !isYearly 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'text-hero-subtext hover:text-hero-text'
                }`}
              >
                Billed monthly
              </button>
              <button
                onClick={() => setIsYearly(true)}
                className={`px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 text-[10px] sm:text-xs md:text-sm font-medium rounded-full transition-all duration-300 ${
                  isYearly 
                    ? 'bg-primary text-primary-foreground shadow-sm' 
                    : 'text-hero-subtext hover:text-hero-text'
                }`}
              >
                Billed yearly
              </button>
            </div>
          </div>
          <p className="text-[10px] sm:text-xs md:text-sm text-primary animate-bounce">
            Save up to 22% with yearly billing
          </p>
        </div>


        {/* Pricing Cards */}
        <div 
          ref={cardsRef}
          className="flex flex-nowrap justify-center gap-3 sm:gap-4 md:gap-6 overflow-x-auto py-16"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {plans.map((plan, index) => (
            <div 
              key={plan.name} 
              onClick={() => scrollToCard(index)}
              className={`relative transition-all duration-700 delay-${index * 100} cursor-pointer flex min-w-[180px] sm:min-w-[200px] md:min-w-[220px] max-w-[200px] sm:max-w-[220px] md:max-w-[240px] snap-center ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-2 sm:-top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground z-10 animate-pulse shadow-lg text-[9px] sm:text-[10px] px-2 sm:px-2.5 py-0.5">
                  Popular
                </Badge>
              )}
              <Card className={`p-3 sm:p-4 md:p-5 w-full flex flex-col transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:-translate-y-2 bg-card/70 backdrop-blur-sm border-hero-circle/20 ${
                plan.popular ? 'border-primary border-2 shadow-xl shadow-primary/30' : 'hover:border-primary/50 border-2'
              } !rounded-full`}>
                {/* Circular Progress Indicator */}
                <div className="flex justify-center mb-3 sm:mb-4">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28">
                    {/* Outer decorative circle */}
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                      <circle
                        cx="50%"
                        cy="50%"
                        r="45%"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-hero-circle/20"
                        strokeDasharray="4 4"
                      />
                      <circle
                        cx="50%"
                        cy="50%"
                        r="45%"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        className={`${plan.popular ? 'text-primary' : 'text-primary/60'} transition-all duration-500`}
                        strokeDasharray="283"
                        strokeDashoffset={plan.popular ? "70" : "100"}
                        strokeLinecap="round"
                      />
                    </svg>
                    {/* Inner white circle with price */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full bg-secondary backdrop-blur-sm flex items-center justify-center shadow-lg">
                        {plan.monthlyPrice !== null ? (
                          <div className="text-center">
                            <div className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-hero-text">
                              ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                            </div>
                            <div className="text-[7px] sm:text-[8px] text-hero-subtext">
                              {isYearly ? '/year' : '/month'}
                            </div>
                          </div>
                        ) : (
                          <div className="text-xs sm:text-sm font-bold text-hero-text">Custom</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Plan Title */}
                <div className="text-center mb-3 sm:mb-4">
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-hero-text mb-0.5 sm:mb-1 uppercase tracking-wide">
                    {plan.name}
                  </h3>
                  <p className="text-[9px] sm:text-[10px] md:text-xs text-hero-subtext">
                    {plan.description}
                  </p>
                </div>

                {/* Features List */}
                <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4 flex-grow">
                  {plan.features.map((feature, featureIndex) => (
                    <div 
                      key={featureIndex} 
                      className="flex items-center gap-1.5 sm:gap-2 transition-all duration-300"
                    >
                      <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary flex-shrink-0" />
                      <span className="text-[10px] sm:text-[11px] md:text-xs text-hero-text leading-tight">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <div className="flex justify-center w-full">
                  <Button 
                    className={`w-[calc(100%-3em)] sm:w-[calc(100%-4em)] md:w-[calc(100%-5em)] mt-auto transition-all duration-300 hover:scale-105 rounded-full py-1.5 sm:py-2 font-semibold text-[8px] sm:text-[9px] md:text-[10px] uppercase tracking-wide ${
                      plan.buttonVariant === 'default' 
                        ? 'bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-xl shadow-primary/40' 
                        : 'bg-gradient-to-r from-primary/20 to-primary/10 text-primary hover:from-primary/30 hover:to-primary/20 border-2 border-primary/30 hover:border-primary/50'
                    }`}
                    variant={plan.buttonVariant}
                  >
                    {plan.buttonText}
                  </Button>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
