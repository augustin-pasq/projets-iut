/**
 * R4.03 NoSQL
 * Projet
 *
 * PASQUIER Augustin
 * LE NY Liam
 * 05/06/2023
 */

const csv = require("csvtojson");
const mongoose = require("mongoose");
const { performance } = require("perf_hooks");
const ExcelJS = require("exceljs");
const { ObjectId } = mongoose.Types;

async function run() {
  try {
    const data = await csv().fromFile("../data/Voitures.csv");
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
    // Connexion à la base de données
    await mongoose.connect("mongodb://localhost:27017/Concessionnaire", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connexion à la base de données réussie");

    const voitureSchema = new mongoose.Schema({
      marque: { type: String, required: true },
      modele: { type: String, required: true },
      boite_vitesse: {
        type: String,
        enum: ["Automatique", "Manuelle"],
        required: true,
      },
      annee_production: { type: Number, required: true },
      couleur: {
        type: String,
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
        required: true,
      },
      moteur: {
        carburant: {
          type: String,
          enum: ["Essence", "Diesel", "Électrique", "GPL", "Hybride"],
          required: true,
        },
        capacite_moteur: { type: Number, min: 0.2, max: 8.0, required: true },
      },
      kilometrage: { type: Number, required: true },
      categorie: { type: String, required: true },
      sous_garantie: { type: Boolean, required: true },
      etat: {
        type: String,
        enum: ["Urgence", "Nouvelle", "Vendue"],
        required: true,
      },
      transmission: {
        type: String,
        enum: ["Propulsion", "Traction", "4 roues motrices"],
        required: true,
      },
      prix: { type: Number, min: 1, required: true },
      date_publication: { type: Date, required: true },
    });

    const Voiture = mongoose.model("Voiture", voitureSchema);

    const tempsInsertion = [];
    const tempsMiseAJour = [];
    const tempsSuppression = [];
    const nbVoituresTest = [];

    for (let nbTests = 1; nbTests < 28; nbTests++) {
      // Mesurer le temps pour les opérations d'insertion
      const startTempsInsertion = performance.now();
      for (let nbInsertion = 0; nbInsertion < nbTests; nbInsertion++) {
        const documents = data.map((item) => {
          const voiture = new Voiture(item);
          voiture._id = new ObjectId();
          return voiture;
        });
        await Voiture.insertMany(documents);
      }
      const endTempsInsertion = performance.now();
      const insertionTemps = endTempsInsertion - startTempsInsertion;
      tempsInsertion.push(convertMStoS(insertionTemps));

      const count = await Voiture.countDocuments();
      console.log(
        `Nombre de voitures pour le test de montée en charge : ${count}`
      );
      nbVoituresTest.push(count);

      // Mesurer le temps pour les opérations de mise à jour (Incrémenter le champ "prix" de chaque document de 1)
      const startTempsMiseAJour = performance.now();
      await Voiture.updateMany({}, { $inc: { prix: 1 } });
      const endTempsMiseAJour = performance.now();
      const miseAJourTemps = endTempsMiseAJour - startTempsMiseAJour;
      tempsMiseAJour.push(convertMStoS(miseAJourTemps));

      // Mesurer le temps pour les opérations de suppression
      const startTempsSuppression = performance.now();
      await Voiture.deleteMany({});
      const endTempsSuppression = performance.now();
      const suppressionTemps = endTempsSuppression - startTempsSuppression;
      tempsSuppression.push(convertMStoS(suppressionTemps));
    }

    // Exporter vers Excel
    exporterVersExcel(
      nbVoituresTest,
      tempsInsertion,
      tempsMiseAJour,
      tempsSuppression
    );
  } finally {
    await mongoose.connection.close();
  }
}

/**
 * Fonction pour formater le temps en secondes
 * @param {*} time temps en millisecondes
 * @returns le temps en secondes avec 2 décimales
 */
const convertMStoS = (time) => {
  const seconds = (time / 1000).toFixed(2);
  secondsString = seconds.toString();
  secondsString = secondsString.replace(/\./g, ",");
  return secondsString;
};

async function exporterVersExcel(
  nbVoituresTest,
  tempsInsertion,
  tempsMiseAJour,
  tempsSuppression
) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Données");

  // Ajouter les en-têtes de colonnes
  worksheet.getCell("A1").value = "Nombre de voitures testées";
  worksheet.getCell("B1").value = "Temps d'insertion";
  worksheet.getCell("C1").value = "Temps de mise à jour";
  worksheet.getCell("D1").value = "Temps de suppression";

  // Remplir les données
  for (let i = 0; i < nbVoituresTest.length; i++) {
    const row = worksheet.getRow(i + 2);
    row.getCell("A").value = nbVoituresTest[i];
    row.getCell("B").value = tempsInsertion[i];
    row.getCell("C").value = tempsMiseAJour[i];
    row.getCell("D").value = tempsSuppression[i];
  }

  // Enregistrer le fichier Excel
  await workbook.xlsx.writeFile("../results/données_mongoose.xlsx");
  console.log("Le fichier Excel a été créé avec succès.");
}

run().catch(console.error);
