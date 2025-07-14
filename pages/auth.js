import { useState } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function AuthPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login"); // "signup" or "login"
  const [role, setRole] = useState("viewer"); // only for signup
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      let userCredential;

      if (mode === "signup") {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Create user doc in Firestore
        await setDoc(doc(db, "users", userCredential.user.uid), {
          email,
          role,
          points: 0,
          createdAt: new Date(),
        });
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }

      // Fetch user role from Firestore
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      if (!userDoc.exists()) throw new Error("User profile not found.");

      const userData = { id: userCredential.user.uid, ...userDoc.data() };

      // Redirect based on role
      router.push(userData.role === "creator" ? "/creator/dashboard" : "/viewer/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white text-slate-800 p-8 rounded-xl shadow-md w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-indigo-600">
          {mode === "signup" ? "Sign Up" : "Log In"}
        </h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full border border-slate-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border border-slate-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {mode === "signup" && (
          <div className="flex justify-center gap-6 text-sm text-slate-600">
            <label className="flex items-center">
              <input
                type="radio"
                value="viewer"
                checked={role === "viewer"}
                onChange={() => setRole("viewer")}
                className="mr-2"
              />
              Viewer
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="creator"
                checked={role === "creator"}
                onChange={() => setRole("creator")}
                className="mr-2"
              />
              Creator
            </label>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-semibold transition"
        >
          {mode === "signup" ? "Create Account" : "Log In"}
        </button>

        <div className="text-center text-sm">
          {mode === "login" ? (
            <p>
              New here?{" "}
              <button
                type="button"
                className="text-indigo-600 font-medium underline"
                onClick={() => setMode("signup")}
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                type="button"
                className="text-indigo-600 font-medium underline"
                onClick={() => setMode("login")}
              >
                Log In
              </button>
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
