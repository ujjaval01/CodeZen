import React from "react";
import { HelpCircle, Terminal, Code, Trophy, Shield, Zap } from "lucide-react";

export const metadata = {
  title: "Help & FAQs | CodeHub",
  description: "Find answers to common questions about using CodeHub.",
};

const faqs = [
  {
    icon: <Terminal className="h-5 w-5 text-cyan-400" />,
    question: "What is CodeHub?",
    answer:
      "CodeHub is a premium, high-performance platform designed for software engineers to practice Data Structures and Algorithms (DSA), compete in contests, and master coding interviews. We provide an isolated, sandboxed execution environment to test your logic securely.",
  },
  {
    icon: <Code className="h-5 w-5 text-emerald-400" />,
    question: "Which programming languages are supported?",
    answer:
      "Currently, our compiler supports JavaScript, Python, C++, Java, and Kotlin. We utilize the Judge0 API to ensure fast and reliable execution across all supported languages.",
  },
  {
    icon: <Trophy className="h-5 w-5 text-amber-400" />,
    question: "How do XP and Levels work?",
    answer:
      "Every time you successfully solve a problem for the first time, you earn XP (Experience Points). As you accumulate XP, you level up and climb the ranks from Bronze to Master, allowing you to showcase your algorithmic prowess on the Leaderboard.",
  },
  {
    icon: <Shield className="h-5 w-5 text-indigo-400" />,
    question: "Is my code secure?",
    answer:
      "Yes! All code submissions are executed in an isolated sandboxed environment. This ensures that malicious code cannot harm the platform, and your execution results are strictly tied to your authenticated session.",
  },
  {
    icon: <Zap className="h-5 w-5 text-pink-400" />,
    question: "Is CodeHub free to use?",
    answer:
      "Absolutely. Our core problem-solving platform, compiler, and standard test cases are completely free for all developers. We believe in accessible technical education.",
  },
];

export default function FAQPage() {
  return (
    <div className="flex-1 w-full bg-[#09090b] relative z-10 py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-white/5 border border-white/10 rounded-2xl mb-2">
            <HelpCircle className="h-8 w-8 text-cyan-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Help & <span className="text-gradient-indigo-cyan">FAQs</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Everything you need to know about compiling code, earning XP, and navigating the CodeHub ecosystem.
          </p>
        </div>

        {/* FAQ Grid */}
        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-all hover:bg-white/[0.02]"
            >
              <div className="flex items-start gap-4">
                <div className="p-2 bg-white/5 rounded-xl border border-white/5 shrink-0">
                  {faq.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-white">{faq.question}</h3>
                  <p className="text-zinc-400 leading-relaxed text-sm">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Contact Footer */}
        <div className="mt-16 text-center glass-panel p-8 rounded-3xl border border-cyan-500/20 bg-cyan-500/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 opacity-50 blur-xl" />
          <div className="relative z-10 space-y-4">
            <h3 className="text-xl font-bold text-white">Still have questions?</h3>
            <p className="text-zinc-400 text-sm">
              Our engineering team is always ready to assist you. Reach out via GitHub issues or join our community discussions.
            </p>
            <button className="glow-btn-primary px-6 py-2.5 rounded-lg text-sm font-bold text-white mt-2">
              Contact Support
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
