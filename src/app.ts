import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());

app.use(express.json());

// Standard Express HTTP Endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy' });
});

export default app;