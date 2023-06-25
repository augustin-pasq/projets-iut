/**
 * R4.03 NoSQL
 * Projet
 *
 * PASQUIER Augustin
 * LE NY Liam
 * 12/06/2023
 */

const csv = require("csvtojson");
const mysql = require("mysql");
const { performance } = require("perf_hooks");
const ExcelJS = require("exceljs");

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

    // Connexion à la base de données MySQL
    const connection = mysql.createConnection({
      host: "localhost",
      user: "your_username",
      password: "your_password",
    });

    // Créer la base de données "Concessionnaire"
    connection.query(
      "CREATE DATABASE IF NOT EXISTS Concessionnaire",
      (error) => {
        if (error) {
          console.error(
            "Erreur lors de la création de la base de données : ",
            error
          );
        } else {
          console.log(
            "La base de données 'Concessionnaire' a été créée avec succès."
          );
          // Utiliser la base de données "Concessionnaire"
          connection.query("USE Concessionnaire", (error) => {
            if (error) {
              console.error(
                "Erreur lors de la sélection de la base de données : ",
                error
              );
            } else {
              console.log(
                "Utilisation de la base de données 'Concessionnaire'."
              );

              // Créer la table "voitures"
              const createTableQuery = `
            CREATE TABLE IF NOT EXISTS voitures (
              id INT AUTO_INCREMENT PRIMARY KEY,
              marque VARCHAR(255) NOT NULL,
              modele VARCHAR(255) NOT NULL,
              boite_vitesse ENUM('Automatique', 'Manuelle') NOT NULL,
              annee_production INT NOT NULL,
              couleur ENUM('Argent', 'Blanc', 'Bleu', 'Gris', 'Jaune', 'Marron', 'Noir', 'Orange', 'Rouge', 'Vert', 'Violet', 'Autre') NOT NULL,
              carburant ENUM('Essence', 'Diesel', 'Électrique', 'GPL', 'Hybride') NOT NULL,
              capacite_moteur DECIMAL(4, 1) NOT NULL,
              kilometrage INT NOT NULL,
              categorie VARCHAR(255) NOT NULL,
              sous_garantie BOOLEAN NOT NULL,
              etat ENUM('Urgence', 'Nouvelle', 'Vendue') NOT NULL,
              transmission ENUM('Propulsion', 'Traction', '4 roues motrices') NOT NULL,
              prix INT NOT NULL,
              date_publication DATE NOT NULL
            )
          `;
              connection.query(createTableQuery, (error) => {
                if (error) {
                  console.error(
                    "Erreur lors de la création de la table 'voitures' : ",
                    error
                  );
                } else {
                  console.log("La table 'voitures' a été créée avec succès.");
                }
              });
            }
          });
        }
      }
    );

    connection.connect(async (error) => {
      if (error) {
        console.error("Erreur de connexion à la base de données : ", error);
        return;
      }
      console.log("Connexion à la base de données réussie");

      const tempsInsertion = [];
      const tempsMiseAJour = [];
      const tempsSuppression = [];
      const nbVoituresTest = [];

      for (let nbTests = 1; nbTests < 28; nbTests++) {
        // Mesurer le temps pour les opérations d'insertion
        const startTempsInsertion = performance.now();
        for (let nbInsertion = 0; nbInsertion < nbTests; nbInsertion++) {
          const values = data.map((item) => {
            const values = [
              `'${item.marque}'`,
              `'${item.modele}'`,
              `'${item.boite_vitesse}'`,
              item.annee_production,
              `'${item.couleur}'`,
              item.kilometrage,
              item.sous_garantie,
              `'${item.etat}'`,
              `'${item.transmission}'`,
              item.prix,
              `'${item.date_publication.toISOString()}'`,
            ];
            return `(${values.join(",")})`;
          });
          const query = `INSERT INTO voitures (marque, modele, boite_vitesse, annee_production, couleur, kilometrage, sous_garantie, etat, transmission, prix, date_publication) VALUES ${values.join(
            ","
          )}`;
          connection.query(query);
        }
        const endTempsInsertion = performance.now();
        const insertionTemps = endTempsInsertion - startTempsInsertion;
        tempsInsertion.push(convertMStoS(insertionTemps));

        const countQuery = "SELECT COUNT(*) as count FROM voitures";
        const countResult = await executeQuery(connection, countQuery);
        const count = countResult[0].count;
        console.log(
          `Nombre de voitures pour le test de montée en charge : ${count}`
        );
        nbVoituresTest.push(count);

        // Mesurer le temps pour les opérations de mise à jour (Incrémenter le champ "prix" de chaque document de 1)
        const startTempsMiseAJour = performance.now();
        const updateQuery = "UPDATE voitures SET prix = prix + 1";
        connection.query(updateQuery);
        const endTempsMiseAJour = performance.now();
        const miseAJourTemps = endTempsMiseAJour - startTempsMiseAJour;
        tempsMiseAJour.push(convertMStoS(miseAJourTemps));

        // Mesurer le temps pour les opérations de suppression
        const startTempsSuppression = performance.now();
        const deleteQuery = "DELETE FROM voitures";
        connection.query(deleteQuery);
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
    });
  } catch (error) {
    console.error("Une erreur s'est produite : ", error);
  }
}

async function executeQuery(connection, query) {
  return new Promise((resolve, reject) => {
    connection.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
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
  await workbook.xlsx.writeFile("../results/donnees_mysql.xlsx");
  console.log("Le fichier Excel a été créé avec succès.");
}

run().catch(console.error);
