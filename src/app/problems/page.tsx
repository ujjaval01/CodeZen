"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Search, Sparkles, Filter, CheckCircle2, Lock, ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Problem {
  id: string;
  title: string;
  slug: string;
  difficulty: string;
  category: string;
  tagsJson: string;
  acceptanceRate: number;
  premium: boolean;
}

function ProblemsContent() {
  const { user } = useAuth();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [solvedIds, setSolvedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [activeTag, setActiveTag] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const topics = [
    "Arrays", "Strings", "Stack", "Queue", "Linked List",
    "Trees", "Graph", "DP", "Greedy", "Backtracking",
    "Binary Search", "Recursion", "Bit Manipulation"
  ];

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        search,
        difficulty,
        tag: activeTag,
        page: page.toString(),
        limit: "15",
      });

      const res = await fetch(`/api/problems?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setProblems(data.problems);
        setTotalPages(data.pagination.totalPages || 1);
      }
    } catch (e) {
      console.error("Failed to load problems:", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchSolvedStatus = async () => {
    if (!user) return;
    try {
      const res = await fetch("/api/submissions/solved");
      if (res.ok) {
        const data = await res.json();
        setSolvedIds(data.solvedProblemIds || []);
      }
    } catch (e) {
      console.error("Failed to fetch solved problems list:", e);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, [search, difficulty, activeTag, page]);

  useEffect(() => {
    fetchSolvedStatus();
  }, [user]);

  const getDifficultyColor = (diff: string) => {
    switch (diff.toUpperCase()) {
      case "EASY":
        return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
      case "MEDIUM":
        return "text-amber-400 border-amber-500/30 bg-amber-500/10";
      case "HARD":
        return "text-red-400 border-red-500/30 bg-red-500/10";
      default:
        return "text-zinc-400 border-zinc-500/30 bg-zinc-500/10";
    }
  };

  const handleTagClick = (tag: string) => {
    setActiveTag(activeTag === tag ? "" : tag);
    setPage(1);
  };

  return (
    <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-10 relative z-10">
      {/* Background Glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[250px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

      {/* Header Info */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
        <div className="text-left space-y-1.5">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">DSA Practice</h1>
          <p className="text-xs text-zinc-400">
            Solve questions, earn levels, and optimize complexity.
          </p>
        </div>

        {/* Stats Summary Widget */}
        {user && (
          <div className="flex items-center gap-4 rounded-xl border border-white/5 bg-[#0e0e11] px-5 py-3 text-left">
            <div>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Solved Problems</p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-xl font-extrabold text-gradient-indigo-cyan">{solvedIds.length}</span>
                <span className="text-xs text-zinc-500">/ {problems.length || "—"}</span>
              </div>
            </div>
            <div className="h-8 w-[1px] bg-white/10" />
            <div>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Platform XP</p>
              <p className="text-xl font-extrabold text-white mt-0.5">{user.xp}</p>
            </div>
          </div>
        )}
      </div>

      {/* Topic selection row */}
      <div className="flex flex-wrap gap-2 mb-6 text-left">
        <button
          onClick={() => { setActiveTag(""); setPage(1); }}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
            !activeTag
              ? "bg-indigo-500/20 border-indigo-500/60 text-white shadow-[0_0_10px_rgba(99,102,241,0.2)]"
              : "border-white/5 bg-white/5 text-zinc-400 hover:text-white"
          }`}
        >
          All Topics
        </button>
        {topics.map((t) => (
          <button
            key={t}
            onClick={() => handleTagClick(t)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
              activeTag === t
                ? "bg-indigo-500/20 border-indigo-500/60 text-white shadow-[0_0_10px_rgba(99,102,241,0.2)]"
                : "border-white/5 bg-white/5 text-zinc-400 hover:text-white"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Filters & Search Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="sm:col-span-2 relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="h-4 w-4 text-zinc-500" />
          </div>
          <input
            type="text"
            placeholder="Search problems by name or statement..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="glass-input pl-10 w-full rounded-xl py-2.5 text-xs"
          />
        </div>

        <div>
          <select
            value={difficulty}
            onChange={(e) => { setDifficulty(e.target.value); setPage(1); }}
            className="glass-input w-full rounded-xl py-2.5 px-3 text-xs bg-[#09090b] cursor-pointer"
          >
            <option value="">All Difficulties</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5 rounded-xl border border-white/5 bg-[#0e0e11] px-3.5 py-2 text-xs text-indigo-300 shadow-[0_0_10px_rgba(99,102,241,0.05)] justify-center">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Curated DSA Pack</span>
        </div>
      </div>

      {/* Problems List Grid / Table */}
      <div className="glass-panel rounded-2xl overflow-hidden shadow-xl border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02] text-xs font-bold text-zinc-400">
                <th className="px-6 py-3.5 w-12 text-center">Status</th>
                <th className="px-6 py-3.5">Title</th>
                <th className="px-6 py-3.5 w-32">Difficulty</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5 w-24 text-center">Acceptance</th>
                <th className="px-6 py-3.5 w-20 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs">
              <AnimatePresence mode="wait">
                {loading ? (
                  // Skeleton Loading Rows
                  Array.from({ length: 6 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4 text-center">
                        <div className="h-4.5 w-4.5 rounded-full bg-white/5 mx-auto" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 w-40 rounded bg-white/5" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-5 w-20 rounded bg-white/5" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 w-24 rounded bg-white/5" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 w-12 rounded bg-white/5 mx-auto" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-6 w-14 rounded bg-white/5 mx-auto" />
                      </td>
                    </tr>
                  ))
                ) : problems.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                      <p className="text-sm font-semibold">No problems found matching filters.</p>
                      <p className="text-[11px] text-zinc-600 mt-1">Try clearing searches or filtering by another topic tag.</p>
                    </td>
                  </tr>
                ) : (
                  problems.map((prob) => {
                    const tags = JSON.parse(prob.tagsJson || "[]") as string[];
                    const isSolved = solvedIds.includes(prob.id);
                    return (
                      <tr key={prob.id} className="hover:bg-white/[0.01] transition-colors">
                        {/* Status Check */}
                        <td className="px-6 py-4 text-center">
                          {isSolved ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-400 mx-auto fill-emerald-500/10" />
                          ) : (
                            <div className="h-4 w-4 rounded-full border border-white/10 mx-auto bg-white/2" />
                          )}
                        </td>

                        {/* Title & Tags */}
                        <td className="px-6 py-4 text-left">
                          <div className="flex items-center gap-2">
                            {prob.premium ? (
                              <span className="flex items-center gap-1 font-bold text-zinc-300 hover:text-indigo-400 transition-colors">
                                <Lock className="h-3 w-3 text-indigo-400 shrink-0" />
                                {prob.title}
                              </span>
                            ) : (
                              <Link
                                href={`/problems/${prob.slug}`}
                                className="font-semibold text-white hover:text-cyan-400 transition-colors"
                              >
                                {prob.title}
                              </Link>
                            )}

                            {prob.premium && (
                              <span className="bg-indigo-500/10 border border-indigo-500/20 text-[9px] text-indigo-400 font-bold px-1.5 py-0.5 rounded">
                                Premium
                              </span>
                            )}
                          </div>
                          {/* Inner tags list */}
                          <div className="flex gap-1.5 mt-1.5">
                            {tags.map((t) => (
                              <span key={t} className="text-[9px] text-zinc-500 bg-white/2 rounded px-1.5 py-0.2 border border-white/2">
                                {t}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Difficulty */}
                        <td className="px-6 py-4">
                          <span className={`inline-block border px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide ${getDifficultyColor(prob.difficulty)}`}>
                            {prob.difficulty}
                          </span>
                        </td>

                        {/* Category */}
                        <td className="px-6 py-4 text-zinc-400 font-medium">
                          {prob.category}
                        </td>

                        {/* Acceptance Rate */}
                        <td className="px-6 py-4 text-center text-zinc-300 font-semibold">
                          {prob.acceptanceRate.toFixed(1)}%
                        </td>

                        {/* Action Link */}
                        <td className="px-6 py-4 text-center">
                          {prob.premium ? (
                            <Link
                              href="/signup?plan=pro"
                              className="inline-flex items-center justify-center rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-2.5 py-1 text-[10px] font-bold text-indigo-300 hover:bg-indigo-500/20 transition-all cursor-pointer"
                            >
                              Unlock
                            </Link>
                          ) : (
                            <Link
                              href={`/problems/${prob.slug}`}
                              className="inline-flex items-center justify-center rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold text-zinc-300 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
                            >
                              Solve
                            </Link>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {/* Pagination Toolbar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 bg-white/[0.02] border-t border-white/5">
            <button
              onClick={() => setPage(Math.max(page - 1, 1))}
              disabled={page === 1}
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white disabled:opacity-30 transition-colors cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </button>
            <span className="text-xs text-zinc-500">
              Page <span className="text-zinc-300 font-bold">{page}</span> of <span className="text-zinc-300 font-bold">{totalPages}</span>
            </span>
            <button
              onClick={() => setPage(Math.min(page + 1, totalPages))}
              disabled={page === totalPages}
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white disabled:opacity-30 transition-colors cursor-pointer"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProblemsPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[50vh] items-center justify-center text-white">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    }>
      <ProblemsContent />
    </Suspense>
  );
}
