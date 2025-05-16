import { createServer } from "http";
import app from "./app";
import { setupSocket } from "./socket";

const httpServer = createServer(app);
setupSocket(httpServer);

const PORT = 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
