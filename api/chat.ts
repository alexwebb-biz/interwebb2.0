import { upsertThread, insertMessage } from '../lib/inbox.js';

const generateBotReply = async (prompt: string) => {
  // Placeholder bot logic; replace with a real LLM call.
  return `Thanks for the details. Here's a quick note while the team reviews: ${prompt.slice(0, 120)}...`;
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
  const { email, name, threadId: incomingThreadId, message } = body;

  if (!message || (!email && !incomingThreadId)) {
    res.status(400).json({ error: 'message and email or threadId are required' });
    return;
  }

  try {
    const threadId =
      incomingThreadId ||
      (await upsertThread({
        userEmail: email,
        userName: name,
        subject: `Chat from ${name || email}`,
        status: 'open',
        preferredChannel: 'chat'
      }));

    await insertMessage({
      threadId,
      senderType: 'user',
      channel: 'chat',
      body: message
    });

    const botReply = await generateBotReply(message);

    await insertMessage({
      threadId,
      senderType: 'bot',
      channel: 'chat',
      body: botReply
    });

    res.status(200).json({ threadId, reply: botReply });
  } catch (err) {
    console.error('Chat API error', err);
    res.status(500).json({ error: 'Failed to handle chat message' });
  }
}
