// src/controllers/chat.socket.ts
import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage } from 'http';
import { randomUUID } from 'crypto';
import { runPortfolioAgent } from '../services/gemini.service';

// Initialize a decoupled WebSocket Server (no port or server assigned yet)
const chatWss = new WebSocketServer({ 
  noServer: true,
  verifyClient: (info, cb) => {
    const origin = info.origin || info.req.headers.origin || '';
    const allowed = ['http://localhost:4200', 'http://localhost:3000'];

    if (allowed.includes(origin)) {
      cb(true);
    } else {
      cb(false, 403, 'Forbidden');
    }
  }
});

const liveSessions = new Map<string, any>();

chatWss.on('connection', async (ws: WebSocket, request: IncomingMessage) => {
  const connectionId = randomUUID();
  console.log('New client connected', connectionId);

  ws.send(JSON.stringify({ type: 'SYSTEM', message: 'Welcome to the chat, anonymous!' }));
  ws.send(JSON.stringify({ type: 'WELCOME', 
    message: 
`Neural link established.

You've connected to Eva.

Think of me as a digital assistant trained on Pranay's experience, projects, technical decisions, and engineering journey.

Whether you're a recruiter, client, founder, or fellow developer, I can help you navigate his professional universe.

What would you like to know?`, connectionId }));

  try {
    const geminiSession = await runPortfolioAgent(
      connectionId,
      (textChunk) => {
        ws.send(JSON.stringify({ type: 'TEXT_CHUNK', text: textChunk }));
      },
      (step, detail) => {
        ws.send(JSON.stringify({ type: 'AGENT_STEP', step, detail }));
      },
      () => {
        ws.send(JSON.stringify({ type: 'TURN_COMPLETE' }));
      }
    );

    liveSessions.set(connectionId, geminiSession);
  } catch (error: any) {
    console.error(`Failed to start Gemini Live for ${connectionId}:`, error);
    ws.send(JSON.stringify({ type: 'ERROR', message: 'Could not connect to Gemini Live engine.' }));
    ws.close();
    return;
  }

  ws.on('message', (message: string) => {
    try {
      const data = JSON.parse(message.toString());

      if (data?.type === 'USER_MESSAGE' && typeof data.text === 'string') {
        const session = liveSessions.get(connectionId);
        if (!session) {
          ws.send(JSON.stringify({ type: 'ERROR', message: 'No active Gemini session for this connection.' }));
          return;
        }

        session.sendClientContent({
          turns: [
            {
              role: 'user',
              parts: [{ text: data.text }],
            },
          ],
          turnComplete: true,
        });
        return;
      }

      ws.send(JSON.stringify({ type: 'ERROR', message: 'Unsupported message type.' }));
    } catch (error) {
      console.error('WebSocket parse error:', error);
      ws.send(JSON.stringify({ type: 'ERROR', message: 'Invalid JSON format' }));
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected.', connectionId);
    const session = liveSessions.get(connectionId);
    if (session) {
      session.close();
      liveSessions.delete(connectionId);
    }
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error, connectionId);
    const session = liveSessions.get(connectionId);
    if (session) {
      session.close();
      liveSessions.delete(connectionId);
    }
  });
});

export { chatWss };