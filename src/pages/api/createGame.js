import prisma from "../../../lib/prisma"

export default async function handle(req, res) {
    try {
        let accessCode = require("crypto").randomBytes(2).toString("hex").toUpperCase()

        let existingAccessCodes = await prisma.game.findMany({
            select: {
                accessCode: true,
            }
        })

        while(existingAccessCodes.find(obj => obj.accessCode === accessCode) !== undefined) accessCode = require("crypto").randomBytes(2).toString("hex").toUpperCase()

        const results = await prisma.game.create({
            data: {
                accessCode: accessCode,
                roundsToReach: req.body.roundsToReach,
            }
        })

        await prisma.player.update({
            data: {
                game: results.id
            },
            where: {
                id: req.body.playerId
            }
        })

        res.status(200).json(results)
    } catch (err) {
        res.status(500).json(err)
    }
}