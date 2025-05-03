import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());
const httpServer = createServer(app);

app.use('/stream', createProxyMiddleware({
  target: 'http://localhost:8888',
  changeOrigin: true,
  pathRewrite: {
    '^/stream': '', // remove /stream da URL final
  },
}));

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

import { cameras } from "./data/cameras"; // lista inicial de câmeras
import { createProxyMiddleware } from "http-proxy-middleware";

let cams = cameras;
let selectedCams: typeof cameras = [];
let activeCameraUrl: string | null = null; // <- adicionamos isso para o vídeo ativo!

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  // Ao conectar, manda tudo pro usuário:
  socket.emit("init-cameras", { cams, selectedCams, activeCameraUrl });

  // Quando move câmera entre as listas
  socket.on("move-camera", (data: { cams: typeof cameras; selectedCams: typeof cameras }) => {
    cams = data.cams;
    selectedCams = data.selectedCams;
    io.emit("update-cameras", { cams, selectedCams });
  });

  // Quando muda a câmera ativa (vídeo sendo transmitido)
  socket.on("change-camera", ({ url }: { url: string | null }) => {
    activeCameraUrl = url;
    io.emit("camera-updated", { url });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected", socket.id);
  });
});

httpServer.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
