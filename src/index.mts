import { createServer } from "node:http";
import { Server, Socket } from "socket.io";

const server = createServer();

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

const userData: { [index: string]: string } = {};

io.on("connection", (socket: Socket) => {
  console.log("Client connected to the server", socket.id);

  socket.emit("auk", "hello");

  socket.on("pamod", (data) => {
    console.log(data, socket.id);
  });

  socket.on("usernameRegister", (username: string): void => {
    userData[username] = socket.id;

    socket.emit("chatUsers", Object.keys(userData));
  });

  socket.on("message", (data: { message: string; chatUser: string }): void => {
    const recipients = userData[data.chatUser];
    if (recipients) {
      let sender: string = "";
      Object.entries(userData).forEach(([key, value]) => {
        if (value === socket.id) {
          sender = key;
        }
      });
      io.to(recipients).emit("chat", {
        message: data.message,
        member: data.chatUser,
      });
    }
  });

  socket.on("chat", (chatData: { message: string; member: string }): void => {
    console.log(chatData, socket.id);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected from the server", socket.id);

    Object.entries(userData).forEach(([username, id]) => {
      if (id === socket.id) {
        delete userData[username];
        console.log("User disconnected:", username);
      }
    });
  });
});

server.listen(4000);
