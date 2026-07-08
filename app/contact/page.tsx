"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: "", email: "", contact: "", message: "" });
    }, 1200);
  };

  return (
    <>
      <Navbar />

      <main className="flex-grow min-h-screen bg-background pt-32 pb-24 animate-fade-in">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Column 1: Contact Details */}
          <div className="lg:col-span-5 space-y-8 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-accent">
                Reach Out
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-primary">
                Contact Team
              </h1>
              <p className="text-base text-muted-foreground font-light leading-relaxed">
                Have questions about Eternia, interested in partnering with us, or want to deploy our privacy-first wellbeing network at your school or university? Fill out the form and our team will get back to you.
              </p>
            </div>

            <div className="space-y-6 bg-card border border-border/40 p-6 rounded-2xl shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent/5 rounded-xl border border-accent/10 text-accent shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Phone Number</h4>
                  <a href="tel:9327949245" className="text-sm font-semibold text-primary hover:text-accent transition-colors">
                    9327949245
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent/5 rounded-xl border border-accent/10 text-accent shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Team Email</h4>
                  <a href="mailto:outreachteam@aurenity.in" className="text-sm font-semibold text-primary hover:text-accent transition-colors">
                    outreachteam@aurenity.in
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent/5 rounded-xl border border-accent/10 text-accent shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Founder Email</h4>
                  <a href="mailto:founder@aurenity.in" className="text-sm font-semibold text-primary hover:text-accent transition-colors">
                    founder@aurenity.in
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent/5 rounded-xl border border-accent/10 text-accent shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Company</h4>
                  <p className="text-sm font-semibold text-primary">
                    Aurenity Innovations Pvt Ltd
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 2: Form */}
          <div className="lg:col-span-7">
            <div className="bg-card border border-border/40 rounded-3xl p-8 shadow-md relative overflow-hidden h-full flex flex-col justify-center">
              
              {isSubmitted ? (
                <div className="text-center space-y-6 py-12 animate-fade-in">
                  <div className="inline-flex p-4 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/25">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="font-serif text-2xl font-bold text-primary">Thank You!</h2>
                    <p className="text-sm text-muted-foreground font-light max-w-sm mx-auto leading-relaxed">
                      Your message has been successfully sent. A representative from the Aurenity Innovations team will get back to you shortly.
                    </p>
                  </div>
                  <button
                    onClick={() => setIsSubmitted(false)}
                    className="px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-border hover:bg-muted text-primary transition-colors"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <h3 className="font-serif text-xl font-bold text-primary border-b border-border/40 pb-4">
                    Send a Message
                  </h3>
                  
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your name..."
                      className="w-full bg-muted/20 border border-border/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent placeholder:text-muted-foreground/50 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your.email@university.edu..."
                      className="w-full bg-muted/20 border border-border/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent placeholder:text-muted-foreground/50 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="contact" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      id="contact"
                      required
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      placeholder="Enter your phone number..."
                      className="w-full bg-muted/20 border border-border/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent placeholder:text-muted-foreground/50 transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Message / Inquiry
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="How can Aurenity support your campus or program? Describe your interest..."
                      className="w-full bg-muted/20 border border-border/40 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent placeholder:text-muted-foreground/50 transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider rounded-xl hover:bg-accent disabled:opacity-50 transition-all duration-300 shadow-sm"
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        Submit Inquiry <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
