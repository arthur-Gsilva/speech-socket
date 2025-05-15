import { Application } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

export const setupProxy = (app: Application) => {
  app.use('/stream', createProxyMiddleware({
    target: 'http://localhost:8888',
    changeOrigin: true,
    secure: false,
    pathRewrite: { '^/stream': '' },
    onProxyRes: (proxyRes) => {
      proxyRes.headers['Access-Control-Allow-Origin'] = '*';
      proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, OPTIONS';
      proxyRes.headers['Access-Control-Allow-Headers'] = '*';
    }
  } as any));
};