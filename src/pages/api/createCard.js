import prisma from "../../../lib/prisma"

export default async function handle(req, res) {
    let code = 418
    let card = {}

    try {
        const round = await prisma.round.findUnique({where: {id: req.body.roundId}})
        const roundCardsCount = await prisma.card.count({where: {round: round.id}})

        const previousCard = await prisma.card.findFirst({
            where: {
                positionX: req.body.positionX,
                positionY: req.body.positionY,
                round: round.id,
            }
        })

        const neighbors = await prisma.card.findMany({
            where: {
                positionX: {in: [req.body.positionX - 1, req.body.positionX, req.body.positionX + 1]},
                positionY: {in: [req.body.positionY - 1, req.body.positionY, req.body.positionY + 1]},
                round: round.id,
            }
        })

        if (previousCard !== null && req.body.value > previousCard.value) { // Superposition
            card = await prisma.card.create({
                data: {
                    positionX: req.body.positionX,
                    positionY: req.body.positionY,
                    color: req.body.color,
                    value: req.body.value,
                    round: round.id,
                    player: req.body.playerId
                }
            })

            code = 204
        } else if (previousCard === null) { // Juxtaposition
            if ((roundCardsCount === 0 && (req.body.positionX === 2 || req.body.positionX === 3) && (req.body.positionY === 2 || req.body.positionY === 3)) || neighbors.length > 0) {
                card = await prisma.card.create({
                    data: {
                        positionX: req.body.positionX,
                        positionY: req.body.positionY,
                        color: req.body.color,
                        value: req.body.value,
                        round: round.id,
                        player: req.body.playerId
                    }
                })

                code = 204
            }
        }

        const colorNeighbors = neighbors.filter(neighbor => neighbor.color === card.color)

        // Check series
        if (colorNeighbors.length > 0) {
            const colorSeries = await prisma.series.findMany({
                where: {
                    seriesColor: card.color,
                    round: round.id,
                }
            })

            if (colorSeries.length === 0) {
                for (const colorNeighbor of colorNeighbors) {
                    await prisma.series.create({
                        data: {
                            seriesColor: colorNeighbor.color,
                            score: parseInt(colorNeighbor.value) + parseInt(card.value),
                            length: 2,
                            start: card.id,
                            end: colorNeighbor.id,
                            round: round.id
                        }
                    })
                }
            } else {
                for (const series of colorSeries) {
                    let startCard = await prisma.card.findUnique({where: {id: series.start}})
                    let endCard = await prisma.card.findUnique({where: {id: series.end}})

                    let newScore = parseInt(series.score)
                    let newLength = parseInt(series.length)
                    let newStart = startCard
                    let newEnd = endCard

                    if (startCard.positionX === card.positionX && card.positionX === endCard.positionX) { // Alignement vertical
                        if (card.positionY < startCard.positionY) {
                            newScore += parseInt(card.value)
                            newLength += 1
                            newStart = card
                        } else if (card.positionY === startCard.positionY) {
                            newScore = newScore - startCard.value + card.value
                            newStart = card
                        } else if (card.positionY > endCard.positionY) {
                            newScore += parseInt(card.value)
                            newLength += 1
                            newEnd = card
                        } else if (card.positionY === endCard.positionY) {
                            newScore = newScore - endCard.value + card.value
                            newEnd = card
                        }
                    } else if (startCard.positionY === card.positionY && card.positionY === endCard.positionY) { // Alignement horizontal
                        if (card.positionX < startCard.positionX) {
                            newScore += parseInt(card.value)
                            newLength += 1
                            newStart = card
                        } else if (card.positionX === startCard.positionX) {
                            newScore = newScore - startCard.value + card.value
                            newStart = card
                        } else if (card.positionX > endCard.positionX) {
                            newScore += parseInt(card.value)
                            newLength += 1
                            newEnd = card
                        } else if (card.positionX === endCard.positionX) {
                            newScore = newScore - endCard.value + card.value
                            newEnd = card
                        }
                    } else if ((endCard.positionX - startCard.positionX) / (endCard.positionY - startCard.positionY) === (card.positionX - startCard.positionX) / (card.positionY - startCard.positionY)) { // Alignement diagonal
                        if (card.positionX < startCard.positionX || card.positionY < startCard.positionY) {
                            newScore += parseInt(card.value)
                            newLength += 1
                            newStart = card
                        } else if (card.positionX === startCard.positionX && card.positionY === startCard.positionY) {
                            newScore = newScore - startCard.value + card.value
                            newStart = card
                        } else if (card.positionX < endCard.positionX || card.positionY < endCard.positionY) {
                            newScore += parseInt(card.value)
                            newLength += 1
                            newEnd = card
                        } else if (card.positionX === endCard.positionX && card.positionY === endCard.positionY) {
                            newScore = newScore - endCard.value + card.value
                            newEnd = card
                        }
                    }

                    await prisma.series.update({
                        data: {
                            score: newScore,
                            length: newLength,
                            start: newStart.id,
                            end: newEnd.id,
                        },
                        where: {
                            id: series.id
                        }
                    })
                }
            }
        }

        let winner = await prisma.series.findFirst({
            select: {
                Card_Series_startToCard: {
                    select: {
                        player: true
                    }
                }
            },
            where: {
                round: round.id,
                length: 4,
            }
        })

        if (winner !== null) {
            const game = await prisma.game.findUnique({where: {id: round.game}})
            let roundsNumber = await prisma.round.count({where: {game: game.id}})

            let type
            if (roundsNumber === game.roundsToReach) {
                await prisma.player.update({
                    data: {
                        winner: true
                    },
                    where: {
                        id: winner.Card_Series_startToCard.player
                    }
                })

                type = "game"
            } else {
                type = "round"
            }


            res.status(200).json({type: type, winner: winner.Card_Series_startToCard.player})
        } else {
            res.status(code).json()
        }

    } catch (err) {
        res.status(500).json(err)
    }
}