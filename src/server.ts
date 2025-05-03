import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";
import { cameras } from "./data/cameras"; // lista inicial de câmeras

const app = express();
app.use(cors());
const httpServer = createServer(app);

app.use('/stream', createProxyMiddleware({
  target: 'http://localhost:8888',
  changeOrigin: true,
  secure: false,
  pathRewrite: { '^/stream': '' },
}));

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

let cams = cameras;
let selectedCams: typeof cameras = [];
let activeCameraUrl: string | null = null;

// 🔧 Função para ajustar as URLs dinamicamente
function ajustarUrls(cameras: typeof cams, reqHost: string, protocol: string) {
  return cameras.map((cam) => {
    const parsed = new URL(cam.url);
    // força protocolo e host
    parsed.protocol = protocol + ':';
    parsed.host = reqHost;
    return {
      ...cam,
      url: parsed.toString()
    };
  });
}

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  const req = socket.request as express.Request;
  const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost:3001';
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';

  
const camsComUrlCorreta = ajustarUrls(cams, host as string, protocol);
  const selectedComUrlCorreta = ajustarUrls(selectedCams, host as string, protocol);
  const activeUrlCorrigida = activeCameraUrl?.replace('http://localhost:3001', `${protocol}://${host}`);

  // Envia os dados com URLs ajustadas
  socket.emit("init-cameras", {
    cams: camsComUrlCorreta,
    selectedCams: selectedComUrlCorreta,
    activeCameraUrl: activeUrlCorrigida
  });

  // Atualizações de câmeras
  socket.on("move-camera", (data: { cams: typeof cameras; selectedCams: typeof cameras }) => {
    cams = data.cams;
    selectedCams = data.selectedCams;
    io.emit("update-cameras", { cams, selectedCams });
  });

  // Atualização de câmera ativa
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
