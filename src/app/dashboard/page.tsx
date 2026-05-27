"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  Award, Flame, Trophy, CheckCircle2, XCircle, Code, Calendar, ChevronRight,
  TrendingUp, Sparkles, Loader2, Zap, Brain, ShieldAlert
} from "lucide-react";
import { motion } from "framer-motion";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

interface DashboardData {
  user: {
    name: string;
    email: string;
    xp: number;
    level: number;
    streak: number;
    createdAt: string;
  };
  stats: {
    solved: {
      total: number;
      easy: number;
      medium: number;
      hard: number;
      totalEasy: number;
      totalMedium: number;
      totalHard: number;
    };
    languageStats: Array<{ name: string; value: number }>;
    heatmap: Record<string, number>;
  };
  recentSubmissions: Array<{
    id: string;
    problemTitle: string;
    problemSlug: string;
    difficulty: string;
    status: string;
    language: string;
    executionTime: number;
    memoryUsage: number;
    createdAt: string;
  }>;
  badges: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    isUnlocked: boolean;
  }>;
}

function DashboardContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const getRankInfo = (xp: number) => {
    if (xp >= 8000) return { name: "Diamond Apex", color: "from-cyan-500 to-sky-400", nextLimit: 15000, desc: "Master algorithm engineer" };
    if (xp >= 5000) return { name: "Platinum Core", color: "from-indigo-600 to-indigo-400", nextLimit: 8000, desc: "Elite algorithmic competitor" };
    if (xp >= 3000) return { name: "Gold Mastery", color: "from-yellow-500 to-amber-400", nextLimit: 5000, desc: "Highly skilled problem solver" };
    if (xp >= 1500) return { name: "Silver Ascent", color: "from-slate-400 to-slate-200", nextLimit: 3000, desc: "Intermediate programmer" };
    return { name: "Bronze Range", color: "from-amber-800 to-amber-600", nextLimit: 1500, desc: "Beginner developer journey" };
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/user/dashboard");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      } else {
        router.push("/login");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchDashboardData();
    }
  }, [user, authLoading]);

  if (loading || authLoading || !data || !mounted) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center text-white">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
      </div>
    );
  }

  const { stats, recentSubmissions, badges } = data;
  const rank = getRankInfo(data.user.xp);
  const currentXpProgress = data.user.xp % 500;
  const xpPercentage = (currentXpProgress / 500) * 100;

  // Pie Chart Colors
  const COLORS = ["#818cf8", "#22d3ee", "#c084fc", "#f472b6", "#fbbf24", "#34d399"];

  // Heatmap generation
  const generateHeatmapGrid = () => {
    const today = new Date();
    const cells = [];
    // Plot 53 weeks (371 days) back
    const totalDays = 371;
    const startDate = new Date();
    startDate.setDate(today.getDate() - totalDays + 1);

    for (let i = 0; i < totalDays; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      const dateStr = currentDate.toISOString().split("T")[0];
      const count = stats.heatmap[dateStr] || 0;
      cells.push({ date: dateStr, count });
    }
    return cells;
  };

  const heatmapCells = generateHeatmapGrid();

  const getHeatmapColor = (count: number) => {
    if (count === 0) return "bg-zinc-900 border-zinc-950";
    if (count <= 2) return "bg-indigo-950 border-indigo-900/30 text-indigo-400";
    if (count <= 4) return "bg-indigo-700 border-indigo-600/30 text-indigo-100";
    return "bg-cyan-500 border-cyan-400/30 text-cyan-950";
  };

  return (
    <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-10 relative z-10 space-y-8">
      {/* Background glow overlay */}
      <div className="absolute top-20 right-10 w-[400px] h-[400px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-left">
        <div className="space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Welcome, {data.user.name}
          </h1>
          <p className="text-xs text-zinc-500">
            Account created on {new Date(data.user.createdAt).toLocaleDateString()} • Sandbox isolated env ready
          </p>
        </div>

        {/* Level indicator */}
        <div className="flex items-center gap-3 bg-white/5 border border-white/5 rounded-2xl px-5 py-3 text-left">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 p-0.5 shadow-[0_0_15px_-3px_rgba(99,102,241,0.3)]">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#09090b] text-base font-extrabold text-cyan-400">
              {data.user.level}
            </div>
          </div>
          <div>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Active Level</p>
            <p className="text-xs text-zinc-300 font-semibold">{rank.name}</p>
          </div>
        </div>
      </div>

      {/* Grid: Solved Counts + Rank Progress + Language Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Solve Counts Panel */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between text-left space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400" />
              Category solved
            </h3>
            <span className="text-xs font-extrabold text-zinc-400">
              {stats.solved.total} <span className="font-semibold text-zinc-600">Total</span>
            </span>
          </div>

          <div className="space-y-3">
            {/* Easy Solved */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-emerald-400">Easy</span>
                <span className="text-zinc-400">{stats.solved.easy} <span className="text-zinc-600">/ {stats.solved.totalEasy}</span></span>
              </div>
              <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${(stats.solved.easy / (stats.solved.totalEasy || 1)) * 100}%` }}
                />
              </div>
            </div>

            {/* Medium Solved */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-amber-400">Medium</span>
                <span className="text-zinc-400">{stats.solved.medium} <span className="text-zinc-600">/ {stats.solved.totalMedium}</span></span>
              </div>
              <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${(stats.solved.medium / (stats.solved.totalMedium || 1)) * 100}%` }}
                />
              </div>
            </div>

            {/* Hard Solved */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] font-bold">
                <span className="text-red-400">Hard</span>
                <span className="text-zinc-400">{stats.solved.hard} <span className="text-zinc-600">/ {stats.solved.totalHard}</span></span>
              </div>
              <div className="h-1.5 w-full bg-zinc-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 rounded-full"
                  style={{ width: `${(stats.solved.hard / (stats.solved.totalHard || 1)) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Level Progress Panel */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between text-left space-y-4">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="h-4.5 w-4.5 text-cyan-400 fill-cyan-400/10" />
              XP Level Up
            </h3>
            <div className="flex items-center gap-1 text-[11px] text-amber-500 font-bold">
              <Flame className="h-4 w-4 fill-amber-500" />
              <span>{data.user.streak} Days Streak</span>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs text-zinc-400">{rank.desc}</p>
              <div className="flex justify-between text-[11px] font-bold mt-2">
                <span className="text-zinc-400">Level {data.user.level}</span>
                <span className="text-zinc-500">{currentXpProgress} / 500 XP to Level {data.user.level + 1}</span>
              </div>
            </div>
            {/* XP progress bar */}
            <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden p-[1px]">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                style={{ width: `${xpPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-[9px] text-zinc-500 font-bold uppercase tracking-wider">
              <span>Total XP: {data.user.xp}</span>
              <span>Next Rank: {rank.nextLimit} XP</span>
            </div>
          </div>
        </div>

        {/* Language stats Pie chart */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between text-left space-y-4 relative">
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Code className="h-4.5 w-4.5 text-indigo-400" />
              Language Mix
            </h3>
          </div>

          <div className="flex items-center justify-between h-[120px] w-full">
            {stats.languageStats.length === 0 ? (
              <div className="text-zinc-600 text-xs flex-1 text-center font-mono">No compiler submissions logged yet.</div>
            ) : (
              <>
                {/* Recharts container */}
                <div className="w-[120px] h-[120px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.languageStats}
                        cx="50%"
                        cy="50%"
                        innerRadius={25}
                        outerRadius={45}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {stats.languageStats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#09090b",
                          borderColor: "rgba(255,255,255,0.08)",
                          color: "#fff",
                          fontSize: "10px",
                          fontFamily: "monospace",
                          borderRadius: "8px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                {/* Chart Legends */}
                <div className="flex-1 pl-4 space-y-1.5 overflow-y-auto max-h-[110px]">
                  {stats.languageStats.map((item, idx) => (
                    <div key={item.name} className="flex items-center justify-between text-[10px] font-mono">
                      <div className="flex items-center gap-1.5 text-zinc-400 font-semibold">
                        <span className="h-2 w-2 rounded-full inline-block" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                        {item.name}
                      </div>
                      <span className="text-zinc-500 font-bold">{item.value} submissions</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* HEATMAP CALENDAR SECTION */}
      <div className="glass-panel p-6 rounded-2xl text-left space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-3">
          <Calendar className="h-4.5 w-4.5 text-cyan-400" />
          Submission calendar contributions
        </h3>

        {/* Heatmap Grid container */}
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-[3px] min-w-[700px] select-none h-[88px] relative">
            {/* Draw cells */}
            <div className="grid grid-flow-col grid-rows-7 gap-[3px] w-full">
              {heatmapCells.map((cell, idx) => (
                <div
                  key={idx}
                  className={`h-[9px] w-[9px] rounded-sm border-[0.5px] transition-all hover:scale-110 cursor-pointer ${getHeatmapColor(cell.count)}`}
                  title={`${cell.count} submissions on ${new Date(cell.date).toLocaleDateString()}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center text-[10px] text-zinc-500 font-semibold select-none pt-1">
          <span>{heatmapCells.length > 0 ? new Date(heatmapCells[0].date).toLocaleDateString(undefined, { month: "short", year: "numeric" }) : ""} — Present</span>
          <div className="flex items-center gap-1.5">
            <span>Less</span>
            <div className="h-2.5 w-2.5 rounded-sm bg-zinc-900 border border-zinc-950" />
            <div className="h-2.5 w-2.5 rounded-sm bg-indigo-950 border border-indigo-900/30" />
            <div className="h-2.5 w-2.5 rounded-sm bg-indigo-700 border border-indigo-600/30" />
            <div className="h-2.5 w-2.5 rounded-sm bg-cyan-500 border border-cyan-400/30" />
            <span>More</span>
          </div>
        </div>
      </div>

      {/* Grid: Badges + Recent Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Unlocked Badges */}
        <div className="glass-panel p-6 rounded-2xl text-left space-y-4 lg:col-span-1">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-3">
            <Award className="h-4.5 w-4.5 text-pink-400" />
            Achievement Badges
          </h3>

          <div className="grid grid-cols-1 gap-3 overflow-y-auto max-h-[300px]">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`flex items-center gap-3 rounded-xl border p-3 transition-colors ${
                  badge.isUnlocked
                    ? "bg-gradient-to-r from-pink-500/5 to-indigo-500/5 border-white/10"
                    : "bg-black/20 border-white/2 opacity-40"
                }`}
              >
                {/* Badge Icon */}
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border p-1 shadow-sm ${
                  badge.isUnlocked
                    ? "bg-indigo-500/10 border-indigo-500/30 text-indigo-400"
                    : "bg-zinc-800 border-zinc-700 text-zinc-500"
                }`}>
                  <Brain className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    {badge.name}
                    {!badge.isUnlocked && (
                      <span className="text-[8px] bg-zinc-800 border border-zinc-700 text-zinc-500 font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider">
                        Locked
                      </span>
                    )}
                  </h4>
                  <p className="text-[10px] text-zinc-400 mt-0.5">{badge.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Submissions */}
        <div className="glass-panel p-6 rounded-2xl text-left space-y-4 lg:col-span-2">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-white/5 pb-3">
            <Trophy className="h-4.5 w-4.5 text-amber-500" />
            Recent submissions history
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02] text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                  <th className="px-4 py-2">Problem</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Lang</th>
                  <th className="px-4 py-2 text-center">Runtime</th>
                  <th className="px-4 py-2">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-[11px]">
                {recentSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-zinc-600 font-mono">
                      No code compiler executions saved yet.
                    </td>
                  </tr>
                ) : (
                  recentSubmissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-white/[0.01]">
                      {/* Title */}
                      <td className="px-4 py-3 font-semibold text-white">
                        <Link href={`/problems/${sub.problemSlug}`} className="hover:text-cyan-400 transition-colors">
                          {sub.problemTitle}
                        </Link>
                      </td>
                      {/* Status */}
                      <td className="px-4 py-3">
                        <span className={`font-bold flex items-center gap-1 text-[10px] ${
                          sub.status === "ACCEPTED" ? "text-emerald-400" : "text-red-400"
                        }`}>
                          {sub.status === "ACCEPTED" ? (
                            <CheckCircle2 className="h-3.5 w-3.5 fill-emerald-500/10" />
                          ) : (
                            <XCircle className="h-3.5 w-3.5 fill-red-500/10" />
                          )}
                          {sub.status}
                        </span>
                      </td>
                      {/* Language */}
                      <td className="px-4 py-3 font-mono text-zinc-500 text-[10px]">
                        {sub.language}
                      </td>
                      {/* Runtime */}
                      <td className="px-4 py-3 text-center font-mono text-zinc-400">
                        {sub.executionTime} ms
                      </td>
                      {/* Date */}
                      <td className="px-4 py-3 text-zinc-500 text-[10px]">
                        {new Date(sub.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

import { redirect } from "next/navigation";

export default function DashboardPage() {
  redirect("/");
}
