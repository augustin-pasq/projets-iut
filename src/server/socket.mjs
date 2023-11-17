import http from "http"
import {Server} from "socket.io"

const server = http.createServer((req, res) => {
    res.writeHead(302, {location: "localhost:3000"})
    res.end()
})

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
})

io.on("connection", (socket) => {
    socket.on("playerHasJoined", (players) => {
        io.emit("playerHasJoined", players.map(player => player.username))
    })

    socket.on("gameHasStarted", (playersNumber) => {
        io.emit("gameHasStarted", playersNumber)
    })
})

server.listen(4000)