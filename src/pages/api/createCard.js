import prisma from "../../../lib/prisma"

export default async function handle(req, res) {
    let code = 418

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

        const previousCard = await prisma.card.findFirst({
            where: {
                positionX: req.body.positionX,
                positionY: req.body.positionY,
                game: game.id
            }
        })

        if(previousCard !== null && req.body.value > previousCard.value) {
            // Superposition
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

            code = 204
        } else if (previousCard === null) {
            // Juxtaposition
            const neighbors = await prisma.card.findMany({
                where: {
                    positionX: {in: [req.body.positionX - 1, req.body.positionX, req.body.positionX + 1]},
                    positionY: {in: [req.body.positionY - 1, req.body.positionY, req.body.positionY + 1]},
                    game: game.id
                }
            })

            if((gameCardsCount === 0 && (req.body.positionX === 2 || req.body.positionX === 3) && (req.body.positionY === 2 || req.body.positionY === 3)) || neighbors.length > 0) {
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

                code = 204
            }
        }

        res.status(code).json()
    } catch (err) {
        res.status(500).json(err)
    }
}