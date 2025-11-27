import React, { useEffect, useState } from 'react';
import { Shield, Send, Mail, MessageCircle, RefreshCw, Lock } from 'lucide-react';
import { ThreadSummary, ThreadDetail } from '../types';

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
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);

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
          channel: 'email',
          toEmail: selectedThread.thread.user_email,
          toName: selectedThread.thread.user_name
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
      <div className="max-w-7xl mx-auto px-6">
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
    </div>
  );
};

export default Admin;
