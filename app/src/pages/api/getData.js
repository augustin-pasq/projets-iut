import prisma from "../../../lib/prisma"

export default async function handle(req, res) {
    let temp = {cars: [], marques: [], boites_vitesse: [], couleurs: [], categories: [], garanties: [], etats: [], transmissions: [], carburants: []}

    // modèle => recherche ?
    // kilométrage, année, prix, date_publication, capacité_moteur → c'est chiant

    let data = await prisma.voitures.findMany()

    data.forEach(car => {
        if(!temp.marques.includes(car.marque)) temp.marques.push(car.marque)
        if(!temp.boites_vitesse.includes(car.boite_vitesse)) temp.boites_vitesse.push(car.boite_vitesse)
        if(!temp.couleurs.includes(car.couleur)) temp.couleurs.push(car.couleur)
        if(!temp.categories.includes(car.categorie)) temp.categories.push(car.categorie)
        if(!temp.garanties.includes(car.sous_garantie)) temp.garanties.push(car.sous_garantie)
        if(!temp.etats.includes(car.etat)) temp.etats.push(car.etat)
        if(!temp.transmissions.includes(car.transmission)) temp.transmissions.push(car.transmission)
        if(!temp.carburants.includes(car.moteur.carburant)) temp.carburants.push(car.moteur.carburant)
    })

    let results = {cars: [], values: {}}

    results.cars = data
    results.values.marques = temp.marques.sort().map(marque => ({ name: marque}))
    results.values.boites_vitesse = temp.boites_vitesse.sort().map(boite_vitesse => ({ name: boite_vitesse}))
    results.values.couleurs = temp.couleurs.sort().map(couleur => ({ name: couleur}))
    results.values.categories = temp.categories.sort().map(categorie => ({ name: categorie}))
    results.values.garanties = temp.garanties.sort().map(sous_garantie => ({ name: sous_garantie ? 'Oui' : 'Non'}))
    results.values.etats = temp.etats.sort().map(etat => ({ name: etat}))
    results.values.transmissions = temp.transmissions.sort().map(transmission => ({ name: transmission}))
    results.values.carburants = temp.carburants.sort().map(carburant => ({ name: carburant}))

    res.json(results)
}