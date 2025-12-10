'use client';

import { Header } from "./components/landing/Header";
import { Hero } from "./components/landing/Hero";
import { BenefitsCards } from "./components/landing/BenefitsCards";
import { Bitrix24Integration } from "./components/landing/Bitrix24Integration";
import { FAQs } from "./components/landing/FAQs";
import { DemoRequestSection } from "./components/landing/DemoRequestSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="">
        <section id="home">
          <Hero />
        </section>
        <section id="features" className="">
          <Bitrix24Integration />
          <BenefitsCards />
        </section>
        <section id="faq">
          <FAQs />
        </section>
        <DemoRequestSection />
      </main>
    </div>
  );
}