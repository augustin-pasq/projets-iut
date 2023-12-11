import {v4 as uuidv4} from "uuid";
import neo4j from "../../../../libs/neo4j.mjs"

let prisma

export default async function handle(req, res) {
    try {
        let results = await neo4j.executeQuery(
            `CREATE (p:Player {id: $id, username: $username, roundsWon: $roundsWon, winner: $winner})`,
            { id: uuidv4(), username: req.body.username, roundsWon: 0, winner: false },
            { database: 'punto' }
        )

        res.status(200).json(results.summary.query.parameters)
    } catch (err) {
        res.status(500).json(err)
    }
}