import React, { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { ThreadDetail, Message as Msg } from '../types';

type ChatState = {
  open: boolean;
  name: string;
  email: string;
  message: string;
  threadId: string | null;
  loading: boolean;
  error: string | null;
  messages: Msg[];
};

const ChatWidget: React.FC = () => {
  const [state, setState] = useState<ChatState>({
    open: false,
    name: '',
    email: '',
    message: '',
    threadId: null,
    loading: false,
    error: null,
    messages: []
  });

  const [showIdentityForm, setShowIdentityForm] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('chatWidgetState');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setState((s) => ({ ...s, ...parsed, open: false }));
        if (parsed.threadId || (parsed.name && parsed.email)) {
          setShowIdentityForm(false);
        }
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      'chatWidgetState',
      JSON.stringify({
        name: state.name,
        email: state.email,
        threadId: state.threadId,
        messages: state.messages
      })
    );
  }, [state.name, state.email, state.threadId, state.messages]);

  useEffect(() => {
    if (state.threadId && state.email) {
      if (pollRef.current) clearInterval(pollRef.current);
      pollRef.current = setInterval(fetchThreadMessages, 2000);
    }
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.threadId, state.email]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages, state.open]);

  useEffect(() => {
    const updateMobile = () => setIsMobile(window.innerWidth < 640);
    updateMobile();
    window.addEventListener('resize', updateMobile);
    return () => window.removeEventListener('resize', updateMobile);
  }, []);

  const fetchThreadMessages = async () => {
    if (!state.threadId || !state.email) return;
    try {
      const res = await fetch(
        `/api/chatThread?threadId=${encodeURIComponent(state.threadId)}&email=${encodeURIComponent(state.email)}`
      );
      if (!res.ok) return;
      const data: ThreadDetail = await res.json();
      setState((s) => ({ ...s, messages: data.messages || [] }));
    } catch {
      // fail silently
    }
  };

  const sendMessage = async () => {
    if (!state.message.trim() || !state.email.trim() || !state.name.trim()) {
      setState((s) => ({ ...s, error: 'Name, email, and message are required.' }));
      return;
    }
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: state.email,
          name: state.name,
          message: state.message,
          threadId: state.threadId || undefined
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to send');

      setState((s) => ({
        ...s,
        threadId: data.threadId,
        message: ''
      }));
      setShowIdentityForm(false);
      await fetchThreadMessages();
      setTimeout(fetchThreadMessages, 1000);
    } catch (err) {
      setState((s) => ({ ...s, error: err instanceof Error ? err.message : 'Failed to send' }));
    } finally {
      setState((s) => ({ ...s, loading: false }));
    }
  };

  const toggleOpen = () => setState((s) => ({ ...s, open: !s.open }));

  return (
    <>
      <a
        href="https://wa.me/447765718094"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-[100px] right-6 z-40 bg-green-500 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-green-600 transition"
        aria-label="Chat on WhatsApp"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.52 3.48A11.77 11.77 0 0 0 12.06 0C5.45.05.09 5.41.05 12.02c0 2.11.55 4.17 1.6 5.99L0 24l6.17-1.62a11.9 11.9 0 0 0 5.89 1.53h.01c6.62 0 12-5.38 12.01-12.02A11.88 11.88 0 0 0 20.52 3.48ZM12.07 21.3h-.01a9.86 9.86 0 0 1-5.02-1.37l-.36-.22-3.66.96.98-3.56-.24-.37a9.9 9.9 0 0 1-1.52-5.25C2.26 6.49 6.61 2.14 12.05 2.1h.01c2.64 0 5.13 1.03 7 2.9a9.82 9.82 0 0 1 2.92 7.01c0 5.45-4.44 9.89-9.91 9.89Zm5.44-7.44c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15-.2.3-.78.98-.96 1.18-.18.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.8-1.5-1.78-1.68-2.08-.18-.3-.02-.46.14-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.38-.02-.53-.07-.15-.68-1.63-.93-2.24-.24-.58-.48-.5-.68-.5h-.58c-.2 0-.53.08-.8.38-.28.3-1.06 1.04-1.06 2.53 0 1.49 1.1 2.93 1.25 3.13.15.2 2.16 3.3 5.24 4.62.73.32 1.3.51 1.74.65.73.23 1.4.2 1.93.12.59-.09 1.78-.73 2.03-1.44.25-.71.25-1.32.17-1.44-.07-.12-.27-.2-.57-.35Z" />
        </svg>
      </a>
      <button
        onClick={toggleOpen}
        className="fixed bottom-6 right-6 z-40 bg-brand-300 text-black rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-brand-400 transition"
        aria-label="Open chat"
      >
        <MessageCircle size={22} />
      </button>

      {state.open && (
        <div
          className={`fixed z-40 bg-slate-950 border border-white/10 rounded-xl shadow-2xl flex flex-col overflow-hidden ${
            isMobile
              ? 'left-3 right-3 bottom-24 top-[96px] max-h-[60vh]'
              : 'bottom-24 right-6 w-[420px] max-w-[90vw] max-h-[60vh]'
          }`}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-brand-300 font-mono">Chat</p>
              <p className="text-sm text-slate-200">Talk to us — bot + human</p>
            </div>
            <button onClick={toggleOpen} className="text-slate-400 hover:text-white">
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
            {state.messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-[85%] p-3 rounded ${
                  msg.sender_type === 'user'
                    ? 'bg-brand-300 text-black ml-auto'
                    : msg.sender_type === 'bot'
                    ? 'bg-white/5 text-white'
                    : 'bg-white/10 text-white'
                }`}
                style={{ alignSelf: msg.sender_type === 'user' ? 'flex-end' : 'flex-start' }}
              >
                <p className="text-xs uppercase text-slate-800/70 font-semibold mb-1">
                  {msg.sender_type === 'user' ? 'You' : msg.sender_type}
                </p>
                <p className="text-sm whitespace-pre-line">{msg.body}</p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-white/10 p-3 space-y-2">
            {showIdentityForm ? (
              <>
                <input
                  type="text"
                  value={state.name}
                  onChange={(e) => setState((s) => ({ ...s, name: e.target.value }))}
                  placeholder="Name"
                  className="w-full bg-transparent border border-white/10 rounded px-3 py-2 text-base md:text-sm focus:outline-none"
                />
                <input
                  type="email"
                  value={state.email}
                  onChange={(e) => setState((s) => ({ ...s, email: e.target.value }))}
                  placeholder="Email"
                  className="w-full bg-transparent border border-white/10 rounded px-3 py-2 text-base md:text-sm focus:outline-none"
                />
              </>
            ) : (
              <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded px-3 py-2 text-xs text-slate-300">
                <div>
                  <p className="font-semibold text-white">{state.name}</p>
                  <p className="text-slate-400">{state.email}</p>
                </div>
                <button
                  onClick={() => setShowIdentityForm(true)}
                  className="text-brand-300 hover:text-brand-200 text-xs underline"
                >
                  Change
                </button>
              </div>
            )}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={state.message}
                onChange={(e) => setState((s) => ({ ...s, message: e.target.value }))}
                placeholder="Type your message..."
                className="flex-1 bg-transparent border border-white/10 rounded px-3 py-2 text-base md:text-sm focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <button
                onClick={sendMessage}
                disabled={state.loading}
                className="bg-brand-300 text-black rounded px-3 py-2 hover:bg-brand-400 transition disabled:opacity-60"
              >
                <Send size={16} />
              </button>
            </div>
            {state.error && <p className="text-xs text-red-300">{state.error}</p>}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
