import React from "react";
import { ShieldAlert, BookOpen, AlertCircle, FileText } from "lucide-react";

export const metadata = {
  title: "Terms of Service | CodeHub",
  description: "Terms and conditions for using the CodeHub platform.",
};

export default function TermsPage() {
  return (
    <div className="flex-1 w-full bg-[#09090b] relative z-10 py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12 space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-white/5 border border-white/10 rounded-2xl mb-2">
            <FileText className="h-8 w-8 text-indigo-400" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            Terms of <span className="text-gradient-indigo-cyan">Service</span>
          </h1>
          <p className="text-zinc-400 text-sm font-mono">
            Last Updated: May 27, 2026
          </p>
        </div>

        {/* Content */}
        <div className="glass-panel p-8 rounded-3xl border border-white/5 space-y-8 text-zinc-300 text-sm leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-indigo-400" />
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using CodeHub (the "Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Platform. We reserve the right to update or modify these terms at any time without prior notice.
            </p>
          </section>

          <div className="h-[1px] w-full bg-white/5" />

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-amber-400" />
              2. Acceptable Use Policy
            </h2>
            <p>
              You agree not to use the Platform to:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-zinc-400">
              <li>Execute malicious code intended to compromise our servers, sandboxes, or the Judge0 API.</li>
              <li>Attempt to bypass or exploit our containerized execution environments.</li>
              <li>Submit code that initiates network requests to external APIs (unless explicitly permitted in the problem scope).</li>
              <li>Scrape, reverse engineer, or heavily automate submissions using bots.</li>
            </ul>
          </section>

          <div className="h-[1px] w-full bg-white/5" />

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-pink-400" />
              3. User Accounts & Data
            </h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials. We reserve the right to terminate or suspend access to our service immediately, without prior notice, for conduct that we believe violates these Terms of Service or is harmful to other users of the platform, us, or third parties, or for any other reason.
            </p>
          </section>

          <div className="h-[1px] w-full bg-white/5" />

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">
              4. Disclaimer of Warranties
            </h2>
            <p>
              The Platform is provided "AS IS" and "AS AVAILABLE" without any warranties of any kind, express or implied. We do not warrant that the compilation and execution of code will be uninterrupted or error-free. We rely on third-party services (such as the Judge0 API) which may experience downtime.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
