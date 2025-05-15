import { Server } from "socket.io";
import { getCams, getSelectedCams, getActiveCamera, updateCams, setActiveCamera } from "./cameraManage";

export const setupSocket = (io: Server) => {
    io.on("connection", (socket) => {
        console.log("User connected", socket.id);

        socket.on("move-camera", (data) => {
            updateCams(data.cams, data.selectedCams);
            io.emit("update-cameras", { cams: getCams(), selectedCams: getSelectedCams() });
        });

        socket.on("change-camera", ({ url }) => {
            setActiveCamera(url);
            io.emit("camera-updated", { url });
        });

        socket.on("request-cameras", () => {
            socket.emit("init-cameras", {
                cams: getCams(),
                selectedCams: getSelectedCams(),
                activeCameraUrl: getActiveCamera()
            });
        });

        socket.on("disconnect", () => {
            console.log("User disconnected", socket.id);
        });
    });
};
