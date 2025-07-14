import { useState } from "react";
import { useRouter } from "next/router";
import { auth, db } from "../lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  doc,
  setDoc,
  getDoc
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

export default function AuthPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("viewer");
  const [mode, setMode] = useState("login"); // or 'signup'
  const [error, setError] = useState("");

  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      let userCredential;

      if (mode === "signup") {
        // Create user with Firebase Auth
        userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // Store user role in Firestore
        await setDoc(doc(db, "users", userCredential.user.uid), {
          email,
          role,
          points: 0,
        });
      } else {
        // Log in existing user
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      }

      // Get user role from Firestore
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
      if (!userDoc.exists()) throw new Error("User record not found in Firestore.");

      const userData = { id: userCredential.user.uid, ...userDoc.data() };
      login(userData); // store in context

      // Redirect based on role
      if (userData.role === "creator") {
        router.push("/creator/dashboard");
      } else {
        router.push("/viewer/dashboard");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <form
        onSubmit={handleAuth}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-indigo-600">
          {mode === "signup" ? "Sign Up" : "Log In"}
        </h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          className="w-full border px-4 py-2 rounded-md"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border px-4 py-2 rounded-md"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {mode === "signup" && (
          <div className="flex space-x-4">
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
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-semibold"
        >
          {mode === "signup" ? "Create Account" : "Log In"}
        </button>

        <div className="text-sm text-center">
          {mode === "login" ? (
            <p>
              New here?{" "}
              <button
                type="button"
                onClick={() => setMode("signup")}
                className="text-indigo-600 font-semibold underline"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setMode("login")}
                className="text-indigo-600 font-semibold underline"
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
