'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '../landing/ui/button';
import { Card } from '../landing/ui/card';
import { Badge } from '../landing/ui/badge';
import { Check } from 'lucide-react';
import { PRICING_PLANS } from '../../constants/pricing';

interface PricingPlansListProps {
  currentPlanName?: string | null;
  onSelectPlan?: (planName: string) => void;
}

export function PricingPlansList({ currentPlanName, onSelectPlan }: PricingPlansListProps) {
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
    <div className="rounded-3xl border border-border bg-card/90 dark:bg-card/80 backdrop-blur-lg p-8 shadow-xl transition-colors">
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl sm:text-3xl md:text-4xl mb-4 text-card-foreground font-bold leading-tight">
          Choose Your Perfect Plan
        </h3>
        
        {/* Billing Toggle */}
        <div className="flex items-center justify-center mb-3">
          <div className="relative inline-flex bg-hero-circle/10 backdrop-blur-sm border border-hero-circle/20 rounded-full p-0.5 sm:p-1">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 text-xs sm:text-sm font-medium rounded-full transition-all duration-300 ${
                !isYearly 
                  ? 'bg-primary text-primary-foreground shadow-sm' 
                  : 'text-hero-subtext hover:text-hero-text'
              }`}
            >
              Billed monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 text-xs sm:text-sm font-medium rounded-full transition-all duration-300 ${
                isYearly 
                  ? 'bg-primary text-primary-foreground shadow-sm' 
                  : 'text-hero-subtext hover:text-hero-text'
              }`}
            >
              Billed yearly
            </button>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-primary font-medium">
          Save up to 22% with yearly billing
        </p>
      </div>

      {/* Pricing Cards */}
      <div 
        ref={cardsRef}
        className="flex flex-nowrap justify-center gap-3 sm:gap-4 md:gap-6 overflow-x-auto py-16"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {plans.map((plan, index) => {
          const isCurrentPlan = currentPlanName?.toLowerCase() === plan.name.toLowerCase();
          return (
            <div 
              key={plan.name} 
              onClick={() => scrollToCard(index)}
              className={`relative transition-all duration-700 delay-${index * 100} cursor-pointer flex min-w-[180px] sm:min-w-[200px] md:min-w-[220px] max-w-[200px] sm:max-w-[220px] md:max-w-[240px] snap-center ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
            >
              {(plan.popular || isCurrentPlan) && (
                <Badge className={`absolute -top-2 sm:-top-3 left-1/2 transform -translate-x-1/2 z-10 shadow-lg text-[9px] sm:text-[10px] px-2 sm:px-2.5 py-0.5 ${
                  isCurrentPlan 
                    ? 'bg-green-500 text-white animate-pulse' 
                    : 'bg-primary text-primary-foreground animate-pulse'
                }`}>
                  {isCurrentPlan ? 'Your Plan' : 'Popular'}
                </Badge>
              )}
              <Card className={`p-3 sm:p-4 md:p-5 w-full flex flex-col transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:-translate-y-2 bg-card/70 backdrop-blur-sm border-hero-circle/20 ${
                isCurrentPlan
                  ? 'border-green-500 border-3 shadow-xl shadow-green-500/50'
                  : plan.popular 
                  ? 'border-primary border-2 shadow-xl shadow-primary/30' 
                  : 'hover:border-primary/50 border-2'
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
                        className={isCurrentPlan ? 'text-green-500/20' : 'text-hero-circle/20'}
                        strokeDasharray="4 4"
                      />
                      <circle
                        cx="50%"
                        cy="50%"
                        r="45%"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        className={`${
                          isCurrentPlan
                            ? 'text-green-500'
                            : plan.popular 
                            ? 'text-primary' 
                            : 'text-primary/60'
                        } transition-all duration-500`}
                        strokeDasharray="283"
                        strokeDashoffset={isCurrentPlan || plan.popular ? "70" : "100"}
                        strokeLinecap="round"
                      />
                    </svg>
                    {/* Inner circle with price */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center shadow-lg ${
                        isCurrentPlan 
                          ? 'bg-green-500/10' 
                          : 'bg-secondary backdrop-blur-sm'
                      }`}>
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
                      isCurrentPlan
                        ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl shadow-green-500/40 cursor-default'
                        : plan.buttonVariant === 'default' 
                        ? 'bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg hover:shadow-xl shadow-primary/40' 
                        : 'bg-gradient-to-r from-primary/20 to-primary/10 text-primary hover:from-primary/30 hover:to-primary/20 border-2 border-primary/30 hover:border-primary/50'
                    }`}
                    variant={plan.buttonVariant}
                    disabled={isCurrentPlan}
                    onClick={() => {
                      if (onSelectPlan && !isCurrentPlan) {
                        onSelectPlan(plan.name);
                      }
                    }}
                  >
                    {isCurrentPlan ? 'Current Plan' : plan.buttonText}
                  </Button>
                </div>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="text-center mt-6">
        <p className="text-xs sm:text-sm text-muted-foreground font-medium">
          All plans include a 14-day free trial. No credit card required.
        </p>
      </div>
    </div>
  );
}

