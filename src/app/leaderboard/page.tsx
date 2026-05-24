"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { Trophy, Flame, Award, Loader2, Sparkles, Medal } from "lucide-react";
import { motion } from "framer-motion";

interface LeaderboardUser {
  rank: number;
  id: string;
  name: string;
  role: string;
  xp: number;
  level: number;
  streak: number;
  solvedCount: number;
}

function LeaderboardContent() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch("/api/leaderboard");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.leaderboard || []);
      }
    } catch (e) {
      console.error("Failed to load leaderboard:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const getRankTier = (xp: number) => {
    if (xp >= 8000) return { name: "Diamond", style: "text-cyan-400 border-cyan-500/30 bg-cyan-500/5" };
    if (xp >= 5000) return { name: "Platinum", style: "text-indigo-400 border-indigo-500/30 bg-indigo-500/5" };
    if (xp >= 3000) return { name: "Gold", style: "text-amber-400 border-amber-500/30 bg-amber-500/5" };
    if (xp >= 1500) return { name: "Silver", style: "text-slate-400 border-slate-500/30 bg-slate-500/5" };
    return { name: "Bronze", style: "text-amber-700 border-amber-800/30 bg-amber-800/5" };
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center text-white">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
      </div>
    );
  }

  const top3 = users.slice(0, 3);
  const others = users.slice(3);

  return (
    <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-10 relative z-10 space-y-12">
      {/* Background neon glow */}
      <div className="absolute top-10 left-1/4 -translate-x-1/2 w-[400px] h-[300px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-40 right-1/4 translate-x-1/2 w-[400px] h-[300px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header title */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2">
          <Trophy className="h-8 w-8 text-amber-400 animate-bounce" />
          Global Leaderboard
        </h1>
        <p className="text-xs text-zinc-500 max-w-md mx-auto">
          Rankings are calculated dynamically based on total solved questions, streaks, and XP points.
        </p>
      </div>

      {/* Top 3 Podium Highlights */}
      {top3.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-6 items-end select-none">
          {/* Rank 2 Podium */}
          {top3[1] && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-panel p-6 rounded-2xl border-white/5 bg-[#0a0a0d]/60 text-center flex flex-col items-center space-y-4 md:order-1 order-2 h-[260px] justify-between relative"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-slate-400 rounded-t-2xl" />
              <div className="space-y-1.5 flex flex-col items-center">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-500/10 border border-slate-500/30 text-slate-400 shadow-lg">
                  <Medal className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-bold text-white mt-2 truncate max-w-[150px]">{top3[1].name}</h3>
                <p className="text-[10px] text-zinc-500 font-mono">Level {top3[1].level} • {getRankTier(top3[1].xp).name}</p>
              </div>

              <div className="space-y-1">
                <div className="text-xl font-extrabold text-slate-400 font-mono">{top3[1].xp} XP</div>
                <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{top3[1].solvedCount} solved</div>
              </div>
              <div className="text-xs font-bold text-zinc-400 bg-white/5 border border-white/5 rounded-full px-3 py-0.5">Rank 2</div>
            </motion.div>
          )}

          {/* Rank 1 Podium - Promoted */}
          {top3[0] && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-6 rounded-2xl border-indigo-500/30 bg-[#0c0c11]/80 text-center flex flex-col items-center space-y-4 md:order-2 order-1 h-[290px] justify-between relative shadow-[0_0_35px_rgba(99,102,241,0.15)] scale-105"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-t-2xl" />
              <div className="absolute top-0 right-6 -translate-y-1/2 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 px-3 py-0.5 text-[9px] font-bold text-black uppercase tracking-wider">
                Platform Leader
              </div>
              <div className="space-y-1.5 flex flex-col items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-xl animate-pulse">
                  <Trophy className="h-6 w-6" />
                </div>
                <h3 className="text-base font-extrabold text-white mt-2 truncate max-w-[180px]">{top3[0].name}</h3>
                <p className="text-[10px] text-zinc-400 font-mono">Level {top3[0].level} • {getRankTier(top3[0].xp).name}</p>
              </div>

              <div className="space-y-1">
                <div className="text-2xl font-extrabold text-gradient-indigo-cyan font-mono">{top3[0].xp} XP</div>
                <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">{top3[0].solvedCount} solved</div>
              </div>
              <div className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-0.5">Rank 1</div>
            </motion.div>
          )}

          {/* Rank 3 Podium */}
          {top3[2] && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-panel p-6 rounded-2xl border-white/5 bg-[#0a0a0d]/60 text-center flex flex-col items-center space-y-4 md:order-3 order-3 h-[240px] justify-between relative"
            >
              <div className="absolute top-0 inset-x-0 h-1 bg-amber-800 rounded-t-2xl" />
              <div className="space-y-1.5 flex flex-col items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-700/10 border border-amber-700/30 text-amber-600 shadow-lg">
                  <Award className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-white mt-2 truncate max-w-[150px]">{top3[2].name}</h3>
                <p className="text-[10px] text-zinc-500 font-mono">Level {top3[2].level} • {getRankTier(top3[2].xp).name}</p>
              </div>

              <div className="space-y-1">
                <div className="text-lg font-extrabold text-amber-600 font-mono">{top3[2].xp} XP</div>
                <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{top3[2].solvedCount} solved</div>
              </div>
              <div className="text-xs font-bold text-zinc-400 bg-white/5 border border-white/5 rounded-full px-3 py-0.5">Rank 3</div>
            </motion.div>
          )}
        </div>
      )}

      {/* Ranks list table */}
      <div className="glass-panel rounded-2xl overflow-hidden shadow-xl border-white/10 max-w-5xl mx-auto">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02] text-xs font-bold text-zinc-400">
                <th className="px-6 py-3.5 w-16 text-center">Rank</th>
                <th className="px-6 py-3.5">User</th>
                <th className="px-6 py-3.5 w-24 text-center">Level</th>
                <th className="px-6 py-3.5 w-28 text-center">Daily Streak</th>
                <th className="px-6 py-3.5 w-28 text-center">Solved Count</th>
                <th className="px-6 py-3.5 w-32">Rank Tier</th>
                <th className="px-6 py-3.5 w-28 text-right">Total XP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              {others.map((u) => (
                <tr key={u.id} className="hover:bg-white/[0.01] transition-colors">
                  {/* Rank */}
                  <td className="px-6 py-4 text-center font-bold text-zinc-400">
                    {u.rank}
                  </td>
                  {/* User Name */}
                  <td className="px-6 py-4 font-semibold text-white">
                    {u.name}
                  </td>
                  {/* Level */}
                  <td className="px-6 py-4 text-center text-zinc-300 font-semibold">
                    {u.level}
                  </td>
                  {/* Streak */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-amber-500 font-bold">
                      <Flame className="h-3.5 w-3.5 fill-amber-500" />
                      <span>{u.streak}</span>
                    </div>
                  </td>
                  {/* Solved Count */}
                  <td className="px-6 py-4 text-center text-zinc-300 font-semibold">
                    {u.solvedCount}
                  </td>
                  {/* Rank Tier */}
                  <td className="px-6 py-4">
                    <span className={`inline-block border px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${getRankTier(u.xp).style}`}>
                      {getRankTier(u.xp).name}
                    </span>
                  </td>
                  {/* Total XP */}
                  <td className="px-6 py-4 text-right font-extrabold text-gradient-indigo-cyan font-mono">
                    {u.xp} XP
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-zinc-500">
                    No competitors logged.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function LeaderboardPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-[#09090b] text-white">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    }>
      <LeaderboardContent />
    </Suspense>
  );
}
