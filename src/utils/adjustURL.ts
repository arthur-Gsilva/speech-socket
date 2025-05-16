import { Camera } from '../types/Camera';

export function ajustarUrls(cameras: Camera[], reqHost: string, protocol: string) {
  const cleanHost = reqHost.split(':')[0];

  return cameras.map((cam) => {
    const parsed = new URL(cam.url);
    parsed.protocol = 'https';
    parsed.hostname = cleanHost;
    parsed.port = '';

    return {
      ...cam,
      url: parsed.toString()
    };
  });
}
