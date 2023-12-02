import { PrismaClient as MySQLPrismaCLient } from "../../../prisma/mysql-client"
import { PrismaClient as MongoDBPrismaClient } from "../../../prisma/mongodb-client"
import { PrismaClient as SQLitePrismaClient } from "../../../prisma/sqlite-client"
import { v4 as uuidv4 } from "uuid"

let prisma

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

    let code = 418
    let winnerId

    try {
        const round = await prisma.round.findUnique({
            where: {
                id: req.body.roundId
            }
        })

        const roundCardsCount = await prisma.card.count({
            where: {
                round: round.id
            }
        })

        const game = await prisma.game.findUnique({
            where: {
                id: round.game
            }
        })

        const players = await prisma.player.count({
            where: {
                game: game.id
            }
        })

        const board = await prisma.card.findMany({
            where: {
                round: round.id
            }
        })

        const card = {
            id: uuidv4(),
            positionX: req.body.positionX,
            positionY: req.body.positionY,
            color: req.body.color,
            value: req.body.value,
            round: round.id,
            player: req.body.playerId
        }

        let seriesSize = players === 2 ? 5 : 4
        if (roundCardsCount === 0 || canPlaceCard(board, card)) {
            if (roundCardsCount === 0 && (req.body.positionX === 2 || req.body.positionX === 3) && (req.body.positionY === 2 || req.body.positionY === 3)) {
                await prisma.card.create({
                    data: card
                })

                code = 204
            } else if (roundCardsCount > 0) {
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
                    await prisma.card.create({
                        data: card
                    })

                    code = 204
                } else if (previousCard === null && neighbors.length > 0) { // Juxtaposition
                    await prisma.card.create({
                        data: card
                    })

                    code = 204
                }
            }

            winnerId = findSeries(board, seriesSize)
        } else {
            let winColor = await findWinner(board)

            winnerId = await prisma.player.findFirst({
                select: {
                    Player: {
                        select: {
                            id: true
                        }
                    }
                },
                where: {
                    color: winColor
                }
            })
        }

        if (winnerId !== null) {
            const winner = await prisma.player.findUnique({
                where: {
                    id: winnerId
                }
            })

            await prisma.player.update({
                data: {
                    roundsWon: winner.roundsWon + 1
                },
                where: {
                    id: winnerId
                }
            })

            let type
            if (game.roundsToReach === winner.roundsWon + 1) {
                await prisma.player.update({
                    data: {
                        winner: true,
                    },
                    where: {
                        id: winnerId
                    }
                })
                type = "game"
            } else {
                type = "round"
            }

            res.status(200).json({type: type, winner: winnerId})
        } else {
            res.status(code).json()
        }
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    } finally {
        await prisma.$disconnect()
    }
}

function canPlaceCard(cards, newCard) {
    // Créer une matrice 6x6
    let board = Array(6).fill().map(() => Array(6).fill(null))

    // Remplir la matrice avec les cartes
    cards.forEach(card => {
        board[card.positionX][card.positionY] = card
    });

    // Vérifier si une carte de valeur inférieure existe sur le plateau
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
            if (board[i][j] !== null && board[i][j].value < newCard.value) {
                return true
            }
        }
    }

    // Vérifier s'il existe un emplacement vide entouré d'au moins une carte
    let directions = [[-1, 0], [1, 0], [0, -1], [0, 1]]
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
            if (board[i][j] === null) {
                for (let [dx, dy] of directions) {
                    let x = i + dx
                    let y = j + dy
                    if (x >= 0 && x < 6 && y >= 0 && y < 6 && board[x][y] !== null) {
                        return true
                    }
                }
            }
        }
    }

    // Aucun emplacement disponible pour la nouvelle carte
    return false
}

function findSeries(cards, size) {
    // Créer une matrice 6x6
    let board = Array(6).fill().map(() => Array(6).fill(null));

    // Remplir la matrice avec les cartes
    cards.forEach(card => {
        board[card.positionX][card.positionY] = card;
    });

    // Vérifier les séries
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
            let card = board[i][j]
            if (card !== null) {
                // Vérifier horizontalement
                if (j <= 6 - size && [...Array(size).keys()].every(k => board[i][j+k]?.color === card.color)) {
                    return card.player
                }
                // Vérifier verticalement
                if (i <= 6 - size && [...Array(size).keys()].every(k => board[i+k][j]?.color === card.color)) {
                    return card.player
                }
                // Vérifier diagonalement (de haut en bas)
                if (i <= 6 - size && j <= 6 - size && [...Array(size).keys()].every(k => board[i+k][j+k]?.color === card.color)) {
                    return card.player
                }
                // Vérifier diagonalement (de bas en haut)
                if (i >= size - 1 && j <= 6 - size && [...Array(size).keys()].every(k => board[i-k][j+k]?.color === card.color)) {
                    return card.player
                }
            }
        }
    }

    // Aucune série trouvée
    return null
}

function countSeries(cards) {
    // Créer une matrice 6x6
    let board = Array(6).fill().map(() => Array(6).fill(null))

    // Remplir la matrice avec les cartes
    cards.forEach(card => {
        board[card.positionX][card.positionY] = card
    });

    // Initialiser le compteur de séries par couleur
    let seriesCount = {"#ED1D23": 0, "#00B9F1": 0, "#F9AE19": 0, "#70BE44": 0}

    // Vérifier les séries
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
            let card = board[i][j];
            if (card !== null) {
                // Vérifier horizontalement
                if (j <= 3 && [...Array(3).keys()].every(k => board[i][j+k]?.color === card.color)) {
                    seriesCount[card.color]++
                }
                // Vérifier verticalement
                if (i <= 3 && [...Array(3).keys()].every(k => board[i+k][j]?.color === card.color)) {
                    seriesCount[card.color]++
                }
                // Vérifier diagonalement (de haut en bas)
                if (i <= 3 && j <= 3 && [...Array(3).keys()].every(k => board[i+k][j+k]?.color === card.color)) {
                    seriesCount[card.color]++
                }
                // Vérifier diagonalement (de bas en haut)
                if (i >= 2 && j <= 3 && [...Array(3).keys()].every(k => board[i-k][j+k]?.color === card.color)) {
                    seriesCount[card.color]++
                }
            }
        }
    }

    return seriesCount;
}

async function findWinner(cards) {
    // Compter le nombre de séries par couleur
    let seriesCount = countSeries(cards)

    // Trouver la couleur avec le plus grand nombre de séries
    let maxSeries = Math.max(...Object.values(seriesCount))
    let maxColors = Object.keys(seriesCount).filter(color => seriesCount[color] === maxSeries)

    // En cas d'égalité, choisir la couleur avec la somme de valeurs la plus faible
    if (maxColors.length > 1) {
        let minSum = Infinity
        let minColor = null
        for (let color of maxColors) {
            let sum = cards.filter(card => card.color === color).reduce((sum, card) => sum + card.value, 0)
            if (sum < minSum) {
                minSum = sum
                minColor = color
            }
        }
        return minColor
    } else {
        return maxColors[0]
    }
}