import { defaultAddOns, defaultMainOptions } from "../data/quoteOptions.js";
import { fetchQuoteOptions, upsertQuoteOptions } from "../lib/quoteOptions.js";

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
      const data = await fetchQuoteOptions();
      res.status(200).json(data);
    } catch (err) {
      console.warn("quote-options GET failed, returning defaults", err);
      res.status(200).json({ packages: defaultMainOptions, addons: defaultAddOns });
    }
    return;
  }

  if (req.method === "POST") {
    if (!requireAdmin(req, res)) return;
    try {
      const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
      const packages = Array.isArray(body.packages) ? body.packages : [];
      const addons = Array.isArray(body.addons) ? body.addons : [];
      if (!packages.length) {
        res.status(400).json({ error: "packages are required" });
        return;
      }
      await upsertQuoteOptions(packages, addons);
      const refreshed = await fetchQuoteOptions();
      res.status(200).json(refreshed);
    } catch (err: any) {
      console.error("quote-options POST error", err);
      res.status(500).json({ error: err?.message || "Failed to save quote options" });
    }
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
}
