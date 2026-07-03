import { WebSocket, WebSocketServer } from "ws";
import { env } from "../config/env";
import { IncomingMessage } from "node:http";
import { randomUUID } from "node:crypto";
import { TalkService } from "../services/talk.service";

// Initialize a decoupled WebSocket Server (no port or server assigned yet)
const talkWss = new WebSocketServer({ 
  noServer: true,
  verifyClient: (info, cb) => {
    const origin = info.origin || info.req.headers.origin || '';
    const allowed = env.allowedOrigins;

    if (allowed.includes(origin)) {
      cb(true);
    } else {
      cb(false, 403, 'Forbidden');
    }
  }
});
const talkService = new TalkService();

const liveSessions = new Map<string, any>();

talkWss.on('connection', async (ws: WebSocket, request: IncomingMessage) => {
  const connectionId = randomUUID();
  let isSpeaking = false;
  console.log('New client connected', connectionId);

  ws.send(JSON.stringify({ type: 'SYSTEM', message: 'Welcome to the chat, anonymous!' }));
  ws.send(JSON.stringify({ type: 'WELCOME', 
    message: 
`
You've connected to Eva.

Think of me as a digital assistant trained on Pranay's experience, projects, technical decisions, and engineering journey.

Whether you're a recruiter, client, founder, or fellow developer, I can help you navigate his professional universe.

What would you like to know?`, connectionId }));

  try {
    const geminiSession = await talkService.runPortfolioAgent(
      connectionId,
      (onAudioChunk) => {
        if (!isSpeaking) {
          isSpeaking = true;
        }
        ws.send(JSON.stringify({ type: 'AUDIO_RESPONSE', response: onAudioChunk }));
      },
      (step, detail) => {
        ws.send(JSON.stringify({ type: 'AGENT_STEP', step, detail }));
      },
      () => {
        isSpeaking = false;
        ws.send(JSON.stringify({ type: 'TURN_COMPLETE' }));
      },
    );

    liveSessions.set(connectionId, geminiSession);
  } catch (error: any) {
    console.error(`Failed to start Gemini Live for ${connectionId}:`, error);
    ws.send(JSON.stringify({ type: 'ERROR', message: 'Could not connect to Gemini Live engine.' }));
    ws.close();
    return;
  }

  ws.on('message', (message: ArrayBuffer, isBinary) => {
    try {
      if (isBinary) {
        const session = liveSessions.get(connectionId);
        if (!session) {
          ws.send(JSON.stringify({ type: 'ERROR', message: 'No active Gemini session for this connection.' }));
          return;
        }
        session.sendRealtimeInput({
          audio: {
            data: Buffer.from(message).toString('base64'),
            mimeType: 'audio/pcm;rate=16000'
          }
        });
        return;
      } else {
        const textData = JSON.parse(message.toString());
        if (textData?.type === 'TURN_COMPLETE') {
          console.log('TURN_COMPLETE', connectionId);
          const session = liveSessions.get(connectionId);
          if (!session) {
            ws.send(JSON.stringify({ type: 'ERROR', message: 'No active Gemini session for this connection.' }));
            return;
          }
          if (isSpeaking) {
            ws.send(JSON.stringify({ type: 'INTERRUPT', message: 'User started speaking while Eva was responding.' }));
            session.sendRealtimeInput({ audioStreamEnd: true });
            isSpeaking = false;
          } else {
            session.sendRealtimeInput({ audioStreamEnd: true });
          }
          return;
        }
      }

      ws.send(JSON.stringify({ type: 'ERROR', message: 'Unsupported message type.' }));
    } catch (error) {
      console.error('WebSocket parse error:', error);
      ws.send(JSON.stringify({ type: 'ERROR', message: 'Invalid Input format' }));
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

export { talkWss };