import {v4 as uuidv4} from "uuid"
import neo4j from "../../../../libs/neo4j.mjs"

export default async function handle(req, res) {

    try {
        let accessCode = require("crypto").randomBytes(2).toString("hex").toUpperCase()

        let existingAccessCodes = await neo4j.executeQuery(
            `MATCH (game:Game) RETURN game.accessCode;`,
            { database: 'punto' }
        )

        while(existingAccessCodes.records.find(obj => obj.accessCode === accessCode) !== undefined) accessCode = require("crypto").randomBytes(2).toString("hex").toUpperCase()

        let game = await neo4j.executeQuery(
            `CREATE (g:Game {id: $id, accessCode: $accessCode, roundsToReach: $roundsToReach, isOpen: $isOpen})`,
            { id: uuidv4(), accessCode: accessCode, roundsToReach: req.body.roundsToReach, isOpen: true },
            { database: 'punto' }
        )

        await neo4j.executeQuery(
            `MATCH (p:Player {id: $playerId}), (g:Game {id: $gameId}) CREATE (p)-[:takes_part_in]->(g)`,
            { playerId: req.body.playerId, gameId: game.summary.query.parameters.id },
            { database: 'punto' }
        )

        res.status(200).json({accessCode: accessCode, gameId: game.summary.query.parameters.id})
    } catch (err) {
        res.status(500).json(err)
    }
}