"use client";

import React, { useEffect, useState, Suspense } from "react";
import { Trophy, Calendar, Clock, Award, ArrowRight, Loader2, PlayCircle, Users, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface Contest {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  problemsJson: string;
  standingsJson: string;
}

function ContestsContent() {
  const router = useRouter();
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeStandings, setActiveStandings] = useState<string | null>(null);

  // Time calculations state for active count
  const [timeRemaining, setTimeRemaining] = useState("");

  const fetchContests = async () => {
    try {
      const res = await fetch("/api/contests");
      if (res.ok) {
        const data = await res.json();
        setContests(data.contests || []);
      }
    } catch (e) {
      console.error("Failed to load contests:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContests();
  }, []);

  // Update countdown clock every second
  useEffect(() => {
    if (contests.length === 0) return;

    // Find the next upcoming/active contest
    const upcoming = contests.find(c => new Date(c.endTime) > new Date());
    if (!upcoming) {
      setTimeRemaining("No active events");
      return;
    }

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const start = new Date(upcoming.startTime).getTime();
      const end = new Date(upcoming.endTime).getTime();

      let targetTime = start;
      let label = "Starts in: ";

      if (now > start && now < end) {
        targetTime = end;
        label = "Ends in: ";
      }

      const diff = targetTime - now;

      if (diff <= 0) {
        setTimeRemaining("Event concluded");
        clearInterval(timer);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemaining(`${label} ${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, [contests]);

  if (loading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center text-white">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
      </div>
    );
  }

  const now = new Date();
  const upcomingContests = contests.filter(c => new Date(c.endTime) > now);
  const pastContests = contests.filter(c => new Date(c.endTime) <= now);

  return (
    <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-10 relative z-10 space-y-12">
      {/* Background glow overlay */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[500px] h-[250px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2">
          <Award className="h-8 w-8 text-cyan-400" />
          Weekly Rated Contests
        </h1>
        <p className="text-xs text-zinc-500 max-w-md mx-auto">
          Test your logic limits against other developers globally. Climb rating tiers and win profile icons.
        </p>
      </div>

      {/* Live Active Countdown Banner */}
      {upcomingContests.length > 0 && (
        <div className="glass-panel border-indigo-500/30 bg-[#0b0b10] rounded-2xl p-6 text-left flex flex-col md:flex-row items-center justify-between gap-6 shadow-[0_0_20px_rgba(99,102,241,0.08)]">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 px-3.5 py-0.5 text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
              Event Countdown
            </div>
            <h2 className="text-lg font-bold text-white">{upcomingContests[0].title}</h2>
            <p className="text-xs text-zinc-400 max-w-xl">{upcomingContests[0].description}</p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-3 shrink-0">
            <span className="font-mono text-sm sm:text-base font-bold text-gradient-indigo-cyan border border-white/5 bg-white/2 rounded-xl px-4 py-2">
              {timeRemaining}
            </span>
            <button 
              onClick={() => router.push(`/contests/${upcomingContests[0].id}`)}
              className="glow-btn-primary flex items-center justify-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-md cursor-pointer"
            >
              Enter Event Arena
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Grid: Upcoming Lists + Rating tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
        {/* Scheduled/Upcoming List */}
        <div className="glass-panel p-6 rounded-2xl space-y-4 md:col-span-2">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-3">
            <Calendar className="h-4.5 w-4.5 text-cyan-400" />
            Scheduled Contests
          </h3>

          <div className="space-y-4">
            {upcomingContests.map((c) => {
              const start = new Date(c.startTime);
              const end = new Date(c.endTime);
              const durationHours = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60));

              return (
                <div key={c.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center rounded-xl border border-white/5 bg-white/[0.01] p-4 gap-4">
                  <div className="space-y-1.5">
                    <h4 className="text-sm font-bold text-white">{c.title}</h4>
                    <div className="flex flex-wrap gap-4 text-[10px] text-zinc-500 font-semibold">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> {start.toLocaleString()}
                      </span>
                      <span>Length: {durationHours} hours</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => router.push(`/contests/${c.id}`)}
                    className="rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 hover:text-white px-3.5 py-1.5 text-xs font-semibold text-zinc-300 transition-all cursor-pointer"
                  >
                    Enter Arena
                  </button>
                </div>
              );
            })}
            {upcomingContests.length === 0 && (
              <p className="text-xs text-zinc-500 font-mono py-4">No upcoming scheduled contests found.</p>
            )}
          </div>
        </div>

        {/* Rating Guide Panel */}
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-3">
            <Trophy className="h-4.5 w-4.5 text-amber-400" />
            Contest Ratings
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Rated contests use the Elo algorithm to rank developers. Participating in rated clashing shifts your rating score:
          </p>
          <ul className="space-y-2 text-[10px] font-mono leading-relaxed">
            <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-cyan-400" /> 1500+ XP: Silver Rank</li>
            <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-amber-400" /> 3000+ XP: Gold Rank</li>
            <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-indigo-500" /> 5000+ XP: Platinum Rank</li>
            <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-pink-500 animate-pulse" /> 8000+ XP: Diamond Apex</li>
          </ul>
        </div>
      </div>

      {/* Past Contests Standings */}
      <div className="glass-panel p-6 rounded-2xl text-left space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-3">
          <Users className="h-4.5 w-4.5 text-cyan-400" />
          Past Contests Standings
        </h3>

        <div className="space-y-4">
          {pastContests.map((c) => {
            const standings = JSON.parse(c.standingsJson || "[]") as any[];
            const isStandingsOpen = activeStandings === c.id;

            return (
              <div key={c.id} className="rounded-xl border border-white/5 bg-white/[0.01] overflow-hidden">
                <div
                  onClick={() => setActiveStandings(isStandingsOpen ? null : c.id)}
                  className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 gap-4 hover:bg-white/[0.02] transition-colors cursor-pointer select-none"
                >
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-white">{c.title}</h4>
                    <p className="text-[10px] text-zinc-500 font-semibold flex items-center gap-1.5">
                      Concluded: {new Date(c.endTime).toLocaleDateString()} • {standings.length} Competitors listed
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-1 shrink-0">
                    {isStandingsOpen ? "Hide Standings" : "View Standings"}
                    <ChevronRight className={`h-4 w-4 transition-transform ${isStandingsOpen ? "transform rotate-90" : ""}`} />
                  </span>
                </div>

                {isStandingsOpen && (
                  <div className="border-t border-white/5 bg-black/20 p-4">
                    <table className="w-full text-left border-collapse text-[11px]">
                      <thead>
                        <tr className="border-b border-white/5 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                          <th className="px-4 py-2 w-16 text-center">Rank</th>
                          <th className="px-4 py-2">Coder</th>
                          <th className="px-4 py-2 text-center">Score</th>
                          <th className="px-4 py-2 text-right">Finish Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5 text-zinc-300 font-mono">
                        {standings.map((st, idx) => (
                          <tr key={st.rank || st.userId || idx} className="hover:bg-white/2">
                            <td className="px-4 py-2 text-center font-bold text-zinc-400">{st.rank || idx + 1}</td>
                            <td className="px-4 py-2 font-sans font-semibold text-white">{st.name}</td>
                            <td className="px-4 py-2 text-center text-cyan-400 font-bold">{st.score}</td>
                            <td className="px-4 py-2 text-right text-zinc-500">{st.finishTime || st.time}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
          {pastContests.length === 0 && (
            <p className="text-xs text-zinc-500 font-mono py-4">No past contests available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ContestsPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-[#09090b] text-white">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    }>
      <ContestsContent />
    </Suspense>
  );
}
