import React from "react";
import { Lock, Eye, Database, Globe } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | CodeHub",
  description: "Privacy policy explaining how we handle user data on CodeHub.",
};

export default function PrivacyPage() {
  return (
    <div className="flex-1 w-full bg-[#09090b] relative z-10 py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12 space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-white/5 border border-white/10 rounded-2xl mb-2">
            <Lock className="h-8 w-8 text-emerald-400" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white">
            Privacy <span className="text-gradient-indigo-cyan">Policy</span>
          </h1>
          <p className="text-zinc-400 text-sm font-mono">
            Last Updated: May 27, 2026
          </p>
        </div>

        {/* Content */}
        <div className="glass-panel p-8 rounded-3xl border border-white/5 space-y-8 text-zinc-300 text-sm leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Eye className="h-5 w-5 text-cyan-400" />
              1. Information We Collect
            </h2>
            <p>
              When you use CodeHub, we collect specific information to provide you with the best possible experience. This includes:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-zinc-400">
              <li><strong>Account Data:</strong> Username, email address, and authentication tokens when you register.</li>
              <li><strong>Code Submissions:</strong> The source code you submit for execution in our compiler to evaluate test cases.</li>
              <li><strong>Usage Metrics:</strong> Your problem-solving history, XP gained, and level progressions to maintain the leaderboard.</li>
            </ul>
          </section>

          <div className="h-[1px] w-full bg-white/5" />

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Database className="h-5 w-5 text-indigo-400" />
              2. How We Use Your Data
            </h2>
            <p>
              We use the collected information primarily to operate, maintain, and enhance the CodeHub platform. Your code submissions are evaluated against test cases to award you XP. We may also use aggregated, anonymized data for analytical purposes to improve our platform's problem selection.
            </p>
          </section>

          <div className="h-[1px] w-full bg-white/5" />

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Globe className="h-5 w-5 text-emerald-400" />
              3. Third-Party Services
            </h2>
            <p>
              To provide fast and secure code compilation, we integrate with third-party services like the Judge0 API. When you click "Run Code" or "Submit Solution", your raw code payload is securely transmitted to these compilation clusters. These providers process the code securely and do not use it for alternative purposes.
            </p>
          </section>

          <div className="h-[1px] w-full bg-white/5" />

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">
              4. Data Security
            </h2>
            <p>
              We prioritize the security of your data. We use standard encryption protocols (like HTTPS) to transmit data between your browser and our backend servers. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
