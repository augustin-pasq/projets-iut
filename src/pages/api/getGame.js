import { PrismaClient as MySQLPrismaCLient } from "../../../prisma/mysql-client"
import { PrismaClient as MongoDBPrismaClient } from "../../../prisma/mongodb-client"
import { PrismaClient as SQLitePrismaClient } from "../../../prisma/sqlite-client"
import {io} from "socket.io-client"

let prisma
const socket = io.connect("http://localhost:4000")

export default async function handle(req, res) {
    switch (req.headers.cookie?.split(';').find(cookie => cookie.trim().startsWith('database'))?.split('=')[1]) {
        case "mysql":
        default:
            prisma = new MySQLPrismaCLient()
            break
        case "mongodb":
            prisma = new MongoDBPrismaClient()
            break
        case "sqlite":
            prisma = new SQLitePrismaClient()
            break
    }

    try {
        let code
        let game = await prisma.game.findFirst({where: {accessCode: req.body.accessCode,}})

        if (game === null) {
            code = 404
        } else {
            code = 204

            await prisma.player.update({
                data: {
                    game: game.id
                },
                where: {
                    id: req.body.playerId
                }
            })

            let players = await prisma.player.findMany({
                select: {
                    id: true,
                    username: true
                },
                where: {
                    game: game.id
                }
            })

            players.length > 4 || !game.isOpen ? code = 403 : socket.emit("playerHasJoined", players)
        }

        res.status(code).json()
    } catch (err) {
        res.status(500).json(err)
    } finally {
        await prisma.$disconnect()
    }
}