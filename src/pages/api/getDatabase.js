export default async function handle(req, res) {
    try {
        res.status(204).json()
    } catch (err) {
        res.status(500).json(err)
    }
}