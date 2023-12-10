import neo4j from "../../../../libs/neo4j.mjs"
import {v4 as uuidv4} from "uuid"
import {io} from "socket.io-client"

const socket = io.connect("http://localhost:4000")

export default async function handle(req, res) {

    try {
        let code
        let game = await neo4j.executeQuery(
            `MATCH (game:Game {accessCode: $accessCode}) RETURN game;`,
            { accessCode: req.body.accessCode },
            { database: 'punto' }
        )

        if (game.records === null) {
            code = 404
        } else {
            code = 204

            await neo4j.executeQuery(
                `MATCH (p:Player {id: $playerId}), (g:Game {id: $gameId}) CREATE (p)-[:takes_part_in]->(g)`,
                { playerId: req.body.playerId, gameId: game.records[0]._fields[0].properties.id },
                { database: 'punto' }
            )


            let players = await neo4j.executeQuery(
                `MATCH (p:Player)-[:takes_part_in]->(g:Game {id: $id}) RETURN p;`,
                { id: game.records[0]._fields[0].properties.id },
                { database: 'punto' }
            )

            players.records.length > 4 || !game.records[0]._fields[0].properties.isOpen ? code = 403 : socket.emit("playerHasJoined", players.records.map(player => { return {id: player._fields[0].properties.id, username: player._fields[0].properties.username } }))
        }

        res.status(code).json()
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}