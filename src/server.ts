import { createServer, IncomingMessage } from 'http';
import app from './app';
import { env } from './config/env';
import { chatWss } from './controllers/chat.controller';

// 1. Create an HTTP server using the Express app
const server = createServer(app);

// Intercept the HTTP Upgrade request before it hits Express routing
server.on('upgrade', (request, socket, head) => {
  const { pathname } = new URL(request.url || '', `http://${request.headers.host}`);

  // 1. Check if the path matches our intended WebSocket route
  if (pathname === '/api/chat') {
    
    // 2. Adapt the Node IncomingMessage into an Express Request for the middleware
    const req = request as IncomingMessage;
    // 3. If middleware passes, hand off the socket connection to our chat WS server
    chatWss.handleUpgrade(request, socket, head, (ws) => {
    // Pass the request along (with req.user attached) to the connection event
    chatWss.emit('connection', ws, req);
    });
    
  } else {
    // If the path doesn't match any WebSocket endpoints, destroy the socket connection
    socket.destroy();
  }
});

// 4. Start the combined server
server.listen(env.port, () => {
  console.log(`🚀 Server is humming along at http://localhost:${env.port}`);
  console.log(`🔌 WebSocket server is active on ws://localhost:${env.port}`);
});