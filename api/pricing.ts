import { fetchPricingTiers, upsertPricingTiers } from "../lib/pricing.js";
import { packageTiers } from "../data/pricing.js";

const requireAdmin = (req: any, res: any) => {
  const token = (req.headers.authorization || "").replace("Bearer ", "");
  if (!process.env.ADMIN_TOKEN || token !== process.env.ADMIN_TOKEN) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  return true;
};

export default async function handler(req: any, res: any) {
  if (req.method === "GET") {
    try {
      const rows = await fetchPricingTiers();
      res.status(200).json({ tiers: rows });
    } catch (err) {
      console.warn("Pricing GET failed, returning fallback data.", err);
      res.status(200).json({ tiers: packageTiers });
    }
    return;
  }

  if (req.method === "POST") {
    if (!requireAdmin(req, res)) return;
    try {
      const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
      const tiers = Array.isArray(body.tiers) ? body.tiers : [];
      if (!tiers.length) {
        res.status(400).json({ error: "tiers array is required" });
        return;
      }

      await upsertPricingTiers(
        tiers.map((t: any) => ({
          slug: t.slug?.toString().trim(),
          name: t.name?.toString().trim(),
          price: Number(t.price || 0),
          description: t.description?.toString().trim() || "",
          features: Array.isArray(t.features)
            ? t.features.filter(Boolean).map((f: any) => f.toString())
            : [],
          highlight: Boolean(t.highlight),
        }))
      );

      const refreshed = await fetchPricingTiers();
      res.status(200).json({ tiers: refreshed });
    } catch (err: any) {
      console.error("Pricing POST error", err);
      res.status(500).json({ error: err?.message || "Failed to save pricing" });
    }
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
}
