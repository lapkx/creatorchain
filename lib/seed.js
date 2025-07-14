import { db } from "./firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export async function seedTestData() {
  // Viewer User
  await setDoc(doc(db, "users", "viewer123"), {
    email: "viewer@example.com",
    role: "viewer",
    points: 50,
    createdAt: serverTimestamp(),
  });

  // Creator User
  await setDoc(doc(db, "users", "creator123"), {
    email: "creator@example.com",
    role: "creator",
    points: 0,
    createdAt: serverTimestamp(),
  });

  // Campaign by Creator
  await setDoc(doc(db, "campaigns", "camp123"), {
    title: "Launch Giveaway",
    description: "Share this post and earn rewards!",
    creatorId: "creator123",
    rewardPerShare: 10,
    maxShares: 100,
    active: true,
    raffleEnabled: false,
    createdAt: serverTimestamp(),
  });

  // Reward
  await setDoc(doc(db, "rewards", "reward123"), {
    title: "Free T-Shirt",
    description: "Official CreatorChain merch",
    cost: 100,
  });

  console.log("✅ Firestore seeding complete");
}
