import prisma from "../../../lib/prisma"

export default async function handle(req, res) {
    let result = {}

    if (req.body.action === "edit") {
        result = await prisma.voitures.update({
            where: {id: req.body.properties.id},
            data: {
                annee_production: parseInt(req.body.properties.annee_production),
                boite_vitesse: req.body.properties.boite_vitesse.name,
                categorie: req.body.properties.categorie.name,
                couleur: req.body.properties.couleur.name,
                kilometrage: parseInt(req.body.properties.kilometrage),
                marque: req.body.properties.marque.name,
                modele: req.body.properties.modele,
                moteur: {
                    carburant: req.body.properties.carburant.name,
                    capacite_moteur: Number(req.body.properties.capacite_moteur)
                },
                prix: parseInt(req.body.properties.prix),
                sous_garantie: req.body.properties.sous_garantie.name === "Oui",
                transmission: req.body.properties.transmission.name
            },
        })
    } else if (req.body.action === "add") {
        result = await prisma.voitures.create({
            data: {
                annee_production: parseInt(req.body.properties.annee_production),
                boite_vitesse: req.body.properties.boite_vitesse.name,
                categorie: req.body.properties.categorie.name,
                couleur: req.body.properties.couleur.name,
                kilometrage: parseInt(req.body.properties.kilometrage),
                marque: req.body.properties.marque,
                modele: req.body.properties.modele,
                moteur: {
                    carburant: req.body.properties.carburant.name,
                    capacite_moteur: Number(req.body.properties.capacite_moteur)
                },
                prix: parseInt(req.body.properties.prix),
                sous_garantie: req.body.properties.sous_garantie.name === "Oui",
                transmission: req.body.properties.transmission.name,
                date_publication: new Date().toISOString(),
                etat: "Neuve"
            },
        })
    }

    res.json(result)
}