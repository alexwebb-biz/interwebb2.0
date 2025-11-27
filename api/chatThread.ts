import { getThreadWithMessages } from '../lib/inbox.js';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const threadId = req.query?.threadId as string | undefined;
  const email = req.query?.email as string | undefined;

  if (!threadId || !email) {
    res.status(400).json({ error: 'threadId and email are required' });
    return;
  }

  try {
    const data = await getThreadWithMessages(threadId);
    if (!data.thread) {
      res.status(404).json({ error: 'Thread not found' });
      return;
    }
    if ((data.thread.user_email || '').toLowerCase() !== email.toLowerCase()) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    res.status(200).json(data);
  } catch (err) {
    console.error('Chat thread GET error', err);
    res.status(500).json({ error: 'Failed to fetch thread' });
  }
}
