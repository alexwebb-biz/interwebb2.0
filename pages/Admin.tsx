import React, { useEffect, useState } from 'react';
import { Shield, Send, Mail, MessageCircle, RefreshCw, Lock, Save } from 'lucide-react';
import { ThreadSummary, ThreadDetail } from '../types';
import { PackageTier } from '../data/pricing';
import { MainOption, AddOn } from '../data/quoteOptions';

const storedToken = typeof window !== 'undefined' ? localStorage.getItem('adminToken') || '' : '';

const Admin: React.FC = () => {
  const [tokenInput, setTokenInput] = useState<string>(storedToken);
  const [token, setToken] = useState<string | null>(null);
  const [authed, setAuthed] = useState<boolean>(false);
  const [checkingToken, setCheckingToken] = useState<boolean>(!!storedToken);
  const [threads, setThreads] = useState<ThreadSummary[]>([]);
  const [selectedThread, setSelectedThread] = useState<ThreadDetail | null>(null);
  const [loadingThreads, setLoadingThreads] = useState(false);
  const [loadingThread, setLoadingThread] = useState(false);
  const [composer, setComposer] = useState('');
  const [sendEmail, setSendEmail] = useState(true);
  const [sendChat, setSendChat] = useState(false);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [pricing, setPricing] = useState<PackageTier[]>([]);
  const [pricingLoading, setPricingLoading] = useState(false);
  const [pricingStatus, setPricingStatus] = useState<string | null>(null);
  const [quotePackages, setQuotePackages] = useState<MainOption[]>([]);
  const [quoteAddons, setQuoteAddons] = useState<AddOn[]>([]);
  const [quoteStatus, setQuoteStatus] = useState<string | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const updateTier = (index: number, patch: Partial<PackageTier>) => {
    setPricing((prev) =>
      prev.map((tier, i) => (i === index ? { ...tier, ...patch } : tier))
    );
  };
  const addTier = () => {
    setPricing((prev) => [
      ...prev,
      {
        slug: `tier-${prev.length + 1}`,
        name: "New Tier",
        price: 0,
        description: "",
        features: [],
        highlight: false
      }
    ]);
  };

  const updateQuotePackage = (index: number, patch: Partial<MainOption>) => {
    setQuotePackages((prev) => prev.map((p, i) => (i === index ? { ...p, ...patch } : p)));
  };

  const addQuotePackage = () => {
    setQuotePackages((prev) => [
      ...prev,
      {
        id: `package-${prev.length + 1}`,
        name: "New Package",
        desc: "",
        basePrice: 0,
        tag: "",
      },
    ]);
  };

  const removeQuotePackage = (id: string) => {
    setQuotePackages((prev) => prev.filter((p) => p.id !== id));
    setQuoteAddons((prev) => prev.map((a) => ({ ...a, appliesTo: (a.appliesTo || []).filter((pid) => pid !== id) })));
  };

  const updateQuoteAddon = (index: number, patch: Partial<AddOn>) => {
    setQuoteAddons((prev) => prev.map((a, i) => (i === index ? { ...a, ...patch } : a)));
  };

  const addQuoteAddon = () => {
    setQuoteAddons((prev) => [
      ...prev,
      {
        id: `addon-${prev.length + 1}`,
        name: "New Add-on",
        desc: "",
        price: 0,
        group: "Quick boosts",
        tag: "",
        appliesTo: [],
      },
    ]);
  };

  const removeQuoteAddon = (id: string) => {
    setQuoteAddons((prev) => prev.filter((a) => a.id !== id));
  };

  const headers = token
    ? {
        Authorization: `Bearer ${token}`
      }
    : {};

  const fetchThreads = async (candidateToken?: string) => {
    const activeToken = candidateToken || token;
    if (!activeToken) return;
    setLoadingThreads(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/threads?search=${encodeURIComponent(search)}`, {
        headers: { Authorization: `Bearer ${activeToken}` }
      });
      if (!res.ok) throw new Error('Unable to load threads');
      const data = await res.json();
      setThreads(data.threads || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load threads');
    } finally {
      setLoadingThreads(false);
    }
  };

  const fetchThread = async (threadId: string) => {
    if (!token) return;
    setLoadingThread(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/threads?threadId=${threadId}`, { headers });
      if (!res.ok) throw new Error('Unable to load thread');
      const data = await res.json();
      setSelectedThread(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load thread');
    } finally {
      setLoadingThread(false);
    }
  };

  const loadPricing = async () => {
    setPricingLoading(true);
    setPricingStatus(null);
    try {
      const res = await fetch('/api/pricing');
      if (!res.ok) throw new Error('Unable to load pricing');
      const data = await res.json();
      if (Array.isArray(data?.tiers)) {
        setPricing(
          data.tiers.map((t: any) => ({
            slug: t.slug,
            name: t.name,
            price: Number(t.price || 0),
            description: t.description,
            features: Array.isArray(t.features) ? t.features : [],
            highlight: !!t.highlight
          }))
        );
      }
    } catch (err) {
      setPricingStatus(err instanceof Error ? err.message : 'Failed to load pricing');
    } finally {
      setPricingLoading(false);
    }
  };

  const savePricing = async () => {
    if (!token) return;
    setPricingLoading(true);
    setPricingStatus(null);
    try {
      const payload = {
        tiers: pricing.map((p) => ({
          ...p,
          features: Array.isArray(p.features)
            ? p.features
            : (p.features as unknown as string)
                .split(',')
                .map((f) => f.trim())
                .filter(Boolean)
        }))
      };

      const res = await fetch('/api/pricing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'Failed to save pricing');
      }
      const data = await res.json();
      if (Array.isArray(data?.tiers)) {
        setPricing(
          data.tiers.map((t: any) => ({
            slug: t.slug,
            name: t.name,
            price: Number(t.price || 0),
            description: t.description,
            features: Array.isArray(t.features) ? t.features : [],
            highlight: !!t.highlight
          }))
        );
      }
      setPricingStatus('Pricing saved');
    } catch (err) {
      setPricingStatus(err instanceof Error ? err.message : 'Failed to save pricing');
    } finally {
      setPricingLoading(false);
    }
  };

  const loadQuoteOptions = async () => {
    setQuoteLoading(true);
    setQuoteStatus(null);
    try {
      const res = await fetch('/api/quote-options');
      if (!res.ok) throw new Error('Unable to load quote options');
      const data = await res.json();
      if (Array.isArray(data?.packages)) {
        setQuotePackages(
          data.packages.map((p: any) => ({
            id: p.id,
            name: p.name,
            desc: p.desc,
            basePrice: Number(p.basePrice ?? p.base_price ?? 0),
            tag: p.tag || "",
          }))
        );
      }
      if (Array.isArray(data?.addons)) {
        setQuoteAddons(
          data.addons.map((a: any) => ({
            id: a.id,
            name: a.name,
            desc: a.desc,
            price: Number(a.price ?? 0),
            tag: a.tag || "",
            appliesTo: Array.isArray(a.appliesTo || a.applies_to) ? (a.appliesTo || a.applies_to) : [],
            group: a.group || a.group_name || "Other",
          }))
        );
      }
    } catch (err) {
      setQuoteStatus(err instanceof Error ? err.message : 'Failed to load quote options');
    } finally {
      setQuoteLoading(false);
    }
  };

  const saveQuoteOptions = async () => {
    if (!token) return;
    setQuoteLoading(true);
    setQuoteStatus(null);
    try {
      const payload = {
        packages: quotePackages,
        addons: quoteAddons.map((a) => ({
          ...a,
          appliesTo: Array.isArray(a.appliesTo) ? a.appliesTo : [],
        })),
      };

      const res = await fetch('/api/quote-options', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'Failed to save quote options');
      }
      const data = await res.json();
      if (Array.isArray(data?.packages)) {
        setQuotePackages(
          data.packages.map((p: any) => ({
            id: p.id,
            name: p.name,
            desc: p.desc,
            basePrice: Number(p.basePrice ?? p.base_price ?? 0),
            tag: p.tag || "",
          }))
        );
      }
      if (Array.isArray(data?.addons)) {
        setQuoteAddons(
          data.addons.map((a: any) => ({
            id: a.id,
            name: a.name,
            desc: a.desc,
            price: Number(a.price ?? 0),
            tag: a.tag || "",
            appliesTo: Array.isArray(a.appliesTo || a.applies_to) ? (a.appliesTo || a.applies_to) : [],
            group: a.group || a.group_name || "Other",
          }))
        );
      }
      setQuoteStatus('Quote options saved');
    } catch (err) {
      setQuoteStatus(err instanceof Error ? err.message : 'Failed to save quote options');
    } finally {
      setQuoteLoading(false);
    }
  };

  const sendReply = async () => {
    if (!selectedThread?.thread?.id || !composer.trim()) return;
    setError(null);
    try {
      const res = await fetch('/api/admin/threads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify({
          threadId: selectedThread.thread.id,
          message: composer,
          channel: sendChat && sendEmail ? 'both' : sendChat ? 'chat' : 'email',
          toEmail: selectedThread.thread.user_email,
          toName: selectedThread.thread.user_name,
          sendEmail
        })
      });

      if (!res.ok) throw new Error('Failed to send message');
      setComposer('');
      await fetchThread(selectedThread.thread.id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    }
  };

  const attemptLogin = async (candidateToken: string) => {
    setCheckingToken(true);
    setLoginError(null);
    try {
      const res = await fetch('/api/admin/threads?limit=1', {
        headers: { Authorization: `Bearer ${candidateToken}` }
      });
      if (!res.ok) throw new Error('Invalid token or unauthorized');
      setAuthed(true);
      setToken(candidateToken);
      localStorage.setItem('adminToken', candidateToken);
      await fetchThreads(candidateToken);
    } catch (err) {
      setAuthed(false);
      setToken(null);
      setLoginError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setCheckingToken(false);
    }
  };

  useEffect(() => {
    if (storedToken) {
      attemptLogin(storedToken);
    } else {
      setCheckingToken(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (authed) {
      loadPricing();
      loadQuoteOptions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed]);

  if (!authed) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white/5 border border-white/10 rounded p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-brand-300/10 flex items-center justify-center border border-brand-300/40">
              <Lock className="text-brand-300" size={18} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-brand-300 font-mono">Restricted</p>
              <h1 className="text-xl font-display font-bold">Admin login</h1>
            </div>
          </div>
          <p className="text-sm text-slate-400 mb-4">
            Enter the admin token to access the inbox. This route is locked and requires authentication.
          </p>
          <input
            type="password"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="Admin token"
            className="w-full bg-transparent border border-white/10 rounded px-3 py-2 focus:outline-none mb-3"
          />
          {loginError && <p className="text-sm text-red-300 mb-3">{loginError}</p>}
          <button
            onClick={() => attemptLogin(tokenInput)}
            disabled={checkingToken || !tokenInput}
            className="w-full py-3 bg-brand-300 text-black font-semibold rounded hover:bg-brand-400 transition disabled:opacity-50"
          >
            {checkingToken ? 'Verifying...' : 'Login'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-brand-300 font-mono mb-2">Admin Console</p>
            <h1 className="text-4xl font-display font-bold">Inbox & Chat</h1>
          </div>
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded">
            <Shield size={16} className="text-brand-300" />
            <p className="text-xs text-slate-400">Authenticated</p>
          </div>
        </div>

        {error && <div className="mb-4 text-sm text-red-300">{error}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white/5 border border-white/10 rounded p-4">
            <div className="flex items-center gap-2 mb-4">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search email or name"
                className="w-full bg-transparent border-b border-white/10 pb-2 focus:outline-none"
              />
              <button
                onClick={fetchThreads}
                className="p-2 hover:bg-white/10 rounded border border-white/10"
                title="Refresh"
              >
                <RefreshCw size={16} />
              </button>
            </div>
            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
              {loadingThreads && <p className="text-sm text-slate-400">Loading threads...</p>}
              {!loadingThreads && threads.length === 0 && <p className="text-sm text-slate-400">No threads yet.</p>}
              {threads.map((thread) => (
                <button
                  key={thread.id}
                  onClick={() => fetchThread(thread.id)}
                  className={`w-full text-left p-3 rounded border ${
                    selectedThread?.thread?.id === thread.id ? 'border-brand-300 bg-brand-300/10' : 'border-white/10'
                  } hover:border-brand-300/60 transition`}
                >
                  <p className="text-sm font-semibold">{thread.user_name || 'Unknown contact'}</p>
                  <p className="text-xs text-slate-400">{thread.user_email}</p>
                  <p className="text-[11px] uppercase text-slate-500 mt-1">Status: {thread.status || 'open'}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded p-6 flex flex-col min-h-[70vh]">
            {loadingThread && <p className="text-sm text-slate-400">Loading conversation...</p>}
            {!selectedThread && !loadingThread && (
              <p className="text-sm text-slate-400">Select a thread to view the conversation.</p>
            )}
            {selectedThread && (
              <>
                <div className="mb-4 border-b border-white/5 pb-3">
                  <p className="text-sm text-slate-400">
                    {selectedThread.thread?.user_name} · {selectedThread.thread?.user_email}
                  </p>
                  <p className="text-xl font-semibold">{selectedThread.thread?.subject}</p>
                  <p className="text-xs uppercase text-slate-500 mt-1">
                    Channel: {selectedThread.thread?.preferred_channel || 'email'}
                  </p>
                </div>
                <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                  {selectedThread.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-3 rounded border border-white/10 ${
                        msg.sender_type === 'admin'
                          ? 'bg-brand-300/10 border-brand-300/40'
                          : msg.sender_type === 'bot'
                          ? 'bg-white/5 border-white/20'
                          : 'bg-white/5'
                      }`}
                    >
                      <div className="flex items-center gap-2 text-xs uppercase text-slate-500 mb-1">
                        {msg.channel === 'email' ? <Mail size={14} /> : <MessageCircle size={14} />}
                        <span>{msg.sender_type}</span>
                        {msg.created_at && <span className="text-slate-600">{new Date(msg.created_at).toLocaleString()}</span>}
                      </div>
                      <p className="text-sm whitespace-pre-line leading-relaxed">{msg.body}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <textarea
                    rows={3}
                    value={composer}
                    onChange={(e) => setComposer(e.target.value)}
                    placeholder="Type your reply..."
                    className="w-full bg-transparent border border-white/10 rounded p-3 focus:outline-none"
                  />
                  <div className="flex items-center gap-4 mt-2 text-sm text-slate-300">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sendEmail}
                        onChange={(e) => setSendEmail(e.target.checked)}
                        className="accent-brand-300"
                      />
                      Send via email
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sendChat}
                        onChange={(e) => setSendChat(e.target.checked)}
                        className="accent-brand-300"
                      />
                      Send to chat widget
                    </label>
                  </div>
                  <div className="flex justify-end mt-2">
                    <button
                      onClick={sendReply}
                      disabled={!composer.trim()}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-brand-300 text-black font-semibold rounded hover:bg-brand-400 transition disabled:opacity-50"
                    >
                      <Send size={16} />
                      Send reply
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-10 mt-10">
      <div className="max-w-4xl bg-white/5 border border-white/10 rounded p-6 mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-brand-300 font-mono mb-1">Pricing</p>
            <h2 className="text-2xl font-display font-bold">Manage tiers</h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={addTier}
              className="text-sm px-3 py-2 border border-white/15 rounded hover:border-brand-300 hover:text-brand-300 transition"
            >
              Add tier
            </button>
            <button
              onClick={savePricing}
              disabled={pricingLoading || !pricing.length || !token}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-300 text-black font-semibold rounded hover:bg-brand-400 transition disabled:opacity-50"
            >
              <Save size={16} />
              Save pricing
            </button>
          </div>
        </div>
        {pricingStatus && <p className="text-sm mb-3 text-slate-300">{pricingStatus}</p>}
        {pricingLoading && <p className="text-sm text-slate-400 mb-3">Loading...</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pricing.map((tier, idx) => {
            const featuresText = Array.isArray(tier.features) ? tier.features.join(", ") : "";
            return (
              <div key={tier.slug || idx} className="border border-white/10 rounded p-4 space-y-3 bg-slate-950/60">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label className="text-xs text-slate-500 uppercase block mb-1">Name</label>
                    <input
                      value={tier.name}
                      onChange={(e) => updateTier(idx, { name: e.target.value })}
                      className="w-full bg-transparent border border-white/10 rounded px-3 py-2 text-sm focus:outline-none"
                    />
                  </div>
                  <div className="w-28">
                    <label className="text-xs text-slate-500 uppercase block mb-1">Slug</label>
                    <input
                      value={tier.slug}
                      onChange={(e) => updateTier(idx, { slug: e.target.value })}
                      className="w-full bg-transparent border border-white/10 rounded px-3 py-2 text-sm focus:outline-none"
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-28">
                    <label className="text-xs text-slate-500 uppercase block mb-1">Price</label>
                    <input
                      type="number"
                      value={tier.price}
                      onChange={(e) => updateTier(idx, { price: Number(e.target.value) || 0 })}
                      className="w-full bg-transparent border border-white/10 rounded px-3 py-2 text-sm focus:outline-none"
                    />
                  </div>
                  <label className="flex items-center gap-2 text-sm text-slate-300">
                    <input
                      type="checkbox"
                      checked={!!tier.highlight}
                      onChange={(e) => updateTier(idx, { highlight: e.target.checked })}
                      className="accent-brand-300"
                    />
                    Highlight
                  </label>
                </div>
                <div>
                  <label className="text-xs text-slate-500 uppercase block mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={tier.description}
                    onChange={(e) => updateTier(idx, { description: e.target.value })}
                    className="w-full bg-transparent border border-white/10 rounded px-3 py-2 text-sm focus:outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 uppercase block mb-1">Features (comma separated)</label>
                  <input
                    value={featuresText}
                    onChange={(e) =>
                      updateTier(idx, {
                        features: e.target.value
                          .split(",")
                          .map((f) => f.trim())
                          .filter(Boolean)
                      })
                    }
                    className="w-full bg-transparent border border-white/10 rounded px-3 py-2 text-sm focus:outline-none"
                  />
                </div>
                {pricing.length > 1 && (
                  <div className="flex justify-end">
                    <button
                      onClick={() => setPricing((prev) => prev.filter((_, i) => i !== idx))}
                      className="text-xs text-red-300 hover:text-red-200"
                    >
                      Remove tier
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="max-w-6xl bg-white/5 border border-white/10 rounded p-6 mx-auto">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-brand-300 font-mono mb-1">Quote builder</p>
            <h2 className="text-2xl font-display font-bold">Packages & add-ons</h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={addQuotePackage}
              className="text-sm px-3 py-2 border border-white/15 rounded hover:border-brand-300 hover:text-brand-300 transition"
            >
              Add package
            </button>
            <button
              onClick={addQuoteAddon}
              className="text-sm px-3 py-2 border border-white/15 rounded hover:border-brand-300 hover:text-brand-300 transition"
            >
              Add add-on
            </button>
            <button
              onClick={saveQuoteOptions}
              disabled={quoteLoading || (!quotePackages.length && !quoteAddons.length) || !token}
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-300 text-black font-semibold rounded hover:bg-brand-400 transition disabled:opacity-50"
            >
              <Save size={16} />
              Save quote options
            </button>
          </div>
        </div>
        {quoteStatus && <p className="text-sm mb-3 text-slate-300">{quoteStatus}</p>}
        {quoteLoading && <p className="text-sm text-slate-400 mb-3">Loading...</p>}

        <div className="space-y-6">
          <h3 className="text-sm uppercase tracking-[0.18em] text-slate-400">Packages (with assigned add-ons)</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {quotePackages.map((pkg, idx) => {
              const assigned = quoteAddons.filter((a) => (a.appliesTo || []).includes(pkg.id));
              const availableToAdd = quoteAddons.filter((a) => !(a.appliesTo || []).includes(pkg.id));
              return (
                <div key={pkg.id} className="border border-white/10 rounded p-4 space-y-3 bg-slate-950/60">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1">
                      <label className="text-xs text-slate-500 uppercase block mb-1">Name</label>
                      <input
                        value={pkg.name}
                        onChange={(e) => updateQuotePackage(idx, { name: e.target.value })}
                        className="w-full bg-transparent border border-white/10 rounded px-3 py-2 text-sm focus:outline-none"
                      />
                    </div>
                    <div className="w-24">
                      <label className="text-xs text-slate-500 uppercase block mb-1">ID</label>
                      <input
                        value={pkg.id}
                        onChange={(e) => updateQuotePackage(idx, { id: e.target.value })}
                        className="w-full bg-transparent border border-white/10 rounded px-2 py-2 text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 items-center">
                    <div className="w-24">
                      <label className="text-xs text-slate-500 uppercase block mb-1">Base</label>
                      <input
                        type="number"
                        value={pkg.basePrice}
                        onChange={(e) => updateQuotePackage(idx, { basePrice: Number(e.target.value) || 0 })}
                        className="w-full bg-transparent border border-white/10 rounded px-2 py-2 text-xs focus:outline-none"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs text-slate-500 uppercase block mb-1">Tag</label>
                      <input
                        value={pkg.tag || ''}
                        onChange={(e) => updateQuotePackage(idx, { tag: e.target.value })}
                        className="w-full bg-transparent border border-white/10 rounded px-2 py-2 text-xs focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 uppercase block mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={pkg.desc}
                      onChange={(e) => updateQuotePackage(idx, { desc: e.target.value })}
                      className="w-full bg-transparent border border-white/10 rounded px-3 py-2 text-sm focus:outline-none resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 uppercase block mb-2">Add-ons for this package</label>
                    <div className="space-y-2">
                      {assigned.map((addon) => (
                        <div key={addon.id} className="flex items-center justify-between text-sm border border-white/10 rounded px-2 py-1">
                          <span className="truncate">{addon.name}</span>
                          <button
                            onClick={() =>
                              removeQuoteAddon(pkg.id + "_" + addon.id) || // placeholder to satisfy TS
                              setQuoteAddons((prev) =>
                                prev.map((a) =>
                                  a.id === addon.id
                                    ? { ...a, appliesTo: (a.appliesTo || []).filter((p) => p !== pkg.id) }
                                    : a
                                )
                              )
                            }
                            className="text-xs text-red-300 hover:text-red-200"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      {!assigned.length && <p className="text-xs text-slate-500">No add-ons assigned.</p>}
                    </div>
                    {availableToAdd.length > 0 && (
                      <div className="mt-2">
                        <label className="text-xs text-slate-500 uppercase block mb-1">Attach add-on</label>
                        <select
                          className="w-full bg-slate-900 border border-white/10 rounded px-2 py-2 text-sm text-white focus:outline-none"
                          defaultValue=""
                          onChange={(e) => {
                            const addonId = e.target.value;
                            if (!addonId) return;
                            setQuoteAddons((prev) =>
                              prev.map((a) =>
                                a.id === addonId
                                  ? { ...a, appliesTo: Array.from(new Set([...(a.appliesTo || []), pkg.id])) }
                                  : a
                              )
                            );
                            e.target.value = "";
                          }}
                        >
                          <option value="">Select add-on</option>
                          {availableToAdd.map((a) => (
                            <option key={a.id} value={a.id}>
                              {a.name} ({a.group || "Ungrouped"})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => removeQuotePackage(pkg.id)}
                      className="text-xs text-red-300 hover:text-red-200"
                    >
                      Remove package
                    </button>
                  </div>
                </div>
              );
            })}
            {!quotePackages.length && <p className="text-sm text-slate-400">No packages yet.</p>}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm uppercase tracking-[0.18em] text-slate-400">Add-ons catalog</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {quoteAddons.map((addon, idx) => (
                <div key={addon.id} className="border border-white/10 rounded p-3 space-y-2 bg-slate-950/60">
                  <div className="flex gap-2">
                    <input
                      value={addon.name}
                      onChange={(e) => updateQuoteAddon(idx, { name: e.target.value })}
                      className="flex-1 bg-transparent border border-white/10 rounded px-2 py-1 text-sm focus:outline-none"
                    />
                    <input
                      value={addon.id}
                      onChange={(e) => updateQuoteAddon(idx, { id: e.target.value })}
                      className="w-28 bg-transparent border border-white/10 rounded px-2 py-1 text-xs focus:outline-none"
                    />
                  </div>
                  <div className="flex gap-2 items-center">
                    <input
                      type="number"
                      value={addon.price}
                      onChange={(e) => updateQuoteAddon(idx, { price: Number(e.target.value) || 0 })}
                      className="w-24 bg-transparent border border-white/10 rounded px-2 py-1 text-sm focus:outline-none"
                    />
                    <input
                      value={addon.group}
                      onChange={(e) => updateQuoteAddon(idx, { group: e.target.value })}
                      className="flex-1 bg-transparent border border-white/10 rounded px-2 py-1 text-sm focus:outline-none"
                      placeholder="Group"
                    />
                    <input
                      value={addon.tag || ''}
                      onChange={(e) => updateQuoteAddon(idx, { tag: e.target.value })}
                      className="w-24 bg-transparent border border-white/10 rounded px-2 py-1 text-xs focus:outline-none"
                      placeholder="Tag"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 uppercase block mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={addon.desc}
                      onChange={(e) => updateQuoteAddon(idx, { desc: e.target.value })}
                      className="w-full bg-transparent border border-white/10 rounded px-2 py-2 text-sm focus:outline-none resize-none"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] text-slate-500">
                      Applies to: {(addon.appliesTo || []).join(', ') || 'None'}
                    </span>
                    <button
                      onClick={() => removeQuoteAddon(addon.id)}
                      className="text-xs text-red-300 hover:text-red-200"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {!quoteAddons.length && <p className="text-sm text-slate-400">No add-ons yet.</p>}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Admin;
