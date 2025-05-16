import { Server } from "socket.io";
import type { Server as HTTPServer } from "http";
import { cameras as initialCams } from "../data/cameras";
import { ajustarUrls } from "../utils/adjustURL";
import express from "express";

let cams = initialCams;
let selectedCams: typeof cams = [];
let activeCameraUrl: string | null = null;

export function setupSocket(httpServer: HTTPServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected", socket.id);

    const req = socket.request as express.Request;
    const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost:3001';
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';

    const camsCorrigidas = ajustarUrls(cams, host as string, protocol);
    const selectedCorrigidas = ajustarUrls(selectedCams, host as string, protocol);
    const activeCorrigida = activeCameraUrl?.replace('http://localhost:3001', `${protocol}://${host}`);

    socket.emit("init-cameras", {
      cams: camsCorrigidas,
      selectedCams: selectedCorrigidas,
      activeCameraUrl: activeCorrigida
    });

    socket.on("move-camera", (data) => {
      cams = data.cams;
      selectedCams = data.selectedCams;
      io.emit("update-cameras", { cams, selectedCams });
    });

    socket.on("request-cameras", () => {
      socket.emit("init-cameras", { cams, selectedCams, activeCameraUrl });
    });

    socket.on("change-camera", ({ url }) => {
      activeCameraUrl = url;
      io.emit("camera-updated", { url });
    });

    socket.on("disconnect", () => {
      console.log("User disconnected", socket.id);
    });
  });
}
