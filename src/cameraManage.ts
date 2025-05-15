import { cameras } from "./data/cameras";
import { Camera } from "./types/Camera";

let cams = cameras;
let selectedCams: Camera[] = [];
let activeCameraUrl: string | null = null;

export const getCams = () => cams;
export const getSelectedCams = () => selectedCams;
export const getActiveCamera = () => activeCameraUrl;

export const updateCams = (newCams: typeof cameras, newSelected: typeof cameras) => {
  cams = newCams;
  selectedCams = newSelected;
};

export const setActiveCamera = (url: string | null) => {
  activeCameraUrl = url;
};