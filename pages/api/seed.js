import { seedTestData } from "../../lib/seed";

export default async function handler(req, res) {
  try {
    await seedTestData();
    res.status(200).json({ message: "Seeding complete ✅" });
  } catch (error) {
    console.error("Seed error:", error);
    res.status(500).json({ error: "Seeding failed ❌" });
  }
}
