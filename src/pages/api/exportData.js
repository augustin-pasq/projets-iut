import { PrismaClient as MySQLPrismaCLient } from "../../../prisma/mysql-client"
import { PrismaClient as MongoDBPrismaClient } from "../../../prisma/mongodb-client"
import { PrismaClient as SQLitePrismaClient } from "../../../prisma/sqlite-client"
import Papa from "papaparse"
import JSZip from "jszip"
const fs = require('node:fs')
const path = require('path')

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
        const zip = new JSZip()

        let data
        for (const table of req.body.tables) {
            switch (table) {
                case "Cartes":
                    data = await prisma.card.findMany()
                    break
                case "Parties":
                    data = await prisma.game.findMany()
                    break
                case "Joueurs":
                    data = await prisma.player.findMany()
                    break
                case "Séries":
                    data = await prisma.series.findMany()
                    break
                case "Manches":
                    data = await prisma.round.findMany()
                    break
            }

            zip.file(`${table}.csv`, Papa.unparse(data, {delimiter: ";"}))
        }

        const fileName = `Export-Punto_${new Date().toISOString().replace(/[-T:Z.]/g, "")}.zip`

        zip
            .generateNodeStream({type:"nodebuffer",streamFiles:true})
            .pipe(fs.createWriteStream(path.join(path.join(__dirname, "../../../../public/"), fileName)))

        res.status(200).json({fileName : fileName})
    } catch (err) {
        res.status(500).json(err)
    } finally {
        await prisma.$disconnect()
    }
}