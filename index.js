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
const { MongoClient, ObjectId } = require("mongodb");
const { performance } = require("perf_hooks");

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

    const voituresCollection = database.collection("voitures");

    /* Requêtes simples */
    console.log("--------------- Requêtes simples ---------------");

    // Nombre de voitures dans le catalogue
    const nbVoitures = await voituresCollection.countDocuments();
    console.log(`Nombre de voitures dans le catalogue : ${nbVoitures}`);

    // Lister les 3 premières voitures de la marque Peugeot
    const voituresPeugeot = await voituresCollection
      .find({ marque: "Peugeot" })
      .limit(3)
      .toArray();
    console.log("Liste des 3 premières voitures de la marque Peugeot :");
    console.log(voituresPeugeot);

    // Donner la proportion de boites auto par rapport au nombre total de véhicules
    const totalVehicles = await voituresCollection.countDocuments();
    const autoVehicles = await voituresCollection.countDocuments({
      boite_vitesse: "Automatique",
    });
    const proportionAuto = (autoVehicles / totalVehicles) * 100;
    console.log(
      `Proportion de boîtes automatiques : ${proportionAuto.toFixed(2)}%`
    );

    // Indiquer le kilométrage moyen de tous les véhicules
    const kilolométrageMoyen = await voituresCollection
      .aggregate([{ $group: { _id: null, moyenne: { $avg: "$kilometrage" } } }])
      .toArray();
    console.log(
      `Kilométrage moyen de tous les véhicules : ${kilolométrageMoyen[0].moyenne}`
    );

    //  Trouver la voiture la plus cher
    const voitureCher = await voituresCollection
      .find()
      .sort({ prix: -1 })
      .limit(1)
      .toArray();
    console.log("La voiture la plus chère :", voitureCher[0]);

    /* Requêtes recherchées */
    console.log("--------------- Requêtes recherchées ---------------");

    // Appliquer -15% sur le prix des voitures dont le prix est supérieur à 10000
    console.log(
      "Afficher une voiture avec un prix supérieur à 10000 avant la modification :"
    );

    const voitureAvant = await voituresCollection.findOne({
      prix: { $gt: 10000 },
    });
    console.log(voitureAvant);

    console.log(
      "Appliquer -15% sur le prix des voitures dont le prix est supérieur à 10000"
    );

    const listeVoitures = await voituresCollection
      .find({ prix: { $gt: 10000 } })
      .toArray();

    for (const voiture of listeVoitures) {
      const nouveauPrix = Math.trunc(voiture.prix * 0.85); // Réduction de 15% et conversion en entier
      await voituresCollection.updateOne(
        { _id: voiture._id },
        { $set: { prix: nouveauPrix } }
      );
    }

    console.log("Afficher la même voiture après la modification :");
    const voitureApres = await voituresCollection.findOne({
      _id: voitureAvant._id,
    });
    console.log(voitureApres);

    // Supprimer toutes les voitures fabriquées avant 2000
    const countAvant = await voituresCollection.countDocuments({
      annee_production: { $lt: 2000 },
    });
    console.log(
      `Nombre de voitures fabriquées avant 2000 avant la suppression : ${countAvant}`
    );

    console.log(
      "Suppression de toutes toutes les voitures fabriquées avant 2000"
    );
    await voituresCollection.deleteMany({ annee_production: { $lt: 2000 } });

    const countApres = await voituresCollection.countDocuments({
      annee_production: { $lt: 2000 },
    });
    console.log(
      `Nombre de voitures fabriquées avant 2000 après la suppression : ${countApres}`
    );

    // Changer la couleur d'un certain modèle
    const modèleVoiture = "Outback";
    const nouvelleCouleur = "Blanc";

    const voitureOutbackAvant = await voituresCollection
      .find({ modele: modèleVoiture })
      .limit(2)
      .toArray();
    console.log(`Liste des 2 premières voitures du modèle ${modèleVoiture} :`);
    console.log(voitureOutbackAvant);

    console.log(
      `Changement de la couleur du modèle ${modèleVoiture} en ${nouvelleCouleur}`
    );
    await voituresCollection.updateMany(
      { modele: modèleVoiture },
      { $set: { couleur: nouvelleCouleur } }
    );

    const voitureOutbackAprès = await voituresCollection
      .find({ modele: modèleVoiture })
      .limit(2)
      .toArray();
    console.log(`Liste des 2 premières voitures du modèle ${modèleVoiture} :`);
    console.log(voitureOutbackAprès);

    // Ajouter les options pour Minibus/Utilitaire
    const options = ["Wifi", "Toilette", "Radio DAB+"];

    const voitureMinibusUtilitaireAvant = await voituresCollection
      .find({ categorie: "Minibus/Utilitaire" })
      .limit(2)
      .toArray();
    console.log(`Liste des 2 premiers Minibus/Utilitaire :`);
    console.log(voitureMinibusUtilitaireAvant);

    console.log(
      `Ajout d'options ${options.toString()} pour Minibus/Utilitaire:`
    );

    await voituresCollection.updateMany(
      { categorie: "Minibus/Utilitaire" },
      { $addToSet: { options: { $each: options } } }
    );

    const voitureMinibusUtilitaireAprès = await voituresCollection
      .find({ categorie: "Minibus/Utilitaire" })
      .limit(2)
      .toArray();
    console.log(`Liste des 2 premiers Minibus/Utilitaire :`);
    console.log(voitureMinibusUtilitaireAprès);

    // Supprimer les véhicules qui ont plus de 500 000 km
    const nbVehiculesAvant = await voituresCollection.countDocuments();
    console.log(`Nombre de véhicules totales : ${nbVehiculesAvant}`);

    console.log("Suppression de tous les véhicules qui ont plus de 500 000 km");
    await voituresCollection.deleteMany({ kilometrage: { $gt: 500000 } });

    const nbVehiculesAprès = await voituresCollection.countDocuments();
    console.log(
      `Nombre de véhicules restantes après la suppression des véhicules avec plus de 500000 km : ${nbVehiculesAprès}`
    );

    /* Requêtes complexes */
    console.log("--------------- Requêtes complexes ---------------");

    // Compter le nombre de véhicules sous garantie pour chaque marque
    const countVehiculesSousGarantieParMarque = await voituresCollection
      .aggregate([
        {
          $match: { sous_garantie: true },
        },
        {
          $group: {
            _id: "$marque",
            nombre_vehicules: { $sum: 1 },
          },
        },
      ])
      .toArray();

    console.log(
      "Nombre de véhicules sous garantie par marque : ",
      countVehiculesSousGarantieParMarque
    );

    // Donner le kilométrage moyen pour chaque catégorie
    const kilolométrageMoyenParCategorie = await voituresCollection
      .aggregate([
        {
          $group: {
            _id: "$categorie",
            kilometrage_moyen: { $avg: "$kilometrage" },
          },
        },
      ])
      .toArray();

    console.log(
      "Kilométrage moyen par catégorie :",
      kilolométrageMoyenParCategorie
    );

    // Compter le nombre de véhicules vendus pour chaque couleur
    const countVehiculesVendusParCouleur = await voituresCollection
      .aggregate([
        {
          $match: { etat: "Vendue" },
        },
        {
          $group: {
            _id: "$couleur",
            nombre_vehicules: { $sum: 1 },
          },
        },
      ])
      .toArray();

    console.log(
      "Nombre de véhicules vendus par couleur : ",
      countVehiculesVendusParCouleur
    );

    // Calculer la somme de tous les kilomètres parcourues parmis tous les véhiculants roulant avec le même type de carburant
    const kilometrageTotalParTypeCarburant = await voituresCollection
      .aggregate([
        {
          $group: {
            _id: "$moteur.carburant",
            totalKilomètres: { $sum: "$kilometrage" },
          },
        },
      ])
      .toArray();

    console.log("Somme des kilomètres parcourus par type de carburant :");
    console.log(kilometrageTotalParTypeCarburant);

    // Indiquer la capacité moteur la plus élevé parmi les véhicules produits après 2010 pour chaque transmission
    const MeilleurCapaciteMoteurParTransmission = await voituresCollection
      .aggregate([
        {
          $match: {
            annee_production: { $gt: 2010 }, // Filtrer les véhicules produits après 2010
          },
        },
        {
          $group: {
            _id: "$transmission", // Grouper par transmission
            meilleurCapaciterMoteur: { $max: "$moteur.capacite_moteur" }, // Trouver la capacité moteur maximale dans chaque groupe
          },
        },
        {
          $sort: { _id: 1 }, // Trier les résultats par ordre de transmission (optionnel)
        },
        {
          $group: {
            _id: null,
            transmissions: {
              $push: {
                transmission: "$_id",
                MeilleurCapaciterMoteur: "$meilleurCapaciterMoteur",
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            transmissions: 1,
          },
        },
      ])
      .toArray();

    console.log(
      "Capacité moteur la plus élevée parmi les véhicules produits après 2010 pour chaque transmission :"
    );
    console.log(JSON.stringify(MeilleurCapaciteMoteurParTransmission, null, 2));

    /* Tests de montée en charge */
    console.log("--------------- Test de montée en charge ---------------");
    console.log("Suppression de toutes les données de la base avant le début du test")
    await voituresCollection.deleteMany({});

    // Mesurer le temps pour les opérations d'insertion
    const startTempsInsertion = performance.now();
    // Insertion d'environ un million de voitures
    for (let nbInsertion = 0; nbInsertion < 27; nbInsertion++) {
      for (let i in data) {
        data[i]._id = new ObjectId();
      }
      await voituresCollection.insertMany(data);
    }
    const endTempsInsertion = performance.now();
    const insertionTemps = endTempsInsertion - startTempsInsertion;
    const count = await voituresCollection.countDocuments();
    console.log(`Nombre de voitures pour le tesf de montée en charge : ${count}`);
    console.log(
      `Temps nécessaire pour l'insertion : ${convertMStoS(insertionTemps)}`
    );


    // Mesurer le temps pour les opérations de mise à jour (Incrémenter le champ "prix" de chaque document de 1)
    const startTempsMiseAJour = performance.now();
    await voituresCollection.updateMany({}, { $inc: { prix: 1 } });
    const endTempsMiseAJour = performance.now();
    const miseAJourTemps = endTempsMiseAJour - startTempsMiseAJour;
    console.log(
      `Temps nécessaire pour la mise à jour : ${convertMStoS(miseAJourTemps)}`
    );

    // Mesurer le temps pour les opérations de suppression
    const startTempsSuppression = performance.now();
    await voituresCollection.deleteMany({});
    const endTempsSuppression = performance.now();
    const suppressionTemps = endTempsSuppression - startTempsSuppression;
    console.log(
      `Temps nécessaire pour la suppression : ${convertMStoS(suppressionTemps)}`
    );

  } finally {
    await client.close();
  }
}

/**
 * Fonction pour formater le temps en secondes
 * @param {*} time temps en millisecondes
 * @returns le temps en secondes avec 2 décimales
 */
const convertMStoS = (time) => {
  const seconds = (time / 1000).toFixed(2);
  return `${seconds} secondes`;
};

run().catch(console.dir);
