import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  increment,
  collection,
  addDoc,
} from "firebase/firestore";

export default function ReferralPage() {
  const router = useRouter();
  const { campaignId, ref } = router.query;

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!campaignId || !ref) return;

    const handleReferral = async () => {
      try {
        // Fetch campaign
        const campaignDoc = await getDoc(doc(db, "campaigns", campaignId));
        if (!campaignDoc.exists()) throw new Error("Campaign not found");

        const data = campaignDoc.data();
        setCampaign(data);

        // Credit referrer points
        const referrerRef = doc(db, "users", ref);
        await updateDoc(referrerRef, {
          points: increment(data.rewardPerShare || 0),
        });

        // Log referral history
        await addDoc(collection(db, "users", ref, "history"), {
          action: `Referral share: ${data.title}`,
          campaignId,
          points: data.rewardPerShare || 0,
          date: new Date().toLocaleDateString(),
          timestamp: serverTimestamp(),
        });

        setLoading(false);
      } catch (err) {
        console.error("Referral error:", err);
        router.push("/"); // fallback if broken link
      }
    };

    handleReferral();
  }, [campaignId, ref]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-slate-950">
        Tracking referral...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-2xl font-bold mb-4">{campaign.title}</h1>
      <p className="text-slate-300 max-w-md text-center mb-6">
        Thanks for checking this out! This content was shared with you by a CreatorChain member.
      </p>
      <a
        href={campaign.targetUrl || "/"}
        className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg text-white font-medium"
      >
        Go to Content
      </a>
    </div>
  );
}
