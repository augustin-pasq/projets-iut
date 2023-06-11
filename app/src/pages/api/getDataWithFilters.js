import prisma from "../../../lib/prisma"

export default async function handle(req, res) {
    let whereClause = {}
    for(let filter in req.body) {
        whereClause[filter] = { in: req.body[filter] }
    }

    let results = {}
    results.cars = await prisma.voitures.findMany({
        where: whereClause
    })

    res.json(results)
}