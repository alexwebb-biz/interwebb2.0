import { withDb } from "./db.js";
import { AddOn, MainOption } from "../data/quoteOptions";

export type QuotePackageRow = {
  id: string;
  name: string;
  desc: string;
  base_price: number;
  tag?: string | null;
};

export type QuoteAddOnRow = {
  id: string;
  name: string;
  desc: string;
  price: number;
  tag?: string | null;
  applies_to?: string[] | null;
  group_name: string;
};

const toPackage = (row: QuotePackageRow): MainOption => ({
  id: row.id,
  name: row.name,
  desc: row.desc,
  basePrice: Number(row.base_price || 0),
  tag: row.tag || undefined,
});

const toAddOn = (row: QuoteAddOnRow): AddOn => ({
  id: row.id,
  name: row.name,
  desc: row.desc,
  price: Number(row.price || 0),
  tag: row.tag || undefined,
  appliesTo: row.applies_to || undefined,
  group: row.group_name,
});

export const fetchQuoteOptions = async (): Promise<{ packages: MainOption[]; addons: AddOn[] }> => {
  return withDb(async (db) => {
    const packages = await db.query<QuotePackageRow>(
      `select id, name, "desc" as desc, base_price, tag from quote_packages order by base_price asc;`
    );
    const addons = await db.query<QuoteAddOnRow>(
      `select id, name, "desc" as desc, price, tag, applies_to, group_name from quote_addons order by group_name, price;`
    );
    return { packages: packages.rows.map(toPackage), addons: addons.rows.map(toAddOn) };
  });
};

export const upsertQuoteOptions = async (packages: MainOption[], addons: AddOn[]) => {
  return withDb(async (db) => {
    const client = await db.connect();
    try {
      await client.query("BEGIN");
      for (const p of packages) {
        await client.query(
          `insert into quote_packages (id, name, "desc", base_price, tag)
           values ($1, $2, $3, $4, $5)
           on conflict (id) do update set name = excluded.name, desc = excluded.desc, base_price = excluded.base_price, tag = excluded.tag;`,
          [p.id, p.name, p.desc, p.basePrice, p.tag ?? null]
        );
      }
      for (const a of addons) {
        await client.query(
          `insert into quote_addons (id, name, "desc", price, tag, applies_to, group_name)
           values ($1, $2, $3, $4, $5, $6, $7)
           on conflict (id) do update set
             name = excluded.name,
             desc = excluded.desc,
             price = excluded.price,
             tag = excluded.tag,
             applies_to = excluded.applies_to,
             group_name = excluded.group_name;`,
          [a.id, a.name, a.desc, a.price, a.tag ?? null, a.appliesTo ?? [], a.group]
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
