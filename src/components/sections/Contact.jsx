"use client";

import { useState } from "react";

const Contact = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const target = e.target;
        const name = target.name.value;
        const email = target.email.value;
        const message = target.message.value;

        const myEmail = "gallegojamesryan719@gmail.com";
        const subject = `Portfolio Inquiry from ${name}`;
        const body = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;

        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${myEmail}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

        window.open(gmailUrl, '_blank');

        setTimeout(() => setIsSubmitting(false), 1000);
    };

    return (
        <section className="container mx-auto px-4 py-20 max-w-4xl" id="contact">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold">
                    Contact <span className="text-primary">Me</span>
                </h2>
                <p className="mt-4 text-muted-foreground">
                    Have a project in mind? Let&#39;s talk.
                </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-6 md:p-10 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium">Name</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Your name"
                                required
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Email Address..."
                                required
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-medium">Message</label>
                        <textarea
                            id="message"
                            name="message"
                            placeholder="How can I help you?"
                            cols="30"
                            rows="6"
                            required
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full md:w-auto inline-flex items-center justify-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "Redirecting to Gmail..." : "Send Message"}
                    </button>
                </form>
            </div>
        </section>
    );
};

export default Contact;