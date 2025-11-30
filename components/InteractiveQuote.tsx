import React from "react";
import { Check, ArrowRight, Sparkles, X, Loader2 } from "lucide-react";

type MainOption = {
  id: string;
  name: string;
  desc: string;
  basePrice: number;
  tag?: string;
};

type AddOn = {
  id: string;
  name: string;
  desc: string;
  price: number;
  tag?: string;
};

const formatPrice = (value: number) =>
  "£" + value.toLocaleString("en-GB", { maximumFractionDigits: 0 });

const mainOptions: MainOption[] = [
  {
    id: "custom",
    name: "Custom Website",
    desc: "Bespoke design and build from scratch, aligned to your goals.",
    basePrice: 550,
    tag: "Most picked",
  },
  {
    id: "crm",
    name: "CRM Website",
    desc: "Lead capture wired to your CRM with automations for follow-up.",
    basePrice: 620,
  },
  {
    id: "commerce",
    name: "Online Store",
    desc: "Product catalogue, checkout, and launch collateral to start selling.",
    basePrice: 580,
  },
];

const addOnGroups: { title: string; items: AddOn[] }[] = [
  {
    title: "Essentials",
    items: [
      {
        id: "pages-5",
        name: "5-Page Build",
        desc: "Design + build up to 5 key pages with responsive layouts.",
        price: 260,
      },
      {
        id: "extra-pages",
        name: "2 Extra Pages",
        desc: "Add two more custom pages to the build.",
        price: 90,
      },
      {
        id: "blog",
        name: "Blog / CMS",
        desc: "Blog templates and an easy publishing workflow.",
        price: 120,
      },
    ],
  },
  {
    title: "Growth",
    items: [
      {
        id: "seo",
        name: "SEO & Performance",
        desc: "Technical tidy-up, on-page basics, and speed passes.",
        price: 130,
      },
      {
        id: "crm-sync",
        name: "CRM Automations",
        desc: "Sync forms to your CRM with tags, routing, and notifications.",
        price: 110,
      },
      {
        id: "payments",
        name: "Bookings / Payments",
        desc: "Stripe/booking flow for calls, sessions, or simple payments.",
        price: 140,
      },
    ],
  },
  {
    title: "Support",
    items: [
      {
        id: "support",
        name: "Ongoing Support",
        desc: "Monthly updates, monitoring, and small fixes (5 hours/mo).",
        price: 120,
        tag: "Monthly",
      },
    ],
  },
];

const allAddOns = addOnGroups.flatMap((g) => g.items);

const InteractiveQuote: React.FC = () => {
  const [mainSelection, setMainSelection] = React.useState<MainOption>(mainOptions[0]);
  const [selectedAddOns, setSelectedAddOns] = React.useState<Set<string>>(new Set(["pages-5", "seo"]));
  const [modalOpen, setModalOpen] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [note, setNote] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [sent, setSent] = React.useState(false);

  const toggleAddOn = (id: string) => {
    setSelectedAddOns((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const selectAllAddOns = () => setSelectedAddOns(new Set(allAddOns.map((o) => o.id)));
  const resetAddOns = () => setSelectedAddOns(new Set());

  const selectedAddOnItems = allAddOns.filter((o) => selectedAddOns.has(o.id));
  const baseItem = {
    id: mainSelection.id,
    name: mainSelection.name,
    desc: mainSelection.desc,
    price: mainSelection.basePrice,
  };
  const selectedItems = [baseItem, ...selectedAddOnItems];

  const monthlyItems = selectedItems.filter((item) => item.tag === "Monthly");
  const monthlyTotal = monthlyItems.reduce((sum, item) => sum + item.price, 0);
  const oneOffItems = selectedItems.filter((item) => item.tag !== "Monthly");
  const oneOffTotal = oneOffItems.reduce((sum, item) => sum + item.price, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !mainSelection) return;

    setSending(true);
    setError(null);
    setSent(false);

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          note: note || undefined,
          totalOneOff: oneOffTotal,
          monthlyTotal,
          items: selectedItems.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            tag: item.tag,
          })),
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || "Unable to send request right now.");
      }

      setSent(true);
      setEmail("");
      setNote("");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="py-28 border-b border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-300/5 via-slate-900 to-slate-950 opacity-80 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          <div className="lg:w-1/3 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs uppercase tracking-[0.18em] text-slate-200">
              <Sparkles className="w-4 h-4 text-brand-300" />
              Configure your own
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white leading-tight">
              Pick a build type, then add the pieces you need.
            </h2>
            <p className="text-slate-400 text-base leading-relaxed">
              Choose one package type to start. Layer in SEO, pages, integrations, and support to match your scope.
            </p>
            <div className="flex gap-3">
              <button
                onClick={selectAllAddOns}
                className="px-4 py-2 text-sm font-semibold uppercase tracking-wide border border-white/20 text-white hover:border-brand-300 hover:text-brand-300 transition-colors"
              >
                Add all extras
              </button>
              <button
                onClick={resetAddOns}
                className="px-4 py-2 text-sm font-semibold uppercase tracking-wide bg-white/10 border border-white/10 text-white hover:bg-white/20 transition-colors"
              >
                Reset extras
              </button>
            </div>
          </div>

          <div className="lg:w-2/3 space-y-8 w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mainOptions.map((option) => {
                const isActive = mainSelection.id === option.id;
                return (
                  <button
                    key={option.id}
                    onClick={() => setMainSelection(option)}
                    className={`text-left border rounded-sm p-5 transition-all h-full ${
                      isActive
                        ? "border-brand-300/60 bg-white/5 shadow-[0_20px_60px_-25px_rgba(190,242,100,0.5)]"
                        : "border-white/10 bg-slate-950/60 hover:border-white/30"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                        {option.tag || "Package"}
                      </p>
                      <span
                        className={`text-[11px] font-mono px-2 py-1 rounded border ${
                          isActive
                            ? "border-brand-300 text-brand-300"
                            : "border-white/15 text-slate-400"
                        }`}
                      >
                        From {formatPrice(option.basePrice)}
                      </span>
                    </div>
                    <h3 className="text-xl font-display font-bold text-white mb-2">
                      {option.name}
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {option.desc}
                    </p>
                  </button>
                );
              })}
            </div>

            <div className="space-y-6">
              {addOnGroups.map((group) => (
                <div key={group.title} className="border border-white/10 bg-slate-950/60 rounded p-5">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-white">{group.title}</p>
                    <span className="text-xs text-slate-500 uppercase tracking-[0.18em]">
                      Optional
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {group.items.map((item) => {
                      const isActive = selectedAddOns.has(item.id);
                      return (
                        <button
                          key={item.id}
                          onClick={() => toggleAddOn(item.id)}
                          className={`text-left group relative overflow-hidden border rounded-sm p-4 transition-all ${
                            isActive
                              ? "border-brand-300/60 bg-white/5"
                              : "border-white/10 bg-slate-950/60 hover:border-white/30"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <div>
                              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                                {item.tag || "Add-on"}
                              </p>
                              <h4 className="text-lg font-display font-bold text-white">
                                {item.name}
                              </h4>
                            </div>
                            <div
                              className={`w-9 h-9 rounded-full border flex items-center justify-center text-sm font-bold ${
                                isActive
                                  ? "border-brand-300 bg-brand-300 text-black"
                                  : "border-white/20 text-slate-300 group-hover:border-white/40"
                              }`}
                            >
                              {isActive ? <Check className="w-4 h-4" /> : "+"}
                            </div>
                          </div>
                          <p className="text-slate-300 text-sm leading-relaxed mb-3">
                            {item.desc}
                          </p>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-400">From</span>
                            <span className="text-base font-mono text-brand-300">
                              {formatPrice(item.price)}
                              {item.tag === "Monthly" ? " / mo" : ""}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border border-white/10 bg-slate-950/70 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  Estimated investment
                </p>
                <div className="text-3xl md:text-4xl font-mono text-brand-300">
                  {formatPrice(oneOffTotal || 0)}
                </div>
                {monthlyTotal > 0 && (
                  <p className="text-brand-300 text-sm font-mono">
                    + {formatPrice(monthlyTotal)} / month
                  </p>
                )}
                <p className="text-slate-400 text-sm">
                  Base includes your chosen package. Add-ons are flexible.
                </p>
              </div>
              <div className="w-full md:w-auto">
                <div className="bg-slate-900 border border-white/10 px-4 py-3 rounded-sm">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400 mb-2">
                    Selected
                  </p>
                  {selectedItems.length ? (
                    <ul className="space-y-2 text-slate-200 text-sm">
                      {selectedItems.map((item) => (
                        <li key={item.id} className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-brand-300 shrink-0" />
                          {item.name}
                          {item.tag === "Monthly" && (
                            <span className="text-[10px] uppercase tracking-[0.18em] text-brand-300 ml-1">
                              Monthly
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-slate-500 text-sm">
                      Choose a package and add-ons to build your estimate.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setModalOpen(true);
                setError(null);
                setSent(false);
              }}
              className="inline-flex items-center gap-3 px-6 py-3 border border-brand-300 text-brand-300 uppercase tracking-wide font-bold hover:bg-brand-300 hover:text-black transition-colors disabled:opacity-50"
            >
              Lock this in
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="max-w-2xl w-full bg-slate-950 border border-white/10 rounded-lg shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-300/10 via-transparent to-slate-900 pointer-events-none" />
            <div className="relative p-6 md:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-brand-300 font-mono">
                    Lock-in summary
                  </p>
                  <h3 className="text-2xl md:text-3xl font-display font-bold text-white">
                    Send this to the team
                  </h3>
                  <p className="text-slate-400 text-sm mt-1">
                    We&apos;ll email a confirmation and log it in the admin inbox.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setModalOpen(false);
                    setError(null);
                    setSent(false);
                  }}
                  className="text-slate-400 hover:text-white transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="border border-white/10 bg-white/5 rounded p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400 mb-2">
                    Items selected
                  </p>
                  {selectedItems.length ? (
                    <ul className="space-y-3">
                      {selectedItems.map((item) => (
                        <li key={item.id} className="flex justify-between items-start text-sm text-slate-200">
                          <div>
                            <p className="font-semibold text-white">{item.name}</p>
                            <p className="text-slate-500 text-xs">{item.desc}</p>
                            {item.tag === "Monthly" && (
                              <span className="inline-block mt-1 text-[10px] uppercase tracking-[0.18em] text-brand-300">
                                Monthly
                              </span>
                            )}
                          </div>
                          <span className="font-mono text-brand-300">
                            {formatPrice(item.price)}
                            {item.tag === "Monthly" ? " / mo" : ""}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-slate-500 text-sm">
                      Choose a package to see the summary.
                    </p>
                  )}
                  <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.18em] text-slate-400">
                      Estimated total
                    </span>
                    <div className="text-right">
                      <span className="block text-2xl font-mono text-brand-300">
                        {formatPrice(oneOffTotal)}
                      </span>
                      {monthlyTotal > 0 && (
                        <span className="block text-sm font-mono text-brand-300">
                          + {formatPrice(monthlyTotal)} / month
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.18em] text-slate-500 mb-2">
                      Your email
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full bg-transparent border border-white/15 rounded px-3 py-3 text-white focus:outline-none focus:border-brand-300"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-[0.18em] text-slate-500 mb-2">
                      Notes (optional)
                    </label>
                    <textarea
                      rows={3}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Share deadlines, must-haves, or context."
                      className="w-full bg-transparent border border-white/15 rounded px-3 py-3 text-white focus:outline-none focus:border-brand-300 resize-none"
                    ></textarea>
                  </div>

                  {error && <p className="text-sm text-red-300">{error}</p>}
                  {sent && (
                    <p className="text-sm text-brand-300">
                      Sent. Check your inbox for confirmation.
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={sending || !mainSelection}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-brand-300 text-black font-bold uppercase tracking-wide rounded hover:bg-brand-400 transition disabled:opacity-50"
                  >
                    {sending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send request
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default InteractiveQuote;
