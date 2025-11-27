import { ReactNode } from 'react';

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatarUrl: string;
}

export interface ThreadSummary {
  id: string;
  user_email: string;
  user_name?: string;
  subject?: string;
  status?: string;
  preferred_channel?: string;
  last_activity?: string;
}

export interface Message {
  id: string;
  sender_type: 'user' | 'admin' | 'bot' | 'system';
  channel: 'email' | 'chat';
  body: string;
  metadata?: Record<string, any>;
  created_at?: string;
}

export interface ThreadDetail {
  thread: ThreadSummary | null;
  messages: Message[];
}
