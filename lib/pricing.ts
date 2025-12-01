import { withDb } from "./db.js";
import { PackageTier } from "../data/pricing";

export type PricingTierRow = {
  slug: string;
  name: string;
  price: number;
  description: string;
  features: string[] | null;
  highlight?: boolean | null;
};

const normalizeTier = (row: PricingTierRow): PackageTier => ({
  slug: row.slug,
  name: row.name,
  price: Number(row.price || 0),
  description: row.description,
  features: row.features || [],
  highlight: Boolean(row.highlight),
});

export const fetchPricingTiers = async (): Promise<PackageTier[]> => {
  return withDb(async (db) => {
    const result = await db.query<PricingTierRow>(
      `select slug, name, price, description, features, highlight
       from pricing_tiers
       order by price asc;`
    );
    return result.rows.map(normalizeTier);
  });
};

export const upsertPricingTiers = async (tiers: PackageTier[]) => {
  return withDb(async (db) => {
    const client = await db.connect();
    try {
      await client.query("BEGIN");
      for (const tier of tiers) {
        await client.query(
          `insert into pricing_tiers (slug, name, price, description, features, highlight)
           values ($1, $2, $3, $4, $5, $6)
           on conflict (slug) do update set
             name = excluded.name,
             price = excluded.price,
             description = excluded.description,
             features = excluded.features,
             highlight = excluded.highlight;`,
          [tier.slug, tier.name, tier.price, tier.description, tier.features, tier.highlight ?? false]
        );
      }
      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  });
};
