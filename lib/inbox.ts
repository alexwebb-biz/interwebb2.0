import { randomUUID } from 'crypto';
import { withDb } from './db.js';

type ThreadParams = {
  userEmail: string;
  userName?: string;
  subject?: string;
  status?: string;
  preferredChannel?: 'email' | 'chat';
  metadata?: Record<string, any>;
};

type MessageParams = {
  threadId: string;
  senderType: 'user' | 'admin' | 'bot' | 'system';
  channel: 'email' | 'chat';
  body: string;
  metadata?: Record<string, any>;
};

export const upsertThread = async (params: ThreadParams): Promise<string> => {
  const {
    userEmail,
    userName = null,
    subject = 'Contact form',
    status = 'open',
    preferredChannel = 'email',
    metadata = {}
  } = params;

  return withDb(async (db) => {
    const existing = await db.query('select id from threads where user_email = $1 order by created_at desc limit 1', [
      userEmail
    ]);

    if (existing.rows[0]?.id) {
      const threadId = existing.rows[0].id as string;
      await db.query(
        'update threads set user_name = coalesce($2, user_name), subject = coalesce($3, subject), status = $4, preferred_channel = $5, last_activity = now() where id = $1',
        [threadId, userName, subject, status, preferredChannel]
      );
      return threadId;
    }

    const newId = randomUUID();
    await db.query(
      'insert into threads (id, user_email, user_name, subject, status, preferred_channel, metadata, last_activity) values ($1, $2, $3, $4, $5, $6, $7::jsonb, now())',
      [newId, userEmail, userName, subject, status, preferredChannel, JSON.stringify(metadata)]
    );

    return newId;
  });
};

export const insertMessage = async (params: MessageParams) => {
  const { threadId, senderType, channel, body, metadata = {} } = params;

  return withDb(async (db) => {
    const res = await db.query(
      'insert into messages (id, thread_id, sender_type, channel, body, metadata) values ($1, $2, $3, $4, $5, $6::jsonb) returning *',
      [randomUUID(), threadId, senderType, channel, body, JSON.stringify(metadata)]
    );

    await db.query('update threads set last_activity = now() where id = $1', [threadId]);
    return res.rows[0];
  });
};

export const listThreads = async (opts: { status?: string; search?: string; limit?: number; offset?: number }) => {
  const { status, search, limit = 20, offset = 0 } = opts;
  return withDb(async (db) => {
    const conditions: string[] = [];
    const values: any[] = [];

    if (status) {
      conditions.push(`status = $${conditions.length + 1}`);
      values.push(status);
    }

    if (search) {
      conditions.push(`(user_email ilike $${conditions.length + 1} or user_name ilike $${conditions.length + 1})`);
      values.push(`%${search}%`);
    }

    const where = conditions.length ? `where ${conditions.join(' and ')}` : '';
    const query = `
      select id, user_email, user_name, subject, status, preferred_channel, last_activity
      from threads
      ${where}
      order by last_activity desc
      limit ${limit} offset ${offset}
    `;

    const res = await db.query(query, values);
    return res.rows;
  });
};

export const getThreadWithMessages = async (threadId: string) => {
  return withDb(async (db) => {
    const threadRes = await db.query(
      'select id, user_email, user_name, subject, status, preferred_channel, metadata, last_activity from threads where id = $1 limit 1',
      [threadId]
    );

    const messagesRes = await db.query(
      'select id, sender_type, channel, body, metadata, created_at from messages where thread_id = $1 order by created_at asc',
      [threadId]
    );

    return {
      thread: threadRes.rows[0] || null,
      messages: messagesRes.rows
    };
  });
};
