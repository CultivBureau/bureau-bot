'use client';

import { useState } from "react";

import { CTASection } from "./CTASection";
import RequestDemoForm from "./RequestDemoForm";

export function DemoRequestSection() {
  const [showDemoForm, setShowDemoForm] = useState(false);

  const handleShowDemo = () => setShowDemoForm(true);

  return (
    <>
      <section id="about">
        <CTASection onShowDemo={handleShowDemo} />
      </section>
      {showDemoForm && (
        <section id="contact">
          <RequestDemoForm />
        </section>
      )}
    </>
  );
}

