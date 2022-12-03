const express = require('express');
const app = express();
// for building server with socket.io 
const http = require("http");
const { Socket } = require('socket.io');
// this is to deal with issues as Socket.io 
const cors = require("cors");

const {Server} = require("socket.io");

app.use(cors());

const server = http.createServer(app);

const io = new Server(server,{
    cors:{
        origin: "http://localhost:3000",
        methods: ["GET","POST"],
    },
});

io.on("connection", (socket) => {
    console.log("socket id ",socket.id);

    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`User with id: ${socket.id} joined room: ${data}`)
    })
    socket.on("send_message", (data) => {
        console.log(`Data from chat ${data.message}`,data)
        socket.to(data.room).emit("receive_message",data);
    })
    socket.on("disconnect", () => {
        console.log("User disconnected",socket.id);
    });
})

server.listen(3001, () => {
    console.log("Server running on 3001");
})