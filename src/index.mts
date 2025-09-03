import { createServer } from "node:http";
import { Server, Socket } from "socket.io";

const server = createServer();

const io = new Server(server);

io.on("connection", (socket: Socket) => {
  console.log("Client connected to the server", socket.id);
});

server.listen(4000);
