/**
 * R4.03 NoSQL
 * Projet
 *
 * PASQUIER Augustin
 * LE NY Liam
 * 29/05/2023
 */

/* https://github.com/Keyang/node-csvtojson */
const csv = require("csvtojson");
const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017/";
const client = new MongoClient(uri);

async function run() {
  try {
    const data = await csv().fromFile("./Voitures.csv");
    for (let i in data) {
      let moteur = { carburant: "", capacite_moteur: "" };
      moteur.carburant = data[i].carburant;
      moteur.capacite_moteur = Number(data[i].capacite_moteur);
      delete data[i].carburant;
      delete data[i].capacite_moteur;
      data[i].moteur = moteur;

      data[i].kilometrage = parseInt(data[i].kilometrage);
      data[i].annee_production = parseInt(data[i].annee_production);
      data[i].prix = parseInt(data[i].prix);
      data[i].sous_garantie = data[i].sous_garantie == "true";
      data[i].date_publication = new Date(data[i].date_publication);
    }

    const database = client.db("Concessionnaire");
    const voitures = await database.createCollection("voitures", {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: [
            "marque",
            "modele",
            "boite_vitesse",
            "annee_production",
            "couleur",
            "kilometrage",
            "moteur",
            "categorie",
            "sous_garantie",
            "etat",
            "transmission",
            "prix",
            "date_publication",
          ],
          properties: {
            marque: { bsonType: "string" },
            modele: { bsonType: "string" },
            boite_vitesse: {
              bsonType: "string",
              enum: ["Automatique", "Manuelle"],
            },
            annee_production: { bsonType: "int" },
            couleur: {
              bsonType: "string",
              enum: [
                "Argent",
                "Blanc",
                "Bleu",
                "Gris",
                "Jaune",
                "Marron",
                "Noir",
                "Orange",
                "Rouge",
                "Vert",
                "Violet",
                "Autre",
              ],
            },
            moteur: {
              bsonType: "object",
              required: ["carburant", "capacite_moteur"],
              properties: {
                carburant: {
                  bsonType: "string",
                  enum: ["Essence", "Diesel", "Électrique", "GPL", "Hybride"],
                },
                capacite_moteur: {
                  bsonType: ["int", "double"],
                  minimum: 0.2,
                  maximum: 8.0,
                },
              },
            },
            kilometrage: { bsonType: "int" },
            categorie: { bsonType: "string" },
            sous_garantie: { bsonType: "bool" },
            etat: {
              bsonType: "string",
              enum: ["Urgence", "Nouvelle", "Vendue"],
            },
            transmission: {
              bsonType: "string",
              enum: ["Propulsion", "Traction", "4 roues motrices"],
            },
            prix: { bsonType: "int", minimum: 1 },
            date_publication: { bsonType: "date" },
          },
        },
      },
    });
    console.log("'voitures' collection created successfully");

    let result;
    result = await voitures.insertMany(data);
    console.log(`${result.insertedCount} documents were inserted\n`);

    /* Requêtes simples */
    console.log("--------------- Requêtes simples ---------------")
    const voituresCollection = database.collection("voitures");

    // Nombre de voitures dans le catalogue
    const nbVoitures = await voituresCollection.countDocuments();
    console.log(`Nombre de voitures dans le catalogue : ${nbVoitures}`);

    // Lister les 3 premières voitures de la marque Peugeot
    const voituresPeugeot = await voituresCollection.find({ marque: "Peugeot" }).limit(3).toArray();
    console.log("Liste des 10 premières voitures de la marque Peugeot :");
    console.log(voituresPeugeot);
    
    // Proportion de boites auto par rapport au nombre total de véhicules
    const totalVehicles = await voituresCollection.countDocuments();
    const autoVehicles = await voituresCollection.countDocuments({
      boite_vitesse: "Automatique",
    });
    const proportionAuto = (autoVehicles / totalVehicles) * 100;
    console.log(
      `Proportion de boîtes automatiques : ${proportionAuto.toFixed(2)}%`
    );

    // Le kilométrage moyen de la base
    const kilolométrageMoyen = await voituresCollection
      .aggregate([{ $group: { _id: null, moyenne: { $avg: "$kilometrage" } } }])
      .toArray();
    console.log(`Kilométrage moyen : ${kilolométrageMoyen[0].moyenne}`);

    // La voiture la plus cher
    const voitureCher = await voituresCollection
      .find()
      .sort({ prix: -1 })
      .limit(1)
      .toArray();
    console.log("Voiture la plus chère :", voitureCher[0]);

  } finally {
    await client.close();
  }
}

run().catch(console.dir);
