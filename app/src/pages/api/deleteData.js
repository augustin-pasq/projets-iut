import prisma from "../../../lib/prisma"

export default async function handle(req, res) {
    let result = await prisma.voitures.delete({
        where: { id: req.body.id }
    })

    res.json(result)
}