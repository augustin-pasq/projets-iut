import { v4 as uuidv4 } from "uuid"
import neo4j from "../../../../libs/neo4j.mjs";

export default async function handle(req, res) {

    let code = 418
    let winnerId

    try {
        const round = await neo4j.executeQuery(
            `MATCH (r:Round {id: $roundId})-[:is_from]-(g:Game) RETURN r, g`,
            { roundId: req.body.roundId },
            {database: "punto"}
        )

        let roundCards = await neo4j.executeQuery(
            `MATCH (c:Card)-[:is_placed_in]-(r:Round {id: $id}) RETURN c`,
            { id: round.records[0]._fields[0].properties.id },
            {database: "punto"}
        )

        const game = round.records[0]._fields[1].properties

        const players = await neo4j.executeQuery(
            `MATCH (p:Player)-[:takes_part_in]-(g:Game {id: $id}) RETURN p`,
            { id: game.id },
            {database: "punto"}
        )

        const card = {
            id: uuidv4(),
            positionX: req.body.positionX,
            positionY: req.body.positionY,
            color: req.body.color,
            value: req.body.value,
            round: round.records[0]._fields[1].properties.id,
            player: req.body.playerId
        }

        let seriesSize = players.records.length === 2 ? 5 : 4
        if (roundCards.records.length === 0 || (card.color !== undefined && card.value !== undefined && canPlaceCard(roundCards.records.map(card => {return card?._fields[0]?.properties}), card))) {
            if (roundCards.records.length === 0 && (req.body.positionX === 2 || req.body.positionX === 3) && (req.body.positionY === 2 || req.body.positionY === 3)) {
                await neo4j.executeQuery(
                    `
                        CREATE (c:Card {id: $id, positionX: $positionX, positionY: $positionY, color: $color, value: $value})
                        WITH c
                        MATCH (p:Player {id: $player}), (r:Round {id: $roundId}) 
                        CREATE (c)-[:belongs_to]->(p)
                        CREATE (c)-[:is_placed_in]->(r)`,
                    {id: card.id, positionX: card.positionX, positionY: card.positionY, color: card.color, value: card.value, player:card.player, roundId: round.records[0]._fields[0].properties.id },
                    { database: 'punto' }
                )

                roundCards = await neo4j.executeQuery(
                    `MATCH (c:Card)-[:is_placed_in]-(r:Round {id: $id}) RETURN c`,
                    { id: round.records[0]._fields[0].properties.id },
                    {database: "punto"}
                )

                code = 204
            } else if (roundCards.records.length > 0) {
                const previousCard = await neo4j.executeQuery(
                    `MATCH (c:Card {positionX: $positionX, positionY: $positionY})-[:is_placed_in]-(r:Round {id: $roundId}) RETURN c`,
                    { positionX: req.body.positionX, positionY: req.body.positionY, roundId: req.body.roundId },
                    {database: "punto"}
                )

                const neighbors = await neo4j.executeQuery(
                    `MATCH (c:Card WHERE c.positionX IN $positionX AND c.positionY IN $positionY)-[:is_placed_in]-(r:Round {id: $roundId}) RETURN c`,
                    { positionX: [req.body.positionX - 1, req.body.positionX, req.body.positionX + 1], positionY: [req.body.positionY - 1, req.body.positionY, req.body.positionY + 1], roundId: req.body.roundId },
                    {database: "punto"}
                )

                if (previousCard.records.length > 0 && req.body.value > previousCard.records[0]._fields[0].properties.value) { // Superposition
                    await neo4j.executeQuery(
                        `
                        CREATE (c:Card {id: $id, positionX: $positionX, positionY: $positionY, color: $color, value: $value})
                        WITH c
                        MATCH (p:Player {id: $player}), (r:Round {id: $roundId}) 
                        CREATE (c)-[:belongs_to]->(p)
                        CREATE (c)-[:is_placed_in]->(r)`,
                        {id: card.id, positionX: card.positionX, positionY: card.positionY, color: card.color, value: card.value, player:card.player, roundId: round.records[0]._fields[0].properties.id },
                        { database: 'punto' }
                    )

                    roundCards = await neo4j.executeQuery(
                        `MATCH (c:Card)-[:is_placed_in]-(r:Round {id: $id}) RETURN c`,
                        { id: round.records[0]._fields[0].properties.id },
                        {database: "punto"}
                    )

                    code = 204
                } else if (previousCard.records.length === 0 && neighbors.records.length > 0) { // Juxtaposition
                    await neo4j.executeQuery(
                        `
                        CREATE (c:Card {id: $id, positionX: $positionX, positionY: $positionY, color: $color, value: $value})
                        WITH c
                        MATCH (p:Player {id: $player}), (r:Round {id: $roundId}) 
                        CREATE (c)-[:belongs_to]->(p)
                        CREATE (c)-[:is_placed_in]->(r)`,
                        {id: card.id, positionX: card.positionX, positionY: card.positionY, color: card.color, value: card.value, player:card.player, roundId: round.records[0]._fields[0].properties.id },
                        { database: 'punto' }
                    )

                    roundCards = await neo4j.executeQuery(
                        `MATCH (c:Card)-[:is_placed_in]-(r:Round {id: $id}) RETURN c`,
                        { id: round.records[0]._fields[0].properties.id },
                        {database: "punto"}
                    )

                    code = 204
                }
            }

            winnerId = findSeries(roundCards.records.map(card => {return card?._fields[0]?.properties}), seriesSize)
            if (winnerId !== null) {
                winnerId = await neo4j.executeQuery(
                    `MATCH (p:Player)-[:belongs_to]-(c:Card {id: $id}) RETURN p`,
                    { id: winnerId },
                    {database: "punto"}
                )
            }
        } else {
            let winColor = await findWinner(roundCards)

            winnerId = await neo4j.executeQuery(
                `MATCH (p:Player)-[:belongs_to]-(c:Card {color: $color})-[:is_placed_in]-(r:Round {id: $id}) RETURN p`,
                { color: winColor, id: round.records[0]._fields[0].properties.id },
                {database: "punto"}
            )
        }

        if (winnerId !== null) {
            const winner = await neo4j.executeQuery(
                `MATCH (p:Player {id: $id}) RETURN p;`,
                { id: winnerId.records[0]._fields[0].properties.id },
                { database: 'punto' }
            )

            await neo4j.executeQuery(
                `MATCH (p:Player {id: $id}) SET p.roundsWon = p.roundsWon + 1 RETURN p`,
                { id: winnerId.records[0]._fields[0].properties.id },
                { database: 'punto' }
            )

            let type
            if (game.roundsToReach === winner.records[0]._fields[0].properties.roundsWon + 1) {
                await neo4j.executeQuery(
                    `MATCH (p:Player {id: $id}) SET p.winner = $winner RETURN p`,
                    { id: winnerId.records[0]._fields[0].properties.id, winner: true },
                    { database: 'punto' }
                )

                type = "game"
            } else {
                type = "round"
            }

            res.status(200).json({type: type, winner: winnerId.records[0]._fields[0].properties.id})
        } else {
            res.status(code).json()
        }
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
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
                    return card.id
                }
                // Vérifier verticalement
                if (i <= 6 - size && [...Array(size).keys()].every(k => board[i+k][j]?.color === card.color)) {
                    return card.id
                }
                // Vérifier diagonalement (de haut en bas)
                if (i <= 6 - size && j <= 6 - size && [...Array(size).keys()].every(k => board[i+k][j+k]?.color === card.color)) {
                    return card.id
                }
                // Vérifier diagonalement (de bas en haut)
                if (i >= size - 1 && j <= 6 - size && [...Array(size).keys()].every(k => board[i-k][j+k]?.color === card.color)) {
                    return card.id
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