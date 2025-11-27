"use client";

import { useState, FormEvent } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { CheckCircle2 } from "lucide-react";

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    company: string;
    role: string;
    crmPlatform: string;
    teamSize: string;
    message: string;
}

type FieldId = keyof FormData;
type FieldType = "text" | "email" | "select" | "textarea";

interface FormField {
    id: FieldId;
    label: string;
    type: FieldType;
    required?: boolean;
    options?: string[];
}

const formFields: FormField[] = [
    { id: "firstName", label: "First Name", type: "text", required: true },
    { id: "lastName", label: "Last Name", type: "text", required: true },
    { id: "email", label: "Work Email", type: "email", required: true },
    { id: "company", label: "Company Name", type: "text", required: true },
    {
        id: "role",
        label: "Your Role",
        type: "select",
        required: true,
        options: [
            "IT/Security",
            "Operations",
            "Customer Service",
            "Sales",
            "Executive",
            "Other",
        ],
    },
    {
        id: "crmPlatform",
        label: "CRM Platform",
        type: "select",
        required: true,
        options: ["Bitrix24", "Planning to use Bitrix24", "Other CRM"],
    },
    {
        id: "teamSize",
        label: "Team Size",
        type: "select",
        required: true,
        options: ["1-10", "11-50", "51-200", "201-1000", "1000+"],
    },
    { id: "message", label: "Additional Information", type: "textarea" },
];

const initialFormData: FormData = {
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    role: "",
    crmPlatform: "",
    teamSize: "",
    message: "",
};

export default function RequestDemoForm() {
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        // simulate network
        await new Promise((r) => setTimeout(r, 1200));
        setSubmitting(false);
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-background">
                <div className="text-center max-w-xl mx-auto bg-card p-8 sm:p-12 rounded-full shadow-xl border border-border">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-6">
                        <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                        Thank you for your interest!
                    </h2>
                    <p className="text-muted-foreground text-base sm:text-lg mb-6">
                        We&apos;ll be in touch within one business day to schedule your personalized demo of BureauBot.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section id="contact" className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-hero-bg-start via-hero-bg-mid to-hero-bg-end">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10 sm:mb-12">
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-hero-text mb-4 sm:mb-6">Request a Demo</h2>
                    <p className="text-base sm:text-lg lg:text-xl text-hero-subtext leading-relaxed">
                        See how BureauBot can transform your customer service operations with a personalized demo.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 bg-card/70 backdrop-blur-sm p-6 sm:p-8 lg:p-10 rounded-4xl shadow-2xl border border-hero-circle/20">
                    <div className="grid gap-5 sm:gap-6 sm:grid-cols-2">
                        {formFields.map((field) => (
                            <div key={field.id} className={field.type === "textarea" ? "sm:col-span-2" : undefined}>
                                <Label htmlFor={field.id} className="text-sm font-medium text-hero-text">
                                    {field.label}
                                    {field.required && <span className="text-destructive ml-1">*</span>}
                                </Label>
                                <div className="mt-2">
                                    {field.type === "select" ? (
                                        <select
                                            id={field.id}
                                            name={field.id}
                                            required={field.required}
                                            value={formData[field.id]}
                                            onChange={(e) =>
                                                setFormData((prev) => ({ ...prev, [field.id]: e.target.value }))
                                            }
                                            className="block w-full rounded-full border-2 border-hero-circle/30 bg-background/30 px-4 py-2.5 text-sm text-hero-text focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                                        >
                                            <option value="">Select...</option>
                                            {field.options?.map((option) => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    ) : field.type === "textarea" ? (
                                        <Textarea
                                            id={field.id}
                                            name={field.id}
                                            rows={4}
                                            value={formData[field.id]}
                                            onChange={(e) =>
                                                setFormData((prev) => ({ ...prev, [field.id]: e.target.value }))
                                            }
                                            className="border-2 border-hero-circle/30 bg-background/30 text-hero-text focus:border-primary focus:ring-primary/20"
                                        />
                                    ) : (
                                        <Input
                                            type={field.type}
                                            id={field.id}
                                            name={field.id}
                                            required={field.required}
                                            value={formData[field.id]}
                                            onChange={(e) =>
                                                setFormData((prev) => ({ ...prev, [field.id]: e.target.value }))
                                            }
                                            className="border-hero-circle/30 bg-background/30 text-hero-text focus:border-primary focus:ring-primary/20"
                                        />
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-center pt-4 border-t border-hero-circle/20">
                        <Button
                            size="lg"
                            className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/30 transition-all duration-300 hover:scale-105 font-semibold min-w-[200px] rounded-full"
                            type="submit"
                            disabled={submitting}
                        >
                            {submitting ? "Submitting..." : "Submit Request"}
                        </Button>
                    </div>
                </form>
            </div>
        </section>
    );
}
