const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static("public"));

function getRandomRGBColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r},${g},${b})`;
}

let userColors = {};
let drawingHistory = []; // Store all drawing events

io.on("connection", (socket) => {
  console.log("A new user connected");

  // Assign a random color to the new user
  userColors[socket.id] = getRandomRGBColor();
  socket.emit("assignColor", userColors[socket.id]);

  // Send existing drawing history to the new user
  socket.emit("loadCanvas", drawingHistory);

  // Listen for new drawings and store them
  socket.on("draw", (data) => {
    drawingHistory.push(data); // Save drawing event
    socket.broadcast.emit("draw", data);
  });

  // Remove user color on disconnect
  socket.on("disconnect", () => {
    console.log("A user disconnected");
    delete userColors[socket.id];
  });
});

server.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
