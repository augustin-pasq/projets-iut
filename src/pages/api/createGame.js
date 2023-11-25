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

        const game = await prisma.game.create({
            data: {
                accessCode: accessCode,
                roundsToReach: req.body.roundsToReach,
                isOpen: true
            }
        })

        await prisma.player.update({
            data: {
                game: game.id
            },
            where: {
                id: req.body.playerId
            }
        })

        res.status(200).json({accessCode: accessCode, gameId: game.id})
    } catch (err) {
        res.status(500).json(err)
    }
}