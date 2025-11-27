"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function FAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "How long does it take to set up BureauBot?",
      answer: "Most customers are up and running within 15 minutes. Our guided setup walks you through connecting to Bitrix24, configuring your knowledge base, and customizing conversation flows. For enterprise deployments with custom integrations, implementation typically takes 1-2 weeks."
    },
    {
      question: "What happens if the bot doesn't know the answer?",
      answer: "BureauBot intelligently escalates to your human team when confidence is low or the query is complex. You can configure escalation rules, assign specialists by topic, and ensure customers always get accurate answers. The bot learns from these escalations to improve over time."
    },
    {
      question: "Is my data secure and compliant?",
      answer: "Yes. BureauBot is built with enterprise-grade security, including encryption at rest and in transit, role-based access control, and audit trails. We're compliant with GDPR, MENA regulations, and industry standards. Your data never leaves your control and isn't used to train shared models."
    },
    {
      question: "Can I customize the bot's personality and responses?",
      answer: "Absolutely. You control the bot's tone, language style, response length, and personality traits. Configure different personas for different channels or customer segments. Add custom greetings, branded responses, and department-specific knowledge bases."
    },
    {
      question: "How does pricing work for multiple channels?",
      answer: "Our pricing is based on conversation volume, not channels. Whether customers reach out via WhatsApp, email, or web chat, it counts as one conversation. All Bitrix24 Open Channels are included in every plan with no additional fees."
    }

  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-bl from-hero-bg-start via-hero-bg-mid to-hero-bg-end">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10 sm:mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-hero-text tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-hero-subtext max-w-3xl mx-auto leading-relaxed">
            Everything you need to know about BureauBot and how it works with Bitrix24
          </p>
        </div>

        <div className="space-y-4 sm:space-y-5">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`group bg-card/70 backdrop-blur-sm border-2 border-hero-circle/20 hover:border-primary/50 transition-all duration-300 overflow-hidden hover:shadow-xl hover:shadow-primary/20 ${openIndex === index ? "rounded-4xl" : "rounded-full"
                }`}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left p-5 sm:p-6 lg:p-7 flex items-center justify-between gap-4 hover:bg-hero-circle/5 transition-colors duration-200"
              >
                <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-hero-text pr-4">
                  {faq.question}
                </h3>
                <ChevronDown
                  className={`w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0 transition-transform duration-300 ${openIndex === index ? "rotate-180" : ""
                    }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
              >
                <div className="px-5 sm:px-6 lg:px-7 pb-5 sm:pb-6 lg:pb-7 pt-0">
                  <p className="text-sm sm:text-base text-hero-subtext leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
