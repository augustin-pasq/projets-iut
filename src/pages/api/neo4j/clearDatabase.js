import neo4j from "../../../../libs/neo4j.mjs"

export default async function handle(req, res) {
    try {
        await neo4j.session({ database: 'punto' }).run(`MATCH (n) DETACH DELETE n`)

        res.status(204).json()
    } catch (err) {
        res.status(500).json(err)
    }
}