import { useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  // Auto-redirect to dashboard if already logged in
  useEffect(() => {
    if (user?.role === "creator") {
      router.push("/creator/dashboard");
    } else if (user?.role === "viewer") {
      router.push("/viewer/dashboard");
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f11] via-[#1a1a1d] to-[#0f0f11] text-white flex flex-col items-center justify-center px-4 py-16">
      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-center">CreatorChain</h1>

      {/* Tagline */}
      <h2 className="text-2xl md:text-3xl font-semibold text-center mb-2">
        Grow with Your Fans — Reward Every Share
      </h2>

      {/* Description */}
      <p className="text-center text-gray-300 max-w-xl mb-10 px-4">
        A platform where creators grow their audience and fans earn rewards by promoting content.
      </p>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Link
          href="/auth"
          className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition"
        >
          Log In / Sign Up
          <ArrowRightIcon className="w-5 h-5 ml-2 shrink-0" />
        </Link>

        <Link
          href="/leaderboard"
          className="inline-flex items-center justify-center px-6 py-3 border border-zinc-600 hover:bg-white hover:text-black text-white font-semibold rounded-lg transition"
        >
          View Leaderboard
          <ArrowRightIcon className="w-5 h-5 ml-2 shrink-0" />
        </Link>
      </div>

      {/* Footer */}
      <footer className="mt-16 text-sm text-gray-400 text-center">
        &copy; {new Date().getFullYear()} CreatorChain
      </footer>
    </div>
  );
}
