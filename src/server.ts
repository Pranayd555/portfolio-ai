import { createServer, IncomingMessage } from 'http';
import app from './app';
import { env } from './config/env';
import { chatWss } from './controllers/chat.controller';

const ALLOWED_ORIGINS = [
  'http://localhost:4200',
  'http://localhost:3000',
  // add your production domain here
];


// 1. Create an HTTP server using the Express app
const server = createServer(app);

// Intercept the HTTP Upgrade request before it hits Express routing
server.on('upgrade', (request, socket, head) => {
  const { pathname } = new URL(request.url || '', `http://${request.headers.host}`);
   const origin = request.headers.origin || '';

   if (!ALLOWED_ORIGINS.includes(origin)) {
    console.warn(`WS upgrade rejected for origin: ${origin}`);
    socket.write('HTTP/1.1 403 Forbidden\r\n\r\n');
    socket.destroy();
    return;
  }

  if (pathname === '/api/chat') {
    chatWss.handleUpgrade(request, socket, head, (ws) => {
      chatWss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

// 4. Start the combined server
server.listen(env.port, () => {
  console.log(`🚀 Server is humming along at http://localhost:${env.port}`);
  console.log(`🔌 WebSocket server is active on ws://localhost:${env.port}`);
});