import { PrismaClient as MySQLPrismaCLient } from "../../../prisma/mysql-client"
import { PrismaClient as MongoDBPrismaClient } from "../../../prisma/mongodb-client"
import { PrismaClient as SQLitePrismaClient } from "../../../prisma/sqlite-client"

export default async function handle(req, res) {
    let prisma
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
        // Handle other databases if needed
    }

    try {
        const results = await prisma.player.create({
            data: {
                username: req.body.username,
                roundsWon: 0,
                game: undefined
            }
        })

        res.status(200).json(results)
    } catch (err) {
        res.status(500).json(err)
    }
}