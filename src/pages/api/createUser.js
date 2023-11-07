import prisma from "../../../lib/prisma"

export default async function handle(req, res) {
    try {
        const results = await prisma.player.create({
            data: {
                username: req.body.username,
                roundsWon: 0,
                game: undefined
            }
        })

        res.status(200).json(results)
    } catch (err) {
        res.status(500).json(err)
    }
}