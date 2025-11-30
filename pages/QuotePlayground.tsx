import React from "react";
import { ArrowRight, Check, ChevronDown, Smartphone, Loader2, X } from "lucide-react";

type BaseOption = {
  id: string;
  name: string;
  desc: string;
  price: number;
};

type AddOn = {
  id: string;
  name: string;
  desc: string;
  price: number;
  tag?: "Monthly";
};

type Selection = {
  base: BaseOption;
  addOns: AddOn[];
  email: string;
  note: string;
};

const formatPrice = (value: number) =>
  "\u00a3" + value.toLocaleString("en-GB", { maximumFractionDigits: 0 });

const baseOptions: BaseOption[] = [
  { id: "custom", name: "Custom Website", desc: "From-scratch build aligned to your goals.", price: 550 },
  { id: "crm", name: "CRM Website", desc: "Lead capture wired to your CRM + automations.", price: 620 },
  { id: "commerce", name: "Online Store", desc: "Catalog + checkout so you can sell fast.", price: 580 },
];

const addOns: AddOn[] = [
  { id: "pages-5", name: "5-Page Build", desc: "Design + build up to 5 pages.", price: 260 },
  { id: "extra-pages", name: "2 Extra Pages", desc: "Add two more custom pages.", price: 90 },
  { id: "blog", name: "Blog / CMS", desc: "Templates + publishing workflow.", price: 120 },
  { id: "seo", name: "SEO & Performance", desc: "On-page tidy-up + speed.", price: 130 },
  { id: "crm-sync", name: "CRM Automations", desc: "Sync forms to CRM with routing.", price: 110 },
  { id: "payments", name: "Bookings / Payments", desc: "Stripe/booking flow.", price: 140 },
  { id: "support", name: "Ongoing Support", desc: "Monthly updates (5h/mo).", price: 120, tag: "Monthly" },
];

const calcTotals = (sel: Selection) => {
  const monthly = sel.addOns.filter((a) => a.tag === "Monthly");
  const oneOff = sel.addOns.filter((a) => a.tag !== "Monthly");
  const oneOffTotal = oneOff.reduce((sum, a) => sum + a.price, sel.base.price);
  const monthlyTotal = monthly.reduce((sum, a) => sum + a.price, 0);
  return { oneOffTotal, monthlyTotal };
};

const useSubmitQuote = (selection: Selection) => {
  const [sending, setSending] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const submit = async () => {
    if (!selection.email) {
      setError("Email required");
      return;
    }
    setSending(true);
    setError(null);
    setSent(false);
    const { oneOffTotal, monthlyTotal } = calcTotals(selection);
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: selection.email,
          note: selection.note || undefined,
          totalOneOff: oneOffTotal,
          monthlyTotal,
          items: [
            { id: selection.base.id, name: selection.base.name, price: selection.base.price },
            ...selection.addOns.map((a) => ({
              id: a.id,
              name: a.name,
              price: a.price,
              tag: a.tag,
            })),
          ],
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Unable to send request");
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSending(false);
    }
  };

  return { submit, sending, sent, error };
};

const Chip = ({
  active,
  label,
  price,
  onClick,
}: {
  active?: boolean;
  label: string;
  price?: string;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-full border text-sm whitespace-nowrap ${
      active ? "bg-brand-300 text-black border-brand-300" : "border-white/15 text-slate-200"
    }`}
  >
    {label}
    {price && <span className="ml-2 font-mono text-xs opacity-80">{price}</span>}
  </button>
);

const AddOnToggle = ({
  item,
  active,
  onToggle,
}: {
  item: AddOn;
  active: boolean;
  onToggle: () => void;
}) => (
  <button
    onClick={onToggle}
    className={`text-left border rounded-lg p-3 flex items-center justify-between ${
      active ? "border-brand-300/70 bg-white/5" : "border-white/10 bg-slate-950/60"
    }`}
  >
    <div className="pr-3">
      <p className="text-sm font-semibold text-white">{item.name}</p>
      <p className="text-xs text-slate-400">{item.desc}</p>
    </div>
    <div className="flex flex-col items-end gap-1">
      <span className="text-sm font-mono text-brand-300">
        {formatPrice(item.price)}
        {item.tag === "Monthly" ? " / mo" : ""}
      </span>
      <span
        className={`w-8 h-8 rounded-full border flex items-center justify-center ${
          active ? "border-brand-300 bg-brand-300 text-black" : "border-white/20 text-slate-300"
        }`}
      >
        {active ? <Check className="w-4 h-4" /> : "+"}
      </span>
    </div>
  </button>
);

const TotalBar = ({ selection }: { selection: Selection }) => {
  const { oneOffTotal, monthlyTotal } = calcTotals(selection);
  return (
    <div className="flex items-center justify-between bg-slate-900/80 border border-white/10 rounded-lg px-4 py-3">
      <div>
        <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">Estimated</p>
        <p className="text-xl font-mono text-brand-300">{formatPrice(oneOffTotal)}</p>
        {monthlyTotal > 0 && (
          <p className="text-sm font-mono text-brand-300">+ {formatPrice(monthlyTotal)} / month</p>
        )}
      </div>
      <div className="text-right text-xs text-slate-400">
        <p>{selection.base.name}</p>
        <p className="text-slate-500">
          {selection.addOns.length} add-on{selection.addOns.length === 1 ? "" : "s"}
        </p>
      </div>
    </div>
  );
};

const StepperDemo: React.FC<{ selection: Selection; setSelection: (s: Selection) => void }> = ({
  selection,
  setSelection,
}) => {
  const [step, setStep] = React.useState(0);
  const { submit, sending, sent, error } = useSubmitQuote(selection);
  const { oneOffTotal, monthlyTotal } = calcTotals(selection);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-400">
        <span className="text-brand-300 font-semibold">Step {step + 1} of 3</span>
        <span className="border border-white/10 rounded-full px-3 py-1 text-white">
          {step === 0 ? "Next: Add-ons" : step === 1 ? "Next: Summary" : "Review"}
        </span>
      </div>

      {step === 0 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {baseOptions.map((b) => (
            <Chip
              key={b.id}
              label={b.name}
              price={`from ${formatPrice(b.price)}`}
              active={selection.base.id === b.id}
              onClick={() => setSelection({ ...selection, base: b })}
            />
          ))}
        </div>
      )}

      {step === 1 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {addOns.map((a) => {
            const active = selection.addOns.some((s) => s.id === a.id);
            return (
              <AddOnToggle
                key={a.id}
                item={a}
                active={active}
                onToggle={() =>
                  setSelection({
                    ...selection,
                    addOns: active
                      ? selection.addOns.filter((x) => x.id !== a.id)
                      : [...selection.addOns, a],
                  })
                }
              />
            );
          })}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          <TotalBar selection={selection} />
          <div className="space-y-2 border border-white/10 rounded-lg p-3">
            <input
              type="email"
              value={selection.email}
              onChange={(e) => setSelection({ ...selection, email: e.target.value })}
              placeholder="you@company.com"
              className="w-full bg-transparent border border-white/15 rounded px-3 py-2 text-white focus:outline-none focus:border-brand-300 text-sm"
            />
            <textarea
              rows={2}
              value={selection.note}
              onChange={(e) => setSelection({ ...selection, note: e.target.value })}
              placeholder="Notes (optional)"
              className="w-full bg-transparent border border-white/15 rounded px-3 py-2 text-white focus:outline-none focus:border-brand-300 text-sm"
            />
            {error && <p className="text-sm text-red-300">{error}</p>}
            {sent && <p className="text-sm text-brand-300">Sent. Check your inbox.</p>}
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <TotalBar selection={selection} />
        <button
          onClick={step < 2 ? () => setStep((s) => s + 1) : submit}
          disabled={sending}
          className="inline-flex items-center gap-2 px-4 py-3 bg-brand-300 text-black font-bold uppercase text-xs rounded hover:bg-brand-400 transition disabled:opacity-50"
        >
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {step < 2 ? "Next" : "Send"}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const AccordionDemo: React.FC<{ selection: Selection; setSelection: (s: Selection) => void }> = ({
  selection,
  setSelection,
}) => {
  const [openBase, setOpenBase] = React.useState(selection.base.id);
  const toggleAddOn = (addon: AddOn) => {
    const active = selection.addOns.some((x) => x.id === addon.id);
    setSelection({
      ...selection,
      addOns: active ? selection.addOns.filter((x) => x.id !== addon.id) : [...selection.addOns, addon],
    });
  };

  return (
    <div className="space-y-3">
      {baseOptions.map((b) => (
        <div key={b.id} className="border border-white/10 rounded-lg overflow-hidden">
          <button
            className="w-full flex items-center justify-between px-4 py-3 bg-white/5"
            onClick={() => {
              setOpenBase((prev) => (prev === b.id ? "" : b.id));
              setSelection({ ...selection, base: b });
            }}
          >
            <div className="text-left">
              <p className="text-sm font-semibold">{b.name}</p>
              <p className="text-xs text-slate-400">From {formatPrice(b.price)}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-300" />
          </button>
          {openBase === b.id && (
            <div className="p-4 bg-slate-900/60 space-y-2">
              {addOns.slice(0, 4).map((item) => {
                const active = selection.addOns.some((x) => x.id === item.id);
                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border border-white/10 rounded px-3 py-2"
                  >
                    <div>
                      <p className="text-sm text-white">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => toggleAddOn(item)}
                      className={`w-8 h-8 rounded-full border flex items-center justify-center ${
                        active ? "border-brand-300 bg-brand-300 text-black" : "border-white/20 text-slate-300"
                      }`}
                    >
                      {active ? <Check className="w-4 h-4" /> : "+"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
      <TotalBar selection={selection} />
    </div>
  );
};

const BottomSheetDemo: React.FC<{ selection: Selection; setSelection: (s: Selection) => void }> = ({
  selection,
  setSelection,
}) => {
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const { submit, sending, sent, error } = useSubmitQuote(selection);
  const toggleAddOn = (addon: AddOn) => {
    const active = selection.addOns.some((x) => x.id === addon.id);
    setSelection({
      ...selection,
      addOns: active ? selection.addOns.filter((x) => x.id !== addon.id) : [...selection.addOns, addon],
    });
  };

  const sheetContent = (
    <div className="space-y-3">
      {addOns.map((item) => {
        const active = selection.addOns.some((x) => x.id === item.id);
        return <AddOnToggle key={item.id} item={item} active={active} onToggle={() => toggleAddOn(item)} />;
      })}
    </div>
  );

  return (
    <div className="relative border border-white/10 rounded-lg p-4 bg-slate-900/50">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Base</p>
          <p className="text-lg font-display">{selection.base.name}</p>
          <p className="text-xs text-slate-500">{selection.base.desc}</p>
        </div>
        <p className="text-sm font-mono text-brand-300">{formatPrice(selection.base.price)}</p>
      </div>

      <div className="sticky bottom-3 flex flex-col gap-2 bg-slate-950/90 border border-white/10 rounded-lg px-4 py-3">
        <TotalBar selection={selection} />
        <div className="flex gap-2">
          <input
            type="email"
            value={selection.email}
            onChange={(e) => setSelection({ ...selection, email: e.target.value })}
            placeholder="you@company.com"
            className="flex-1 bg-transparent border border-white/15 rounded px-3 py-2 text-white focus:outline-none focus:border-brand-300 text-sm"
          />
          <button
            onClick={submit}
            disabled={sending}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-300 text-black font-bold uppercase text-xs rounded hover:bg-brand-400 transition disabled:opacity-50"
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Send
          </button>
        </div>
        {error && <p className="text-xs text-red-300">{error}</p>}
        {sent && <p className="text-xs text-brand-300">Sent.</p>}
      </div>

      <div className="mt-4 border-t border-white/10 pt-3">
        <button
          onClick={() => setSheetOpen((s) => !s)}
          className="w-full flex items-center justify-between text-left px-3 py-2 border border-white/10 rounded"
        >
          <span className="text-sm font-semibold text-white">Add-ons</span>
          <ChevronDown className="w-4 h-4 text-slate-300" />
        </button>
        {sheetOpen && <div className="mt-3 max-h-72 overflow-y-auto pr-1">{sheetContent}</div>}
      </div>
    </div>
  );
};

const TabbedDemo: React.FC<{ selection: Selection; setSelection: (s: Selection) => void }> = ({
  selection,
  setSelection,
}) => {
  const [tab, setTab] = React.useState<"Base" | "Extras" | "Summary">("Base");
  const { submit, sending, sent, error } = useSubmitQuote(selection);
  const { oneOffTotal, monthlyTotal } = calcTotals(selection);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm">
        {(["Base", "Extras", "Summary"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-2 rounded-full border ${
              tab === t ? "border-brand-300 text-brand-300" : "border-white/15 text-slate-300"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Base" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {baseOptions.map((b) => (
            <div
              key={b.id}
              onClick={() => setSelection({ ...selection, base: b })}
              className={`p-4 border rounded-lg cursor-pointer ${
                selection.base.id === b.id ? "border-brand-300/60 bg-white/5" : "border-white/10 bg-slate-950/60"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <p className="text-lg font-display text-white">{b.name}</p>
                <span className="text-xs font-mono text-brand-300">{formatPrice(b.price)}</span>
              </div>
              <p className="text-slate-400 text-sm">{b.desc}</p>
            </div>
          ))}
        </div>
      )}

      {tab === "Extras" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {addOns.map((item) => {
            const active = selection.addOns.some((x) => x.id === item.id);
            return (
              <AddOnToggle
                key={item.id}
                item={item}
                active={active}
                onToggle={() =>
                  setSelection({
                    ...selection,
                    addOns: active
                      ? selection.addOns.filter((x) => x.id !== item.id)
                      : [...selection.addOns, item],
                  })
                }
              />
            );
          })}
        </div>
      )}

      {tab === "Summary" && (
        <div className="space-y-2 border border-white/10 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Total</p>
              <p className="text-2xl font-mono text-brand-300">{formatPrice(oneOffTotal)}</p>
              {monthlyTotal > 0 && (
                <p className="text-sm font-mono text-brand-300">+ {formatPrice(monthlyTotal)} / month</p>
              )}
            </div>
            <div className="text-xs text-slate-400 text-right">
              <p>{selection.base.name}</p>
              <p>{selection.addOns.length} add-on{selection.addOns.length === 1 ? "" : "s"}</p>
            </div>
          </div>
          <div className="space-y-1 text-sm text-slate-200">
            <p>{selection.base.name}</p>
            {selection.addOns.map((a) => (
              <p key={a.id} className="text-slate-400">
                + {a.name}
              </p>
            ))}
          </div>
          <input
            type="email"
            value={selection.email}
            onChange={(e) => setSelection({ ...selection, email: e.target.value })}
            placeholder="you@company.com"
            className="w-full bg-transparent border border-white/15 rounded px-3 py-2 text-white focus:outline-none focus:border-brand-300 text-sm"
          />
          {error && <p className="text-sm text-red-300">{error}</p>}
          {sent && <p className="text-sm text-brand-300">Sent.</p>}
          <button
            onClick={submit}
            disabled={sending}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-brand-300 text-black font-bold uppercase tracking-wide rounded hover:bg-brand-400 transition disabled:opacity-50"
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Send request
          </button>
        </div>
      )}
    </div>
  );
};

const PresetDemo: React.FC<{ selection: Selection; setSelection: (s: Selection) => void }> = ({
  selection,
  setSelection,
}) => {
  const presets: { name: string; base: BaseOption; addOnIds: string[]; desc: string }[] = [
    { name: "Lean", base: baseOptions[0], addOnIds: ["pages-5", "seo"], desc: "Launch ready basics." },
    { name: "Lead", base: baseOptions[1], addOnIds: ["pages-5", "seo", "crm-sync"], desc: "CRM + nurture." },
    { name: "Sell", base: baseOptions[2], addOnIds: ["pages-5", "payments", "blog"], desc: "Store + content." },
  ];

  const applyPreset = (p: (typeof presets)[number]) => {
    setSelection({
      ...selection,
      base: p.base,
      addOns: addOns.filter((a) => p.addOnIds.includes(a.id)),
    });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {presets.map((p) => (
          <button
            key={p.name}
            onClick={() => applyPreset(p)}
            className={`border rounded-lg p-4 text-left ${
              selection.base.id === p.base.id && p.addOnIds.every((id) => selection.addOns.some((a) => a.id === id))
                ? "border-brand-300/60 bg-white/5"
                : "border-white/10 bg-slate-950/60"
            }`}
          >
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{p.name}</p>
            <p className="text-lg font-display text-white">{p.base.name}</p>
            <p className="text-slate-400 text-sm">{p.desc}</p>
          </button>
        ))}
      </div>
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Fine tune</p>
        <div className="flex gap-2 flex-wrap">
          {addOns.map((a) => {
            const active = selection.addOns.some((x) => x.id === a.id);
            return (
              <Chip
                key={a.id}
                label={a.name}
                price={formatPrice(a.price)}
                active={active}
                onClick={() =>
                  setSelection({
                    ...selection,
                    addOns: active
                      ? selection.addOns.filter((x) => x.id !== a.id)
                      : [...selection.addOns, a],
                  })
                }
              />
            );
          })}
        </div>
      </div>
      <TotalBar selection={selection} />
    </div>
  );
};

const TimelineDemo: React.FC<{ selection: Selection; setSelection: (s: Selection) => void }> = ({
  selection,
  setSelection,
}) => {
  const phases: { title: string; addOnIds: string[] }[] = [
    { title: "Plan", addOnIds: ["seo"] },
    { title: "Build", addOnIds: ["pages-5", "extra-pages"] },
    { title: "Launch", addOnIds: ["blog", "payments"] },
    { title: "Grow", addOnIds: ["crm-sync", "support"] },
  ];

  const toggle = (id: string) => {
    const addon = addOns.find((a) => a.id === id);
    if (!addon) return;
    const active = selection.addOns.some((x) => x.id === id);
    setSelection({
      ...selection,
      addOns: active ? selection.addOns.filter((x) => x.id !== id) : [...selection.addOns, addon],
    });
  };

  return (
    <div className="space-y-3">
      {phases.map((phase, idx) => (
        <div key={phase.title} className="border border-white/10 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-6 h-6 rounded-full border border-brand-300 text-brand-300 flex items-center justify-center text-xs font-bold">
              {idx + 1}
            </span>
            <p className="text-sm font-semibold text-white">{phase.title}</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {phase.addOnIds.map((id) => {
              const addon = addOns.find((a) => a.id === id)!;
              const active = selection.addOns.some((x) => x.id === id);
              return (
                <Chip
                  key={id}
                  label={addon.name}
                  price={addon.tag === "Monthly" ? `${formatPrice(addon.price)}/mo` : formatPrice(addon.price)}
                  active={active}
                  onClick={() => toggle(id)}
                />
              );
            })}
          </div>
        </div>
      ))}
      <TotalBar selection={selection} />
    </div>
  );
};

const SwipeDeckDemo: React.FC<{ selection: Selection; setSelection: (s: Selection) => void }> = ({
  selection,
  setSelection,
}) => {
  const [index, setIndex] = React.useState(0);
  const { submit, sending, sent, error } = useSubmitQuote(selection);

  const current = addOns[index];
  const handleDecision = (choose: boolean) => {
    if (current) {
      const active = selection.addOns.some((x) => x.id === current.id);
      if (choose && !active) {
        setSelection({ ...selection, addOns: [...selection.addOns, current] });
      }
    }
    setIndex((i) => (i + 1) % addOns.length);
  };

  return (
    <div className="space-y-4">
      <div className="border border-white/10 rounded-lg p-4 min-h-[150px] bg-slate-950/60 flex flex-col justify-between">
        {current ? (
          <>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Add-on card</p>
              <p className="text-xl font-display text-white">{current.name}</p>
              <p className="text-slate-400 text-sm">{current.desc}</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-mono text-brand-300">
                {formatPrice(current.price)}
                {current.tag === "Monthly" ? " / mo" : ""}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDecision(false)}
                  className="px-3 py-2 border border-white/20 text-slate-200 rounded"
                >
                  Skip
                </button>
                <button
                  onClick={() => handleDecision(true)}
                  className="px-3 py-2 bg-brand-300 text-black font-bold rounded"
                >
                  Select
                </button>
              </div>
            </div>
          </>
        ) : (
          <p className="text-slate-400 text-sm">No more cards.</p>
        )}
      </div>
      <TotalBar selection={selection} />
      <div className="space-y-2">
        <input
          type="email"
          value={selection.email}
          onChange={(e) => setSelection({ ...selection, email: e.target.value })}
          placeholder="you@company.com"
          className="w-full bg-transparent border border-white/15 rounded px-3 py-2 text-white focus:outline-none focus:border-brand-300 text-sm"
        />
        {error && <p className="text-sm text-red-300">{error}</p>}
        {sent && <p className="text-sm text-brand-300">Sent.</p>}
        <button
          onClick={submit}
          disabled={sending}
          className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-brand-300 text-black font-bold uppercase tracking-wide rounded hover:bg-brand-400 transition disabled:opacity-50 w-full"
        >
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          Send selection
        </button>
      </div>
    </div>
  );
};

const CompactGridDemo: React.FC<{ selection: Selection; setSelection: (s: Selection) => void }> = ({
  selection,
  setSelection,
}) => {
  const { submit, sending, sent, error } = useSubmitQuote(selection);
  const toggleAddOn = (addon: AddOn) => {
    const active = selection.addOns.some((x) => x.id === addon.id);
    setSelection({
      ...selection,
      addOns: active ? selection.addOns.filter((x) => x.id !== addon.id) : [...selection.addOns, addon],
    });
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {baseOptions.map((b) => (
          <button
            key={b.id}
            onClick={() => setSelection({ ...selection, base: b })}
            className={`p-4 border rounded-lg text-left ${
              selection.base.id === b.id ? "border-brand-300/60 bg-white/5" : "border-white/10 bg-slate-950/60"
            }`}
          >
            <p className="text-sm font-semibold text-white">{b.name}</p>
            <p className="text-xs text-slate-400 mb-1">{b.desc}</p>
            <span className="text-xs font-mono text-brand-300">{formatPrice(b.price)}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {addOns.map((a) => {
          const active = selection.addOns.some((x) => x.id === a.id);
          return (
            <AddOnToggle key={a.id} item={a} active={active} onToggle={() => toggleAddOn(a)} />
          );
        })}
      </div>

      <TotalBar selection={selection} />
      <div className="space-y-2">
        <input
          type="email"
          value={selection.email}
          onChange={(e) => setSelection({ ...selection, email: e.target.value })}
          placeholder="you@company.com"
          className="w-full bg-transparent border border-white/15 rounded px-3 py-2 text-white focus:outline-none focus:border-brand-300 text-sm"
        />
        {error && <p className="text-sm text-red-300">{error}</p>}
        {sent && <p className="text-sm text-brand-300">Sent.</p>}
        <button
          onClick={submit}
          disabled={sending}
          className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-brand-300 text-black font-bold uppercase tracking-wide rounded hover:bg-brand-400 transition disabled:opacity-50 w-full"
        >
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          Send request
        </button>
      </div>
    </div>
  );
};

const CarouselDemo: React.FC<{ selection: Selection; setSelection: (s: Selection) => void }> = ({
  selection,
  setSelection,
}) => {
  const { submit, sending, sent, error } = useSubmitQuote(selection);
  const toggleAddOn = (addon: AddOn) => {
    const active = selection.addOns.some((x) => x.id === addon.id);
    setSelection({
      ...selection,
      addOns: active ? selection.addOns.filter((x) => x.id !== addon.id) : [...selection.addOns, addon],
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2">
        {baseOptions.map((b) => (
          <div
            key={b.id}
            className={`min-w-[240px] p-4 rounded-lg border ${
              selection.base.id === b.id ? "border-brand-300/60 bg-white/5" : "border-white/10 bg-slate-950/60"
            }`}
          >
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Base</p>
            <p className="text-xl font-display text-white">{b.name}</p>
            <p className="text-slate-400 text-sm">{b.desc}</p>
            <div className="flex items-center justify-between mt-3">
              <span className="text-sm font-mono text-brand-300">{formatPrice(b.price)}</span>
              <button
                onClick={() => setSelection({ ...selection, base: b })}
                className="text-xs px-3 py-1 border border-white/20 rounded text-white"
              >
                Choose
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Add-ons</p>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2">
          {addOns.map((a) => {
            const active = selection.addOns.some((x) => x.id === a.id);
            return (
              <Chip
                key={a.id}
                label={a.name}
                price={a.tag === "Monthly" ? `${formatPrice(a.price)}/mo` : formatPrice(a.price)}
                active={active}
                onClick={() => toggleAddOn(a)}
              />
            );
          })}
        </div>
      </div>

      <TotalBar selection={selection} />
      <div className="space-y-2">
        <input
          type="email"
          value={selection.email}
          onChange={(e) => setSelection({ ...selection, email: e.target.value })}
          placeholder="you@company.com"
          className="w-full bg-transparent border border-white/15 rounded px-3 py-2 text-white focus:outline-none focus:border-brand-300 text-sm"
        />
        {error && <p className="text-sm text-red-300">{error}</p>}
        {sent && <p className="text-sm text-brand-300">Sent.</p>}
        <button
          onClick={submit}
          disabled={sending}
          className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-brand-300 text-black font-bold uppercase tracking-wide rounded hover:bg-brand-400 transition disabled:opacity-50 w-full"
        >
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          Send request
        </button>
      </div>
    </div>
  );
};

const MiniBasketDemo: React.FC<{ selection: Selection; setSelection: (s: Selection) => void }> = ({
  selection,
  setSelection,
}) => {
  const { submit, sending, sent, error } = useSubmitQuote(selection);
  const toggleAddOn = (addon: AddOn) => {
    const active = selection.addOns.some((x) => x.id === addon.id);
    setSelection({
      ...selection,
      addOns: active ? selection.addOns.filter((x) => x.id !== addon.id) : [...selection.addOns, addon],
    });
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {baseOptions.map((b) => (
          <Chip
            key={b.id}
            label={b.name}
            price={formatPrice(b.price)}
            active={selection.base.id === b.id}
            onClick={() => setSelection({ ...selection, base: b })}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {addOns.map((a) => {
          const active = selection.addOns.some((x) => x.id === a.id);
          return (
            <div
              key={a.id}
              className={`border rounded-lg p-3 flex items-center justify-between ${
                active ? "border-brand-300/60 bg-white/5" : "border-white/10 bg-slate-950/60"
              }`}
            >
              <div>
                <p className="text-sm font-semibold text-white">{a.name}</p>
                <p className="text-xs text-slate-500">{a.desc}</p>
              </div>
              <button
                onClick={() => toggleAddOn(a)}
                className="w-9 h-9 rounded-full border border-brand-300 text-brand-300 flex items-center justify-center"
              >
                {active ? <Check className="w-4 h-4" /> : "+"}
              </button>
            </div>
          );
        })}
      </div>

      <div className="border border-white/10 rounded-lg p-3 bg-slate-900/70 space-y-2">
        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Selected</p>
        <p className="text-sm text-white">{selection.base.name}</p>
        {selection.addOns.length ? (
          <ul className="space-y-1 text-sm text-slate-300">
            {selection.addOns.map((a) => (
              <li key={a.id} className="flex items-center justify-between">
                <span>{a.name}</span>
                <button
                  onClick={() => toggleAddOn(a)}
                  className="text-xs text-slate-400 hover:text-white border border-white/20 rounded px-2 py-1"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-500 text-sm">No add-ons selected.</p>
        )}
        <TotalBar selection={selection} />
        <div className="space-y-2">
          <input
            type="email"
            value={selection.email}
            onChange={(e) => setSelection({ ...selection, email: e.target.value })}
            placeholder="you@company.com"
            className="w-full bg-transparent border border-white/15 rounded px-3 py-2 text-white focus:outline-none focus:border-brand-300 text-sm"
          />
          {error && <p className="text-sm text-red-300">{error}</p>}
          {sent && <p className="text-sm text-brand-300">Sent.</p>}
          <button
            onClick={submit}
            disabled={sending}
            className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-brand-300 text-black font-bold uppercase tracking-wide rounded hover:bg-brand-400 transition disabled:opacity-50 w-full"
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Send request
          </button>
        </div>
      </div>
    </div>
  );
};

const Section: React.FC<{ title: string; subtitle: string; children: React.ReactNode }> = ({
  title,
  subtitle,
  children,
}) => (
  <section className="p-6 border border-white/10 bg-slate-950/70 rounded-lg space-y-4">
    <div className="flex items-start gap-3">
      <div className="p-2 rounded-full bg-brand-300/10 border border-brand-300/30">
        <Smartphone className="w-5 h-5 text-brand-300" />
      </div>
      <div>
        <h3 className="text-xl font-display font-bold text-white">{title}</h3>
        <p className="text-slate-400 text-sm">{subtitle}</p>
      </div>
    </div>
    {children}
  </section>
);

const QuotePlayground: React.FC = () => {
  const [selection, setSelection] = React.useState<Selection>({
    base: baseOptions[0],
    addOns: [addOns[0], addOns[3]],
    email: "",
    note: "",
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-28 pb-16">
      <div className="max-w-6xl mx-auto px-6 space-y-10">
        <div className="text-center space-y-3">
          <p className="text-brand-300 font-mono text-xs uppercase tracking-[0.28em]">
            Mobile concept playground
          </p>
          <h1 className="text-3xl md:text-4xl font-display font-bold">
            Interactive quote layout ideas
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm">
            These demos are wired to your real quote API. Try them on mobile, choose a favorite, and we’ll keep it.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Section
            title="Stepper with chips"
            subtitle="Three short screens: choose base, pick add-ons, review & send."
          >
            <StepperDemo selection={selection} setSelection={setSelection} />
          </Section>

          <Section
            title="Accordion cards"
            subtitle="Only one base open at a time; add-ons sit inside the expanded card."
          >
            <AccordionDemo selection={selection} setSelection={setSelection} />
          </Section>

          <Section
            title="Bottom sheet"
            subtitle="Base stays fixed; add-ons live in a collapsible sheet with sticky total."
          >
            <BottomSheetDemo selection={selection} setSelection={setSelection} />
          </Section>

          <Section
            title="Tabbed flow"
            subtitle="Three tabs: Base, Extras, Summary. Lightweight per-screen UX."
          >
            <TabbedDemo selection={selection} setSelection={setSelection} />
          </Section>

          <Section
            title="Preset toggles"
            subtitle="Pick a preset (Lean/Lead/Sell), then tweak add-ons with chips."
          >
            <PresetDemo selection={selection} setSelection={setSelection} />
          </Section>

          <Section
            title="Timeline phases"
            subtitle="Phase the work (Plan/Build/Launch/Grow) with focused toggles per phase."
          >
            <TimelineDemo selection={selection} setSelection={setSelection} />
          </Section>

          <Section
            title="Swipe deck"
            subtitle="Card-by-card decisions: skip or select; total updates as you go."
          >
            <SwipeDeckDemo selection={selection} setSelection={setSelection} />
          </Section>

          <Section
            title="Compact grid"
            subtitle="Simple grids for base and add-ons, plus inline send."
          >
            <CompactGridDemo selection={selection} setSelection={setSelection} />
          </Section>

          <Section
            title="Carousel picks"
            subtitle="Swipeable base cards and chip add-ons with quick send."
          >
            <CarouselDemo selection={selection} setSelection={setSelection} />
          </Section>

          <Section
            title="Mini basket"
            subtitle="Grid toggles with a removable basket list before sending."
          >
            <MiniBasketDemo selection={selection} setSelection={setSelection} />
          </Section>
        </div>
      </div>
    </div>
  );
};

export default QuotePlayground;
