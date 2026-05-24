"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { 
  Settings, User, Palette, CheckCircle2, AlertTriangle, Loader2, Save, Sparkles, Monitor
} from "lucide-react";
import { motion } from "framer-motion";

function SettingsContent() {
  const { user, loading: authLoading, refreshUser } = useAuth();
  const router = useRouter();

  // Profile states
  const [name, setName] = useState("");
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Editor states
  const [theme, setTheme] = useState("vs-dark");
  const [themeSaving, setThemeSaving] = useState(false);
  const [themeSuccess, setThemeSuccess] = useState(false);

  // Load preferences
  useEffect(() => {
    if (!authLoading && user) {
      setName(user.name);
    }
    
    // Load Monaco theme from local storage
    if (typeof window !== "undefined") {
      const storedTheme = localStorage.getItem("monaco-theme");
      if (storedTheme) {
        setTheme(storedTheme);
      }
    }
  }, [user, authLoading]);

  // Handle profile save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setProfileSaving(true);
    setProfileMessage(null);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();
      if (res.ok) {
        setProfileMessage({ type: "success", text: "Display name updated successfully!" });
        await refreshUser();
      } else {
        setProfileMessage({ type: "error", text: data.error || "Failed to update profile." });
      }
    } catch (err) {
      setProfileMessage({ type: "error", text: "A network error occurred. Please try again." });
    } finally {
      setProfileSaving(false);
    }
  };

  // Handle theme change
  const handleSaveTheme = (selectedTheme: string) => {
    setTheme(selectedTheme);
    setThemeSaving(true);
    setThemeSuccess(false);

    setTimeout(() => {
      if (typeof window !== "undefined") {
        localStorage.setItem("monaco-theme", selectedTheme);
      }
      setThemeSaving(false);
      setThemeSuccess(true);
      setTimeout(() => setThemeSuccess(false), 2000);
    }, 400);
  };

  if (authLoading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center text-white">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl w-full px-4 sm:px-6 lg:px-8 py-10 relative z-10 space-y-8 text-left">
      {/* Background radial glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="space-y-1 border-b border-white/5 pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2.5">
          <Settings className="h-8 w-8 text-indigo-500 animate-spin-slow" />
          Account & Editor Settings
        </h1>
        <p className="text-xs text-zinc-500">Configure your public coding profile preferences and customise the Monaco compiler interface.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Navigation Sidebar (Aesthetic) */}
        <div className="space-y-2 md:col-span-1">
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-xs font-bold uppercase tracking-wider">
            <Monitor className="h-4 w-4" />
            General Preferences
          </div>
          <div className="px-3 py-2 text-zinc-500 text-[11px] leading-relaxed">
            Settings here are applied instantly to your local session and synchronized with your developer profile.
          </div>
        </div>

        {/* Configurations Dashboard */}
        <div className="space-y-8 md:col-span-2">
          
          {/* Card 1: Profile Display settings */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-3">
              <User className="h-4 w-4 text-cyan-400" />
              Public Profile Details
            </h3>

            {user ? (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                {profileMessage && (
                  <div className={`flex items-center gap-2 rounded-xl border p-3.5 text-xs ${
                    profileMessage.type === "success" 
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                      : "border-red-500/30 bg-red-500/10 text-red-400"
                  }`}>
                    {profileMessage.type === "success" ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                    )}
                    <span>{profileMessage.text}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Registered Email</label>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="glass-input w-full rounded-xl py-2.5 px-3 bg-zinc-950/40 text-zinc-500 cursor-not-allowed text-xs font-mono"
                  />
                  <p className="text-[10px] text-zinc-600">Your email address cannot be changed and is associated with your rank statistics.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Display Name</label>
                  <input
                    type="text"
                    required
                    maxLength={50}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your public username..."
                    className="glass-input w-full rounded-xl py-2.5 px-3 text-xs"
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={profileSaving || name.trim() === user.name}
                    className="glow-btn-primary flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-xs font-bold text-white shadow-md disabled:opacity-40 cursor-pointer"
                  >
                    {profileSaving ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Save className="h-3.5 w-3.5" />
                    )}
                    Save Profile Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-center border border-dashed border-white/5 rounded-xl bg-white/[0.01] space-y-3">
                <AlertTriangle className="h-8 w-8 text-amber-500/80" />
                <div className="text-xs text-zinc-400">
                  <p className="font-semibold text-white">Sign In Required</p>
                  <p className="mt-0.5 text-zinc-500">You must be signed in to modify your developer display credentials.</p>
                </div>
                <button
                  onClick={() => router.push("/login")}
                  className="glow-btn-primary rounded-lg px-4 py-1.5 text-[11px] font-bold text-white shadow-md cursor-pointer"
                >
                  Log In
                </button>
              </div>
            )}
          </div>

          {/* Card 2: Monaco Editor Theme settings */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/5 pb-3">
              <Palette className="h-4 w-4 text-indigo-400" />
              Monaco Compiler Theme
            </h3>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-400">Select IDE Editor Theme:</span>
                <div className="flex items-center gap-1 text-[10px] font-bold uppercase">
                  {themeSaving && (
                    <span className="text-indigo-400 flex items-center gap-1">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving...
                    </span>
                  )}
                  {themeSuccess && (
                    <span className="text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Saved Preference
                    </span>
                  )}
                </div>
              </div>

              {/* Theme selection buttons grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Theme 1 */}
                <button
                  onClick={() => handleSaveTheme("vs-dark")}
                  className={`flex flex-col text-left p-4 rounded-xl border transition-all cursor-pointer ${
                    theme === "vs-dark"
                      ? "bg-indigo-500/5 border-indigo-500/60 text-white"
                      : "border-white/5 bg-zinc-950/40 text-zinc-400 hover:border-white/10 hover:text-zinc-200"
                  }`}
                >
                  <span className="text-xs font-bold">Dark Theme</span>
                  <span className="text-[10px] text-zinc-500 mt-1">Monaco vs-dark. Low light coding comfort.</span>
                </button>

                {/* Theme 2 */}
                <button
                  onClick={() => handleSaveTheme("vs")}
                  className={`flex flex-col text-left p-4 rounded-xl border transition-all cursor-pointer ${
                    theme === "vs"
                      ? "bg-indigo-500/5 border-indigo-500/60 text-white"
                      : "border-white/5 bg-zinc-950/40 text-zinc-400 hover:border-white/10 hover:text-zinc-200"
                  }`}
                >
                  <span className="text-xs font-bold">Light Theme</span>
                  <span className="text-[10px] text-zinc-500 mt-1">Monaco vs-light. Bright, high legibility.</span>
                </button>

                {/* Theme 3 */}
                <button
                  onClick={() => handleSaveTheme("hc-black")}
                  className={`flex flex-col text-left p-4 rounded-xl border transition-all cursor-pointer ${
                    theme === "hc-black"
                      ? "bg-indigo-500/5 border-indigo-500/60 text-white"
                      : "border-white/5 bg-zinc-950/40 text-zinc-400 hover:border-white/10 hover:text-zinc-200"
                  }`}
                >
                  <span className="text-xs font-bold">High Contrast</span>
                  <span className="text-[10px] text-zinc-500 mt-1">High Contrast Black. Accessibility focus.</span>
                </button>
              </div>

              <div className="h-[1px] bg-white/5 my-2" />
              <div className="flex items-center gap-2 rounded-xl bg-white/[0.01] border border-white/5 p-3.5 text-[10px] text-zinc-500 leading-normal">
                <Sparkles className="h-4 w-4 text-cyan-400 shrink-0" />
                <span>Selected themes will load automatically whenever you open any challenge workspace. Live themes will not affect system performance.</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-[#09090b] text-white">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    }>
      <SettingsContent />
    </Suspense>
  );
}
