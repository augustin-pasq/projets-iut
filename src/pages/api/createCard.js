import prisma from "../../../lib/prisma"

export default async function handle(req, res) {
    try {
        const game = await prisma.game.findFirst({
            where: {
                accessCode: req.body.accessCode
            }
        })

        const gameCardsCount = await prisma.card.count({
            where: {
                game: game.id
            }
        })

        const neighbors = await prisma.card.findMany({
            where: {
                positionX: {in: [req.body.positionX - 1, req.body.positionX, req.body.positionX + 1]},
                positionY: {in: [req.body.positionY - 1, req.body.positionY, req.body.positionY + 1]},
                game: game.id
            }
        })

        let code = 418
        if((gameCardsCount === 0 && (req.body.positionX === 2 || req.body.positionX === 3) && (req.body.positionY === 2 || req.body.positionY === 3)) || neighbors.length > 0) {
            code = 204
            await prisma.card.create({
                data: {
                    positionX: req.body.positionX,
                    positionY: req.body.positionY,
                    color: req.body.color,
                    value: req.body.value,
                    game: game.id,
                    player: req.body.playerId
                }
            })
        }

        res.status(code).json()
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}