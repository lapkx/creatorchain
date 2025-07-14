import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  const dashboardLink =
    user?.role === "creator"
      ? "/creator/dashboard"
      : user?.role === "viewer"
      ? "/viewer/dashboard"
      : "/auth";

  return (
    <div className="min-h-screen text-white bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center px-6">
      {/* Logo / Brand */}
      <header className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight flex items-center justify-center gap-3 drop-shadow">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-indigo-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          <span>CreatorChain</span>
        </h1>
      </header>

      {/* Hero Section */}
      <main className="max-w-2xl text-center space-y-6">
        <h2 className="text-3xl md:text-4xl font-semibold leading-snug">
          Rewarding Viewers for Sharing Content
        </h2>
        <p className="text-base md:text-lg text-slate-300">
          A platform where creators grow their audience and fans earn rewards by promoting content.
        </p>

        {/* Call-to-Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
          <Link href={user ? dashboardLink : "/auth"} legacyBehavior>
            <a className="inline-flex items-center px-6 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium text-sm sm:text-base transition">
              {user ? "Go to Dashboard" : "Log In / Sign Up"}
              <ArrowRightIcon className="w-4 h-4 ml-2 shrink-0" />
            </a>
          </Link>

          <Link href="/leaderboard" legacyBehavior>
            <a className="inline-flex items-center px-6 py-2 border border-slate-300 hover:bg-slate-200 hover:text-slate-900 rounded-lg font-medium text-sm sm:text-base transition">
              View Leaderboard
              <ArrowRightIcon className="w-4 h-4 ml-2 shrink-0" />
            </a>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 text-sm text-slate-400 text-center">
        &copy; {new Date().getFullYear()} CreatorChain — Built with ❤️
      </footer>
    </div>
  );
}
