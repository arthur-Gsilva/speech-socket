import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { setupProxy } from "./proxy";
import { setupSocket } from "./socket";
import helmet from "helmet";

const app = express();
app.use(cors());
setupProxy(app); 
app.use(helmet())

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });

setupSocket(io); 

httpServer.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});