"use client";

import { useState } from "react";
import PageHead from "@/components/layout/PageHead";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Mail,
  MapPin,
  Send,
  CheckCircle2,
  Github,
  Instagram,
  Linkedin,
} from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill in all mandatory fields.");
      return;
    }

    setSubmitted(true);
    toast.success("Message Sent Successfully!", {
      description: "Our secretarial team will respond to your query shortly.",
    });
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <>
      <PageHead
        title="Contact Us | IEEE PEC Student Branch"
        description="Get in touch with the IEEE PEC Student Branch executive committee or visit our office at Punjab Engineering College."
      />

      {/* Header Banner */}
      <section className="bg-gradient-to-b from-slate-900 via-slate-900 to-[#002855] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#00A3E0]">
            Get In Touch
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight">
            Contact IEEE PEC
          </h1>
          <p className="max-w-2xl mx-auto text-base text-slate-300 leading-relaxed">
            Have questions about workshops, hackathons, technical societies, or collaborations? Reach out to us.
          </p>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-16 bg-slate-50 dark:bg-slate-950 min-h-[70vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Contact Information */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-border shadow-sm space-y-6">
                <h3 className="text-xl font-bold text-foreground">
                  Branch Office & Contact Details
                </h3>

                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-slate-800 text-[#00629B] flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">Location</h4>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                        IEEE Student Branch, Punjab Engineering College (Deemed to be University), Sector 12, Chandigarh, 160012
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-slate-800 text-[#00629B] flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">Official Email Inquiries</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        <a href="mailto:ieee.pecsb@gmail.com" className="text-[#00629B] hover:underline font-medium">ieee.pecsb@gmail.com</a>
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        <a href="mailto:ieee@pec.edu.in" className="text-[#00629B] hover:underline font-medium">ieee@pec.edu.in</a>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social Connect */}
                <div className="pt-4 border-t border-border/60">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
                    Connect With Us Online
                  </h4>
                  <div className="flex items-center gap-2.5">
                    <a
                      href="https://github.com/IEEE-PEC"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-foreground hover:bg-[#00629B] hover:text-white transition-colors"
                      aria-label="GitHub"
                      title="GitHub @IEEE-PEC"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                    <a
                      href="https://www.linkedin.com/company/ieee-pec/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-foreground hover:bg-[#00629B] hover:text-white transition-colors"
                      aria-label="LinkedIn"
                      title="LinkedIn IEEE PEC"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                    <a
                      href="https://instagram.com/ieeepec"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-foreground hover:bg-[#00629B] hover:text-white transition-colors"
                      aria-label="Instagram"
                      title="Official Instagram @ieeepec"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                    <a
                      href="https://www.instagram.com/ieee.bts"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-foreground hover:bg-[#00629B] hover:text-white transition-colors text-xs font-bold"
                      aria-label="Behind the scenes Instagram"
                      title="Behind The Scenes @ieee.bts"
                    >
                      <span>@ieee.bts</span>
                    </a>
                    <a
                      href="mailto:ieee.pecsb@gmail.com"
                      className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-foreground hover:bg-[#00629B] hover:text-white transition-colors"
                      aria-label="Email"
                      title="Email ieee.pecsb@gmail.com"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct Message Form */}
            <div className="lg:col-span-7">
              <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-border shadow-lg space-y-6">
                <div className="space-y-1">
                  <h3 className="text-2xl font-extrabold text-foreground">
                    Send Us a Message
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Whether you are an engineering student, sponsor, or researcher, we'd love to hear from you.
                  </p>
                </div>

                {submitted ? (
                  <div className="p-8 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-lg text-emerald-900 dark:text-emerald-200">
                      Message Dispatched!
                    </h4>
                    <p className="text-xs text-emerald-700 dark:text-emerald-400 max-w-sm mx-auto">
                      Thank you for contacting IEEE PEC Student Branch. Our secretary will review your note and get back to you.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSubmitted(false)}
                      className="border-emerald-300 text-emerald-800 text-xs"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-xs font-semibold">Your Full Name *</Label>
                        <Input
                          id="name"
                          required
                          placeholder="e.g. Shashwat Mishra"
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="h-10 text-xs rounded-xl"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-xs font-semibold">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          required
                          placeholder="your.email@pec.edu.in"
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="h-10 text-xs rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="subject" className="text-xs font-semibold">Subject / Inquiry Topic *</Label>
                      <Input
                        id="subject"
                        required
                        placeholder="e.g. Workshop inquiry / Student branch partnership"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="h-10 text-xs rounded-xl"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="message" className="text-xs font-semibold">Message *</Label>
                      <Textarea
                        id="message"
                        required
                        rows={5}
                        placeholder="Write your query or message here..."
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="text-xs rounded-xl resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-[#00629B] hover:bg-[#004B7A] text-white rounded-xl py-6 font-semibold shadow-md"
                    >
                      <Send className="w-4 h-4 mr-2" /> Send Message
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
