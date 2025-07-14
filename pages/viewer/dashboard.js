import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/router";
import { db } from "../../lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  doc,
} from "firebase/firestore";

export default function ViewerDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [campaigns, setCampaigns] = useState([]);
  const [rewards, setRewards] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!user) return router.push("/auth");

    const fetchData = async () => {
      try {
        // Fetch active campaigns
        const campaignQuery = query(
          collection(db, "campaigns"),
          where("active", "==", true)
        );
        const campaignSnap = await getDocs(campaignQuery);
        const fetchedCampaigns = campaignSnap.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            creator: data.creator || "unknown",
            link: `https://creatorchain.com/share/${doc.id}?ref=${user.uid}`,
            points: data.rewardPerShare || 0,
          };
        });
        setCampaigns(fetchedCampaigns);

        // Fetch rewards
        const rewardSnap = await getDocs(collection(db, "rewards"));
        const fetchedRewards = rewardSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          claimed: false, // Will be wired up later
        }));
        setRewards(fetchedRewards);

        // Fetch viewer history
        const histSnap = await getDocs(
          query(
            collection(db, "users", user.uid, "history"),
            orderBy("date", "desc")
          )
        );
        const fetchedHistory = histSnap.docs.map((doc) => doc.data());
        setHistory(fetchedHistory);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };

    fetchData();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push("/auth");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Sign Out */}
        <div className="flex justify-end">
          <button
            onClick={handleLogout}
            className="text-sm bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition"
          >
            Sign Out
          </button>
        </div>

        {/* Welcome */}
        <div className="text-center">
          <h1 className="text-3xl font-bold">👋 Welcome, {user.email}</h1>
          <p className="text-sm text-slate-400">
            Track your sharing progress and earn rewards
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatBox label="Total Points" value={user.points || 0} />
          <StatBox label="Referrals" value={2} />
          <StatBox label="Raffle Entries" value={3} />
        </div>

        {/* Campaigns */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">📣 Share & Earn</h2>
          <div className="space-y-4">
            {campaigns.map((item) => (
              <div
                key={item.id}
                className="bg-slate-800 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div>
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-slate-400">
                    @{item.creator} • {item.points} pts/share
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(item.link)
                    }
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-sm font-medium"
                  >
                    Copy Link
                  </button>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium"
                  >
                    Open
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Rewards */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">🎁 My Rewards</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {rewards.map((reward) => (
              <div
                key={reward.id}
                className="bg-slate-800 p-4 rounded-xl flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-semibold">{reward.title}</h3>
                  <p className="text-sm text-slate-400">
                    {reward.cost} points
                  </p>
                </div>
                <button
                  disabled={
                    reward.claimed || (user.points || 0) < reward.cost
                  }
                  className={`px-4 py-2 text-sm rounded-md font-medium transition ${
                    reward.claimed
                      ? "bg-green-700 cursor-not-allowed"
                      : (user.points || 0) >= reward.cost
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : "bg-gray-600 cursor-not-allowed"
                  }`}
                >
                  {reward.claimed ? "Claimed" : "Redeem"}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* History */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">📜 History</h2>
          <ul className="space-y-2 text-sm">
            {history.length > 0 ? (
              history.map((item, idx) => (
                <li
                  key={idx}
                  className="bg-slate-800 px-4 py-3 rounded-md flex justify-between"
                >
                  <span>{item.action}</span>
                  <span className="text-slate-400">
                    {item.date} • +{item.points} pts
                  </span>
                </li>
              ))
            ) : (
              <p className="text-slate-400">No activity yet.</p>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}

function StatBox({ label, value }) {
  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow text-center">
      <h3 className="text-lg font-semibold mb-1">{label}</h3>
      <p className="text-3xl font-bold text-indigo-400">{value}</p>
    </div>
  );
}
