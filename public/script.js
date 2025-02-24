const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const socket = io();

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let drawing = false;
let color = "black"; // Default color

// Receive the assigned color from the server
socket.on("assignColor", (assignedColor) => {
  color = assignedColor;
});

// Load previous drawings when connecting
socket.on("loadCanvas", (history) => {
  history.forEach((data) => {
    ctx.fillStyle = data.color;
    ctx.fillRect(data.x, data.y, 5, 5);
  });
});

canvas.addEventListener("mousedown", () => (drawing = true));
canvas.addEventListener("mouseup", () => (drawing = false));
canvas.addEventListener("mousemove", draw);

function draw(event) {
  if (!drawing) return;

  const x = event.clientX;
  const y = event.clientY;

  ctx.fillStyle = color;
  ctx.fillRect(x, y, 5, 5);

  socket.emit("draw", { x, y, color });
}

// Draw other players' strokes in their assigned color
socket.on("draw", (data) => {
  ctx.fillStyle = data.color;
  ctx.fillRect(data.x, data.y, 5, 5);
});
