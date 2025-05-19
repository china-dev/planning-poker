import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { setupRooms } from './rooms';

const app = express();
app.use(cors());
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST']
  }
});

setupRooms(io);

const PORT = 3001;

httpServer.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
