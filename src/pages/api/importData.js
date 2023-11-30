import { PrismaClient as MySQLPrismaCLient } from "../../../prisma/mysql-client"
import { PrismaClient as MongoDBPrismaClient } from "../../../prisma/mongodb-client"
import { PrismaClient as SQLitePrismaClient } from "../../../prisma/sqlite-client"
import Papa from "papaparse"
import formidable from "formidable"
import * as fs from "fs"

export const config = {
    api: {
        bodyParser: false
    }
}

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
    }

    try {
        let code = 204

        await formidable({ keepExtensions: true, allowEmptyFiles: true, minFileSize: 0 }).parse(req, async (err, fields, files) => {
            if (err) throw err

            let fileContent = Papa.parse(fs.readFileSync(files.file[0].filepath, "utf-8"), {header: true, dynamicTyping: true})
            let fileFields = fileContent.meta.fields
            let fileData = fileContent.data

            await prisma.$queryRaw`SET foreign_key_checks = 0;`

            switch (fields.table[0]) {
                case "Joueurs":
                    if(fileFields.toString() === ["id", "creation_date", "username", "roundsWon", "game", "winner"].toString()) {
                        try {
                            await prisma.player.createMany({
                                data: fileData
                            })
                        } catch (err) {
                            res.status(409).json(err)
                        }
                    } else {
                        code = 400
                    }
                    break
                case "Parties":
                    if(fileFields.toString() === ["id", "creation_date", "accessCode", "roundsToReach", "isOpen"].toString()) {
                        try {
                            await prisma.game.createMany({
                                data: fileData
                            })
                        } catch (err) {
                            res.status(409).json(err)
                        }
                    } else {
                        code = 400
                    }
                    break
                case "Manches":
                    if(fileFields.toString() === ["id", "creation_date", "game"].toString()) {
                        try {
                            await prisma.round.createMany({
                                data: fileData
                            })
                        } catch (err) {
                            res.status(409).json(err)
                        }
                    } else {
                        code = 400
                    }
                    break
                case "Cartes":
                    if(fileFields.toString() === ["id", "creation_date", "positionX", "positionY", "color", "value", "round", "player"].toString()) {
                        try {
                            await prisma.card.createMany({
                                data: fileData
                            })
                        } catch (err) {
                            res.status(409).json(err)
                        }
                    } else {
                        code = 400
                    }
                    break
                case "Séries":
                    if(fileFields.toString() === ["id", "creation_date", "seriesColor", "score", "length", "start", "end", "round"].toString()) {
                        try {
                            await prisma.series.createMany({
                                data: fileData
                            })
                        } catch (err) {
                            res.status(409).json(err)
                        }
                    } else {
                        code = 400
                    }
                    break
            }

            await prisma.$queryRaw`SET foreign_key_checks = 1;`

            res.status(code).json()
        })
    } catch (err) {
        res.status(500).json(err)
    } finally {
        await prisma.$disconnect()
    }
}