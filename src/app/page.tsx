"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  Terminal,
  Zap,
  Sparkles,
  Flame,
  Trophy,
  ArrowRight,
  ChevronDown,
  CheckCircle2,
  Shield,
  Layers,
  Cpu,
} from "lucide-react";

export default function Home() {
  const [terminalStep, setTerminalStep] = useState(0);
  const [terminalCode, setTerminalCode] = useState("");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const fullCode = `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) {
      return [map.get(diff), i];
    }
    map.set(nums[i], i);
  }
}`;

  useEffect(() => {
    if (terminalStep === 0) {
      // Typing effect
      let i = 0;
      const interval = setInterval(() => {
        setTerminalCode(fullCode.slice(0, i));
        i++;
        if (i > fullCode.length) {
          clearInterval(interval);
          setTimeout(() => setTerminalStep(1), 1000); // Trigger compile
        }
      }, 25);
      return () => clearInterval(interval);
    } else if (terminalStep === 1) {
      // Compile & run testcases
      const timer = setTimeout(() => setTerminalStep(2), 2000);
      return () => clearTimeout(timer);
    } else if (terminalStep === 2) {
      // Display level up
      const timer = setTimeout(() => {
        // Reset typing loop after a delay
        const resetTimer = setTimeout(() => {
          setTerminalStep(0);
          setTerminalCode("");
        }, 8000);
        return () => clearTimeout(resetTimer);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [terminalStep]);

  const features = [
    {
      icon: <Terminal className="h-6 w-6 text-cyan-400" />,
      title: "Interactive Code Workspace",
      desc: "Full Monaco Editor with auto-completion, font adjustment, and responsive console outputs.",
    },
    {
      icon: <Cpu className="h-6 w-6 text-indigo-400" />,
      title: "Multi-language Sandbox",
      desc: "Secure container-based compiler supporting JS, TS, Python, C++, Go, Java, and Rust.",
    },
    {
      icon: <Sparkles className="h-6 w-6 text-pink-400" />,
      title: "AI Co-pilot Companion",
      desc: "AI hint generator, code reviewer, and interview coach powered by Gemini API.",
    },
    {
      icon: <Flame className="h-6 w-6 text-amber-500" />,
      title: "Gamification & Ranks",
      desc: "XP level-ups, daily streaks, achievements, and ranking tiers from Bronze to Diamond.",
    },
    {
      icon: <Trophy className="h-6 w-6 text-emerald-400" />,
      title: "Weekly Rated Contests",
      desc: "Solve algorithmic problems, track live leaderboards, and boost your global developer rating.",
    },
    {
      icon: <Shield className="h-6 w-6 text-indigo-400" />,
      title: "Enterprise Security",
      desc: "Robust code sandboxing, rate limiting, and protection against malicious script injections.",
    },
  ];

  const roadmaps = [
    {
      tier: "Bronze Range",
      topics: ["Arrays", "Strings", "Complexity Analysis"],
      difficulty: "Easy",
      unlocked: true,
      color: "from-amber-800 to-amber-600",
    },
    {
      tier: "Silver Ascent",
      topics: ["Stacks & Queues", "Linked Lists", "Binary Search"],
      difficulty: "Easy/Medium",
      unlocked: true,
      color: "from-slate-400 to-slate-200",
    },
    {
      tier: "Gold Mastery",
      topics: ["Trees & BSTs", "Heaps", "Recursion & Backtracking"],
      difficulty: "Medium",
      unlocked: true,
      color: "from-yellow-500 to-amber-400",
    },
    {
      tier: "Platinum Core",
      topics: ["Graphs (DFS/BFS)", "Greedy Algorithims", "Dynamic Programming"],
      difficulty: "Medium/Hard",
      unlocked: true,
      color: "from-indigo-600 to-indigo-400",
    },
    {
      tier: "Diamond Apex",
      topics: ["Advanced DP", "Segment Trees & Tries", "Bit Manipulation"],
      difficulty: "Hard",
      unlocked: false,
      color: "from-cyan-500 to-sky-400",
    },
  ];

  const faqs = [
    {
      q: "Which programming languages are supported in the compiler?",
      a: "NexusCode supports 9 languages: JavaScript, TypeScript, Python, C, C++, Java, Kotlin, Go, and Rust. All execution runs in isolated secure environments with custom resource quotas.",
    },
    {
      q: "How does the gamification system work?",
      a: "Solving DSA problems, submitting correct answers, and participating in contests rewards you with XP. Earn enough XP to level up and advance through tiers: Bronze, Silver, Gold, Platinum, and Diamond. Unlock digital achievement badges as you hit milestones.",
    },
    {
      q: "Is the code compiler safe from malicious scripts?",
      a: "Yes. Our compiler utilizes virtualized, isolated sandbox environments with short timeouts, memory restrictions, and network isolation to prevent runtime security breaches.",
    },
    {
      q: "Is there a limit on how many solutions I can submit?",
      a: "No, standard users can solve and submit as many questions as they want. Premium tiers add advanced AI suggestions, locked premium questions, and simulated interviews.",
    },
  ];

  return (
    <div className="relative flex flex-col items-center justify-center w-full min-h-screen overflow-hidden">
      {/* Background radial neon lights */}
      <div className="absolute top-20 left-1/4 -translate-x-1/2 w-[350px] h-[350px] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute top-60 right-1/4 translate-x-1/2 w-[400px] h-[400px] rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative z-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 pb-20 flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 flex flex-col items-start text-left space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs text-indigo-300 shadow-[0_0_15px_-3px_rgba(99,102,241,0.2)]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Introducing NexusCode Beta</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-none">
            Master Algorithms.<br />
            <span className="text-gradient-indigo-cyan">Engineered for Excellence.</span>
          </h1>

          <p className="text-zinc-400 text-base sm:text-lg max-w-lg">
            Solve 300+ topic-wise DSA problems, compete on live boards, compile securely in 9+ languages, and boost your skills with AI mentors.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link
              href="/signup"
              className="glow-btn-primary flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-white cursor-pointer"
            >
              Start Coding Now
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/problems"
              className="glass-panel hover:bg-white/5 flex items-center justify-center rounded-xl px-6 py-3.5 text-sm font-semibold text-zinc-300 hover:text-white transition-all cursor-pointer"
            >
              Browse Problems
            </Link>
          </div>
        </div>

        {/* Live Terminal Preview */}
        <div className="flex-1 w-full max-w-xl lg:max-w-none">
          <div className="glass-panel glass-panel-heavy rounded-2xl overflow-hidden shadow-2xl border-white/10">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-zinc-950/60 border-b border-white/5">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="text-xs text-zinc-500 font-mono">twoSum.js</div>
              <div className="flex items-center gap-1.5 rounded bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 text-[10px] text-indigo-400">
                <Code2 className="h-3 w-3" />
                <span>JavaScript</span>
              </div>
            </div>

            {/* Code editor */}
            <div className="p-5 font-mono text-xs text-left min-h-[220px] bg-zinc-950/30 overflow-y-auto leading-relaxed">
              <pre className="text-zinc-300 select-none">
                <code>{terminalCode}</code>
                {terminalStep === 0 && <span className="terminal-cursor" />}
              </pre>
            </div>

            {/* Terminal console */}
            <div className="border-t border-white/5 bg-[#070709] p-4 min-h-[110px] font-mono text-left text-[11px] leading-relaxed">
              <AnimatePresence mode="wait">
                {terminalStep === 1 && (
                  <motion.div
                    key="compiling"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-zinc-400 space-y-1"
                  >
                    <p className="text-cyan-400">⚡ Initializing secure container...</p>
                    <p>📦 Mounting source code...</p>
                    <p className="animate-pulse text-indigo-400">🔨 Executing compile (NodeJS)...</p>
                  </motion.div>
                )}

                {terminalStep === 2 && (
                  <motion.div
                    key="running"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-1"
                  >
                    <p className="text-emerald-400 font-semibold">✓ Test case 1: Passed (24ms)</p>
                    <p className="text-emerald-400 font-semibold">✓ Test case 2: Passed (15ms)</p>
                    <p className="text-zinc-500">---------------------------------</p>
                    <p className="text-gradient-indigo-cyan font-bold">
                      🎉 Submission Accepted! 20 XP Gained.
                    </p>
                    <motion.p
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="text-pink-400 font-bold flex items-center gap-1.5 mt-1"
                    >
                      <Trophy className="h-3.5 w-3.5" />
                      Level Up! You reached Level 2 (Silver Tier).
                    </motion.p>
                  </motion.div>
                )}

                {terminalStep === 0 && (
                  <motion.div key="idle" className="text-zinc-600">
                    <p>$ npm run test</p>
                    <p className="text-zinc-700">Waiting for changes...</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="relative z-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-24 border-t border-white/5">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs uppercase font-extrabold text-indigo-400 tracking-wider">Features</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
            Standard-Grade Environment for Software Developers
          </h3>
          <p className="text-zinc-400 text-sm sm:text-base">
            No mock setups. NexusCode provides full-stack capabilities, secure compiler limits, and real tools to accelerate learning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -4, borderColor: "rgba(99, 102, 241, 0.3)" }}
              className="glass-panel p-6 rounded-2xl flex flex-col items-start text-left space-y-4 transition-all duration-300 relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300 pointer-events-none" />
              <div className="p-3 bg-white/5 rounded-xl">{feat.icon}</div>
              <h4 className="text-lg font-bold text-white">{feat.title}</h4>
              <p className="text-zinc-400 text-sm leading-relaxed">{feat.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Roadmap section */}
      <section className="relative z-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-24 border-t border-white/5">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs uppercase font-extrabold text-cyan-400 tracking-wider">Roadmap</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
            Beginner-to-Advanced DSA Pathway
          </h3>
          <p className="text-zinc-400 text-sm sm:text-base">
            Follow a structured guide, earn levels, and climb tiers. Master DSA in a gamified structured syllabus.
          </p>
        </div>

        {/* Roadmap Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {roadmaps.map((road, idx) => (
            <div
              key={idx}
              className={`glass-panel p-5 rounded-2xl flex flex-col justify-between text-left min-h-[220px] transition-all relative overflow-hidden ${
                road.unlocked ? "border-white/10" : "opacity-50"
              }`}
            >
              {/* Highlight bar */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${road.color}`} />
              <div className="space-y-3">
                <span className="text-[10px] uppercase font-bold text-zinc-500">Step {idx + 1}</span>
                <h4 className="text-lg font-bold text-white">{road.tier}</h4>
                <div className="flex flex-wrap gap-1">
                  {road.topics.map((t, ti) => (
                    <span key={ti} className="text-[9px] bg-white/5 border border-white/5 rounded-full px-2 py-0.5 text-zinc-400">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5 text-[11px]">
                <span className="text-zinc-500 font-medium">Difficulty: {road.difficulty}</span>
                {road.unlocked ? (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Unlocked
                  </span>
                ) : (
                  <span className="text-zinc-500 font-semibold">Locked</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Showcase */}
      <section className="relative z-10 w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-24 border-t border-white/5">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs uppercase font-extrabold text-pink-400 tracking-wider">Pricing</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold text-white">
            Choose Your Mastery Plan
          </h3>
          <p className="text-zinc-400 text-sm sm:text-base">
            Get unlimited compiler access for free. Upgrade to Premium for advanced AI code optimization, mock interviewer tools, and exclusive company questions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Plan 1 */}
          <div className="glass-panel p-8 rounded-2xl flex flex-col justify-between text-left space-y-6">
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-white">Free Sandbox</h4>
              <p className="text-zinc-500 text-xs">For self-guided developer practicing</p>
              <div className="text-3xl font-extrabold text-white">$0 <span className="text-xs font-normal text-zinc-500">/ forever</span></div>
              <ul className="space-y-2 text-xs text-zinc-400">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" /> Solve 300+ standard DSA questions</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" /> Unlimited code compiler execution</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" /> Streak tracking & levels</li>
              </ul>
            </div>
            <Link
              href="/signup"
              className="flex justify-center border border-white/10 rounded-xl py-2.5 text-xs font-semibold text-zinc-300 hover:bg-white/5 hover:text-white transition-colors"
            >
              Sign Up Free
            </Link>
          </div>

          {/* Plan 2 - Promoted */}
          <div className="glass-panel p-8 rounded-2xl flex flex-col justify-between text-left space-y-6 border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.1)] relative">
            <div className="absolute top-0 right-6 -translate-y-1/2 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 px-3.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
              Most Popular
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-white">Nexus Pro</h4>
              <p className="text-zinc-400 text-xs">Accelerated learning with active AI assistance</p>
              <div className="text-3xl font-extrabold text-white">$9.99 <span className="text-xs font-normal text-zinc-500">/ month</span></div>
              <ul className="space-y-2 text-xs text-zinc-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" /> Everything in Free Sandbox</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" /> Unlimited AI coding hint prompts</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" /> Live AI Code Review & Optimizer</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" /> Access to locked Premium DSA problems</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" /> Company-wise target question packs</li>
              </ul>
            </div>
            <Link
              href="/signup?plan=pro"
              className="glow-btn-primary flex justify-center rounded-xl py-2.5 text-xs font-semibold text-white"
            >
              Get Pro Access
            </Link>
          </div>

          {/* Plan 3 */}
          <div className="glass-panel p-8 rounded-2xl flex flex-col justify-between text-left space-y-6">
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-white">Nexus Dev Elite</h4>
              <p className="text-zinc-500 text-xs">Advanced prep for FAANG hiring rounds</p>
              <div className="text-3xl font-extrabold text-white">$24.99 <span className="text-xs font-normal text-zinc-500">/ month</span></div>
              <ul className="space-y-2 text-xs text-zinc-400">
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" /> Everything in Nexus Pro</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" /> Real-time collaborative coding rooms</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" /> Unlimited mock AI interviews</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" /> Personal resume review evaluations</li>
              </ul>
            </div>
            <Link
              href="/signup?plan=elite"
              className="flex justify-center border border-white/10 rounded-xl py-2.5 text-xs font-semibold text-zinc-300 hover:bg-white/5 hover:text-white transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative z-10 w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-24 border-t border-white/5">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-xs uppercase font-extrabold text-indigo-400 tracking-wider">FAQs</h2>
          <h3 className="text-3xl font-extrabold text-white">Frequently Asked Questions</h3>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="glass-panel rounded-xl overflow-hidden border-white/5"
            >
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between px-6 py-4 text-left text-zinc-200 hover:text-white transition-colors hover:bg-white/2"
              >
                <span className="text-sm font-semibold">{faq.q}</span>
                <ChevronDown
                  className={`h-4 w-4 text-zinc-400 transition-transform ${
                    activeFaq === idx ? "transform rotate-180 text-cyan-400" : ""
                  }`}
                />
              </button>
              {activeFaq === idx && (
                <div className="px-6 pb-4 pt-1 text-xs text-zinc-400 leading-relaxed border-t border-white/2 bg-zinc-950/20">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
