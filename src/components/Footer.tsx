import Link from "next/link";
import { Terminal, Cpu, HelpCircle } from "lucide-react";

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/5 bg-[#09090b]/40 py-8 relative z-10 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-cyan-400" />
            <span className="text-xs font-semibold tracking-wider text-zinc-400">
              NEXUS<span className="text-white">CODE</span>
            </span>
            <span className="text-[10px] text-zinc-600 border border-white/5 rounded-full px-2 py-0.5 bg-white/5">
              v1.0.0 Stable
            </span>
          </div>

          {/* System Indicators */}
          <div className="flex items-center gap-4 text-[10px] text-zinc-500">
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Isolated Sandbox Online
            </span>
            <span className="h-3 w-[1px] bg-white/5" />
            <span className="flex items-center gap-1">
              <Cpu className="h-3.5 w-3.5" />
              Judge0 API Connected
            </span>
          </div>

          {/* Social / Info Links */}
          <div className="flex items-center gap-4">
            <Link
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-white transition-colors"
            >
              <GithubIcon className="h-4.5 w-4.5" />
            </Link>
            <Link
              href="/faqs"
              className="flex items-center gap-1 text-xs text-zinc-500 hover:text-white transition-colors"
            >
              <HelpCircle className="h-3.5 w-3.5" />
              Help & FAQs
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="my-6 h-[1px] w-full bg-white/5" />

        <div className="flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-600 gap-2">
          <p>© 2026 NexusCode. Built for premium software engineering practice.</p>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-zinc-400 transition-colors">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-zinc-400 transition-colors">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
