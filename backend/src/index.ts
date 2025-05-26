import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { setupRooms } from './rooms';

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL, 
    methods: ['GET', 'POST']
  }
});

setupRooms(io);

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
