import prisma from "../../../lib/prisma"

export default async function handle(req, res) {
    await prisma.voitures.update({
        where: { id: req.body.id },
        data: req.body,
    })
}