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
        io.emit("playerHasJoined", players)
    })

    socket.on("gameHasStarted", (playersNumber) => {
        io.emit("gameHasStarted", playersNumber)
    })

    socket.on("playerHasPlayed", (players) => {
        io.emit("playerHasPlayed", players.allPlayers[(players.allPlayers.indexOf(players.allPlayers.find(player => player.id === players.currentPlayer)) + 1) % players.allPlayers.length].id)
    })

    socket.on("updateBoard", (card) => {
        io.emit("updateBoard", card)
    })
})

server.listen(4000)