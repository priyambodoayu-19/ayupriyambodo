"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, ArrowRight, ArrowLeft, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.error || "Incorrect PIN code");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#141413] flex flex-col justify-between p-6 sm:p-12">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#8A8881] hover:text-[#141413] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Portfolio</span>
        </Link>
      </div>

      <div className="max-w-md w-full mx-auto space-y-8 my-auto">
        <div className="space-y-3 text-center">
          <div className="w-12 h-12 rounded-full bg-[#141413] text-[#FAF9F5] flex items-center justify-center mx-auto mb-4">
            <Lock className="w-5 h-5" />
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl text-[#141413]">
            Editorial Studio CMS
          </h1>
          <p className="text-xs sm:text-sm text-[#64625C]">
            Authenticate to update case studies, technical dieline specifications, and video media.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5 p-8 rounded-2xl bg-[#F4F2EC] border border-[#E5E2DA] shadow-xs">
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-[#8A8881] block font-semibold">
              Admin Access Passphrase / PIN
            </label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter PIN (Default: ayu2026)"
              required
              className="w-full px-4 py-3 rounded-lg bg-[#FAF9F5] border border-[#DDD9CE] text-sm text-[#141413] focus:outline-none focus:border-[#141413] transition-colors"
            />
          </div>

          {error && (
            <div className="p-3 rounded-md bg-rose-50 border border-rose-200 text-xs text-rose-700">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 rounded-full bg-[#141413] text-[#FAF9F5] text-xs font-semibold uppercase tracking-wider hover:bg-[#2A2825] transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>{isLoading ? "Authenticating..." : "Enter Studio"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center justify-center gap-2 text-xs text-[#8A8881]">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Encrypted Session · Default PIN: <code className="font-mono bg-[#EAE7DF] px-1.5 py-0.5 rounded">ayu2026</code></span>
        </div>
      </div>

      <div className="text-center text-xs text-[#8A8881] pt-8">
        © 2026 Ayu Priyambodo. Admin Console.
      </div>
    </div>
  );
}
