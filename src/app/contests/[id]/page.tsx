"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Trophy, Clock, PlayCircle, Loader2, Users, AlertCircle, CheckCircle2, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Problem {
  id: string;
  title: string;
  slug: string;
  difficulty: string;
  acceptanceRate: number;
}

interface Participant {
  userId: string;
  name: string;
  score: number;
  finishTime: string;
  solvedProblems?: string[];
  rank?: number;
}

interface Contest {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  problemsJson: string;
  standingsJson: string;
}

export default function ContestArenaPage() {
  const { id } = useParams();
  const router = useRouter();

  const [contest, setContest] = useState<Contest | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [standings, setStandings] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"problems" | "standings">("problems");
  const [timeRemaining, setTimeRemaining] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    fetchContestData();
  }, [id]);

  const fetchContestData = async () => {
    try {
      const res = await fetch(`/api/contests/${id}`);
      if (!res.ok) {
        throw new Error("Failed to fetch contest");
      }
      const data = await res.json();
      setContest(data.contest);
      setProblems(data.problems);

      let parsedStandings = [];
      try {
        parsedStandings = JSON.parse(data.contest.standingsJson || "[]");
      } catch (e) {}

      setStandings(parsedStandings);

      // Check if logged in user is registered. For that we would need user id. 
      // But we can just rely on the register button failing/succeeding if we don't have user info on hand.
      // Let's just fetch /api/auth/me to check registration status
      const userRes = await fetch("/api/auth/me");
      if (userRes.ok) {
        const userData = await userRes.json();
        if (userData.user && parsedStandings.some((s: any) => s.userId === userData.user.id)) {
          setIsRegistered(true);
        }
      }

    } catch (e: any) {
      setError(e.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!contest) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const start = new Date(contest.startTime).getTime();
      const end = new Date(contest.endTime).getTime();

      if (now < start) {
        setIsActive(false);
        setTimeRemaining(`Starts in: ${formatTime(start - now)}`);
      } else if (now >= start && now <= end) {
        setIsActive(true);
        setTimeRemaining(`Ends in: ${formatTime(end - now)}`);
      } else {
        setIsActive(false);
        setTimeRemaining("Contest Ended");
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [contest]);

  const formatTime = (ms: number) => {
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    return `${days > 0 ? days + "d " : ""}${hours}h ${minutes}m ${seconds}s`;
  };

  const handleRegister = async () => {
    try {
      const res = await fetch(`/api/contests/${id}/register`, { method: "POST" });
      if (res.ok) {
        setIsRegistered(true);
        fetchContestData(); // Refresh standings
      } else {
        const data = await res.json();
        alert(data.error || "Failed to register");
        if (data.error === "Unauthorized") {
          router.push("/login");
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center text-white">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (error || !contest) {
    return (
      <div className="flex h-[80vh] w-full flex-col items-center justify-center text-white space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <h2 className="text-xl font-bold">Contest Not Found</h2>
        <button onClick={() => router.push("/contests")} className="text-indigo-400 hover:text-indigo-300">
          Return to Contests
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 lg:px-8 py-8 relative z-10 space-y-8">
      {/* Background glow overlay */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] rounded-full bg-indigo-500/10 blur-[150px] pointer-events-none" />

      {/* Breadcrumb */}
      <button 
        onClick={() => router.push("/contests")}
        className="text-xs font-semibold text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" /> Back to Contests
      </button>

      {/* Header */}
      <div className="glass-panel border-indigo-500/30 bg-[#0b0b10] rounded-2xl p-6 md:p-10 text-left flex flex-col md:flex-row items-start md:items-center justify-between gap-8 shadow-[0_0_30px_rgba(99,102,241,0.05)]">
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-1 text-xs text-indigo-400 font-bold uppercase tracking-wider">
            {isActive ? <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-ping" /> : <Clock className="h-3.5 w-3.5" />}
            {isActive ? "Live Now" : "Scheduled Event"}
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
            {contest.title}
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            {contest.description}
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end gap-4 shrink-0 bg-black/20 p-5 rounded-2xl border border-white/5 w-full md:w-auto">
          <div className="text-center md:text-right w-full">
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">Status</p>
            <p className="font-mono text-lg font-bold text-gradient-indigo-cyan">
              {timeRemaining || "Calculating..."}
            </p>
          </div>
          
          {!isRegistered && new Date(contest.endTime) > new Date() && (
            <button 
              onClick={handleRegister}
              className="w-full glow-btn-primary flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-md cursor-pointer"
            >
              <Trophy className="h-4 w-4" />
              Register Now
            </button>
          )}

          {isRegistered && new Date(contest.endTime) > new Date() && (
            <div className="w-full flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold bg-green-500/10 text-green-400 border border-green-500/20">
              <CheckCircle2 className="h-4 w-4" />
              Registered
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-white/10 pb-4">
        <button
          onClick={() => setActiveTab("problems")}
          className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
            activeTab === "problems" ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          Problems
        </button>
        <button
          onClick={() => setActiveTab("standings")}
          className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
            activeTab === "standings" ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          Standings
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {activeTab === "problems" && (
            <motion.div
              key="problems"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              {!isRegistered && new Date(contest.startTime) <= new Date() && new Date(contest.endTime) > new Date() ? (
                <div className="glass-panel p-10 rounded-2xl flex flex-col items-center justify-center text-center border-dashed border-white/10">
                  <AlertCircle className="h-10 w-10 text-zinc-500 mb-4" />
                  <h3 className="text-lg font-bold text-white mb-2">Registration Required</h3>
                  <p className="text-sm text-zinc-400 max-w-md">You must register for this contest to view and solve the problems.</p>
                </div>
              ) : new Date(contest.startTime) > new Date() ? (
                <div className="glass-panel p-10 rounded-2xl flex flex-col items-center justify-center text-center border-dashed border-white/10">
                  <Clock className="h-10 w-10 text-indigo-400 mb-4 animate-pulse" />
                  <h3 className="text-lg font-bold text-white mb-2">Contest Hasn't Started</h3>
                  <p className="text-sm text-zinc-400 max-w-md">Problems will be revealed when the contest officially begins. Stay tuned!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {problems.map((prob, idx) => (
                    <div key={prob.id} className="glass-panel p-5 rounded-xl flex items-center justify-between hover:bg-white/[0.02] transition-colors group">
                      <div className="flex items-center gap-4">
                        <span className="text-lg font-bold text-zinc-500 font-mono w-8">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <div>
                          <h4 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">{prob.title}</h4>
                          <div className="flex items-center gap-3 mt-1 text-[11px] font-semibold">
                            <span className={`px-2 py-0.5 rounded ${
                              prob.difficulty === 'EASY' ? 'bg-green-500/10 text-green-400' :
                              prob.difficulty === 'MEDIUM' ? 'bg-amber-500/10 text-amber-400' :
                              'bg-red-500/10 text-red-400'
                            }`}>
                              {prob.difficulty}
                            </span>
                            <span className="text-zinc-500">Points: 100</span>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => router.push(`/problems/${prob.slug}?contestId=${contest.id}`)}
                        className="p-2.5 rounded-xl bg-white/5 text-zinc-300 hover:bg-indigo-500/20 hover:text-indigo-400 transition-all border border-white/5 cursor-pointer"
                      >
                        <PlayCircle className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                  {problems.length === 0 && (
                    <div className="text-center py-10 text-zinc-500">No problems have been added to this contest yet.</div>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "standings" && (
            <motion.div
              key="standings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="glass-panel rounded-2xl overflow-hidden border border-white/10">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-white/5 border-b border-white/10 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                        <th className="px-6 py-4 w-20 text-center">Rank</th>
                        <th className="px-6 py-4">Participant</th>
                        <th className="px-6 py-4 text-center">Score</th>
                        <th className="px-6 py-4 text-right">Finish Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-zinc-300">
                      {standings.map((st, idx) => (
                        <tr key={st.userId} className="hover:bg-white/2 transition-colors">
                          <td className="px-6 py-4 text-center font-mono font-bold text-zinc-500">
                            {idx === 0 ? <Trophy className="h-4 w-4 mx-auto text-amber-400" /> :
                             idx === 1 ? <Trophy className="h-4 w-4 mx-auto text-zinc-300" /> :
                             idx === 2 ? <Trophy className="h-4 w-4 mx-auto text-amber-700" /> :
                             st.rank || idx + 1}
                          </td>
                          <td className="px-6 py-4 font-bold text-white flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-[10px]">
                              {st.name.charAt(0).toUpperCase()}
                            </div>
                            {st.name}
                          </td>
                          <td className="px-6 py-4 text-center text-cyan-400 font-bold font-mono text-base">{st.score}</td>
                          <td className="px-6 py-4 text-right text-zinc-500 font-mono">{st.finishTime}</td>
                        </tr>
                      ))}
                      {standings.length === 0 && (
                        <tr>
                          <td colSpan={4} className="px-6 py-10 text-center text-zinc-500 font-mono text-xs">
                            No participants have registered yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
