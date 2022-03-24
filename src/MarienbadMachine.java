/**
 * Jeu de Marienbad en joueur contre machine
 * @author Augustin Pasquier
 */

import java.util.Arrays;

class MarienbadMachine {    
    void principal() {
        partie();
        //tests();
    }
    
    // MÉTHODES DU JEU
    /**
     * Plateau de jeu avec les allumettes
     */
    char[][] allumettes = {
        {'|'},
        {'|', '|', '|'},
        {'|', '|', '|', '|', '|'},
        {'|', '|', '|', '|', '|', '|', '|'}
    };
    
    /**
     * Tableau de valeurs en binaire du nombre d'allumettes
     */
    int[][] binaire = {
        {0, 0, 1},
        {0, 1, 1},
        {1, 0, 1},
        {1, 1, 1},
        {0, 0, 0}
    };

    /**
     * Affiche le plateau
     */
    void affPlateau() {
        for (int i = 0; i < allumettes.length; i++) {
            System.out.print("\n" + i + " :\t");
            for (int j = 0; j < allumettes[i].length; j++) {
                System.out.print(" " + allumettes[i][j]);
            }
        }

        System.out.print("\n\n-----------------------------\n");
    }
    
    /**
     * Supprime le nombre d'allumettes demandé pour la ligne donnée
     * @param ligne ligne sur laquelle on retire des allumettes
     * @param nbAllumettes nombre d'allumettes à enlever
     */
    void suppAllumettes(int ligne, int nbAllumettes) {
        int i = allumettes[ligne].length - 1;
        while (nbAllumettes != 0) {
            while (allumettes[ligne][i] == ' ') {
                i = i - 1;
            }
            allumettes[ligne][i] = ' ';
            nbAllumettes = nbAllumettes - 1;
            i = i - 1;
        }
    }
    
    /**
     * Compte le nombre d'allumettes pour chaque ligne
     * @return ret tableau contenant le nombre d'allumettes sur chaque ligne
     */
    int[] compteur() {
        int ret[] = new int[4];
        
        for (int i = 0; i < allumettes.length; i++) {
            for (int j = 0; j < allumettes[i].length; j++) {
                if (allumettes[i][j] == '|') {
                    ret[i] = ret[i] + 1;
                }
            }
        }
        return ret;
    }
    
    void majBinaire(int ligne) {
        int[] nbAllumettes = compteur();
        
        // Conversion du nombre d'allumettes restantes en nombre binaire sur 3 bits
        String resteBinaire = Integer.toString(nbAllumettes[ligne], 2);
        while (resteBinaire.length() < 3) {
            resteBinaire = "0" + resteBinaire;
        }
        
        // Mise à jour du tableau en binaire
        int resteBinaireInt;
        for (int i = 0; i < binaire[ligne].length; i++) {
            resteBinaireInt = Character.getNumericValue(resteBinaire.charAt(i));
            binaire[ligne][i] = resteBinaireInt;
        }
    }
    
    /**
     * Tour d'un joueur: sélection de la ligne et du nombre d'allumette à enlever
     */
    void tour() {
        int[] qteAllumettes = compteur();
        
        int ligne = SimpleInput.getInt("Sur quelle ligne enlever des allumettes ? ");
        while (ligne < 0 || ligne >= allumettes.length || qteAllumettes[ligne] == 0) {
            System.out.print("Valeur incorrecte. Réessayez. ");
            ligne = SimpleInput.getInt("Sur quelle ligne enlever des allumettes ? ");
        }
        
        int nbAllumettes = SimpleInput.getInt("Combien d'allumettes à enlever ? ");
        while (nbAllumettes <= 0 || qteAllumettes[ligne] < nbAllumettes) {
            System.out.print("Valeur incorrecte. Réessayez. ");
            nbAllumettes = SimpleInput.getInt("Combien d'allumettes à enlever ? ");
        }

        suppAllumettes(ligne, nbAllumettes);
        majBinaire(ligne);
    }
    
    int[] testSomme(int ligne, String valTest) {
        
        // Sauvegarde de l'état initial de la ligne
        int[] tmp = new int[binaire[ligne].length];
        for (int i = 0; i < binaire[ligne].length; i++) {
            tmp[i] = binaire[ligne][i];
        }
        
        // Mise à jour du tableau en binaire
        int resteBinaireInt;
        for (int i = 0; i < binaire[ligne].length; i++) {
            resteBinaireInt = Character.getNumericValue(valTest.charAt(i));
            binaire[ligne][i] = resteBinaireInt;
        }
        
        // Somme de chaque colonne du tableau en binaire
        int[] ret = new int[3];
        ret[0] = binaire[0][0] + binaire[1][0] + binaire[2][0] + binaire[3][0];
        ret[1] = binaire[0][1] + binaire[1][1] + binaire[2][1] + binaire[3][1];
        ret[2] = binaire[0][2] + binaire[1][2] + binaire[2][2] + binaire[3][2];
        
        // Remise du tableau en binaire à son état d'origine
        for (int i = 0; i < binaire[ligne].length; i++) {
            binaire[ligne][i] = tmp[i];
        }
        
        return ret;
    }
    
    /**
     * Tour de la machine
     */
    void tourMachine() {
        int[] nbAllumettes = compteur();
        
        // Somme de chaque colonne du tableau en binaire
        binaire[4][0] = binaire[0][0] + binaire[1][0] + binaire[2][0] + binaire[3][0];
        binaire[4][1] = binaire[0][1] + binaire[1][1] + binaire[2][1] + binaire[3][1];
        binaire[4][2] = binaire[0][2] + binaire[1][2] + binaire[2][2] + binaire[3][2];
        
        // Préparation du nombre d'allumettes à enlever en binaire
        int i = 0;
        int j;
        boolean pair = false;
        String[] solutions = {"001", "010", "011", "100", "101", "110", "111"};
        int ligne = 0;
        String choixMachineBinaire = "";
        int allumettesSuppMachine;
        
        // Choix du nombre d'allumettes à enlever en binaire
        if (binaire[4][0] % 2 != 0 || binaire[4][1] % 2 != 0 || binaire[4][2] % 2 != 0) {
            
            // Test de toutes les possibilités pour trouver la bonne
            while (i < binaire.length - 1 && pair == false) {
                j = 0;
                while (j < solutions.length && pair == false) {
                    if (j < nbAllumettes[i] && nbAllumettes[i] != 0) {
                        int[] somme = testSomme(i, solutions[j]);
                        if (somme[0] % 2 == 0 && somme[1] % 2 == 0 && somme[2] % 2 == 0) {
                            pair = true;
                            ligne = i;
                            choixMachineBinaire = solutions[j];
                        }
                    }
                    j = j + 1;
                }
                i = i + 1;
            }
            
            // Cas où il faut enlever toutes les allumettes de la ligne
            i = 0;
            if (pair == false) {
                while (i < binaire.length - 1 && pair == false) {
                    int[] somme = testSomme(i, "000");
                    if (somme[0] % 2 == 0 && somme[1] % 2 == 0 && somme[2] % 2 == 0) {
                        pair = true;
                        ligne = i;
                        choixMachineBinaire = Integer.toString(nbAllumettes[ligne], 2);
                    }
                    i = i + 1;
                }
            }
            
            // Conversion du nombre d'allumettes en binaire à enlever en nombre décimal
            int choixMachine = Integer.parseInt(choixMachineBinaire, 2);
            if (choixMachine == nbAllumettes[ligne]) {
                allumettesSuppMachine = nbAllumettes[ligne];
            } else {
                allumettesSuppMachine = nbAllumettes[ligne] - choixMachine;
            }
            
        } else {
            do {
                ligne = (int)(Math.random() * (allumettes.length + 1));
            } while (nbAllumettes[ligne] == 0);
            allumettesSuppMachine = 1 + (int)(Math.random() * ((nbAllumettes[ligne] - 1) + 1));
        }
        
        // Affichage des choix de l'ordinateur
        System.out.println("L'ordinateur choisit la ligne " + ligne + " et supprime " + allumettesSuppMachine + " allumette(s).");
        
        // Suppression des allumettes
        suppAllumettes(ligne, allumettesSuppMachine);
        
        // Mise à jour du tableau en binaire
        majBinaire(ligne);
    }
    
    /**
     * Partie de jeu
     */
    void partie() {
        int[] nbAllumettes = compteur();
        int[] dataPlayer = new int[2];
        String joueur = SimpleInput.getString("Nom du joueur : ");
        int i;
        do {
            i = SimpleInput.getInt("\nQui joue en premier ?\n0 : " + joueur + "\n1 : Ordinateur\nEntrez un numéro : ");
        } while (i != 0 && i != 1);
        
        // Le jeu d'arrête s'il n'y a plus d'allumettes
        while ((nbAllumettes[0] + nbAllumettes[1] + nbAllumettes[2] + nbAllumettes[3]) != 0) {
            
            // Affichage du plateau
            affPlateau();
            
            // Sélection du joueur puis lancement du tour
            if (i % 2 == 0) {
                System.out.println("C'est au tour de " + joueur);
                tour();
            } else {
                System.out.println("C'est au tour de l'ordinateur");
                tourMachine();
            }

            // Calcul du nombre d'allumettes restantes
            nbAllumettes = compteur();
            
            // Changement de joueur
            i = i + 1;
            
        }
        
        affPlateau();
        
        // Annonce du gagnant
        if (i % 2 == 0) {
            System.out.println("L'ordinateur a retiré la dernière allumette et gagne donc la partie !");
        } else {
            System.out.println(joueur + " a retiré la dernière allumette et gagne donc la partie !");
        }
    }
    
    // MÉTHODES DE TEST
    /**
     * Méthode pour tester toutes les méthodes d'un coup
     */
     
    void tests() {
        testAffPlateau();
        testSuppAllumettes();
        testCompteur();
        testMajBinaire();
        testTestSomme();
        testTour();
        testTourMachine();
        testPartie();
    }
    
    /**
     * Test de affPlateau()
     */
    void testAffPlateau() {
        System.out.println();
        System.out.println("*** testAffPlateau()");
        affPlateau();
        System.out.println();        
    }
    
    /**
     * Test de suppAllumettes()
     */
    void testSuppAllumettes() {
        System.out.println();
        System.out.println("*** testSuppAllumettes()");
        System.out.println("Avant suppression d'allumettes :");
        affPlateau();
        System.out.println("Suppression de l'allumette de la première ligne...");
        suppAllumettes(0, 1);
        majBinaire(0);
        System.out.println("Après suppression de l'allumette de la première ligne : ");
        affPlateau();
        System.out.println();        
    }
    
    /**
     * Test de compteur()
     */
    void testCompteur() {
        System.out.println();
        System.out.println("*** testCompteur()");
        System.out.println("Avant suppression d'allumettes : " + Arrays.toString(compteur()));
        System.out.println("Suppression des allumettes de la deuxième ligne...");
        suppAllumettes(1, 3);
        majBinaire(1);
        System.out.println("Après suppression des allumettes de deuxième ligne : " + Arrays.toString(compteur()));
        System.out.println();
    }
    
    /**
     * Test de majBinaire()
     */
    void testMajBinaire() {
        System.out.println();
        System.out.println("*** testMajBinaire()");
        System.out.println("Avant changement de valeurs dans le tableau de valeurs binaires : " + Arrays.deepToString(binaire));
        System.out.println("Suppression des allumettes de la troisième ligne...");
        suppAllumettes(2, 5);
        majBinaire(2);
        System.out.println("Après suppression des allumettes de la troisième ligne et donc mise à jour du tableau : " + Arrays.deepToString(binaire));
        System.out.println();
    }
    
    /**
     * Teste testSomme();
     */
    void testTestSomme() {
        System.out.println();
        System.out.println("*** testTestSomme()");
        
        int[] expectedResult = {1, 1, 2};
        testCasTestSomme(0, "001", expectedResult);
    }
    
    /**
     * Teste un appel de testTestSomme()
     * @param typeTour différents cas pouvant être rencontrés
     * @param message instruction au testeur
     */
    void testCasTestSomme(int ligne, String valTest, int[] result) {
        
        // Arrange
        affPlateau();
        System.out.print("testTour(" + ligne + ", " + valTest + ") \t= " + Arrays.toString(result) + "\t : ");
        
        // Act
        int[] resExec = testSomme(ligne, valTest);
        
        // Assert
        if (Arrays.equals(resExec, result)) {
            System.out.println("OK");
        } else {
            System.err.println("ERREUR");
        }
    }
    
    /**
     * Test de tour()
     */
    void testTour() {
        System.out.println();
        System.out.println("*** testTour()");
        
        testCasTour("Ligne et nombre d'allumettes corrects", "*** Entrer 3 à la saisie de ligne et 1 à la saisie du nombre d'allumettes");
        testCasTour("Ligne incorrecte et nombre d'allumettes correct", "*** Entrer -1 (puis 3 au second essai) à la saisie de ligne et 1 à la saisie du nombre d'allumettes");
        testCasTour("Ligne correcte et nombre d'allumettes incorrect", "*** Entrer 3 à la saisie de ligne et -1 (puis 1 au second essai) à la saisie du nombre d'allumettes");
        testCasTour("Ligne et nombre d'allumettes incorrects", "*** Entrer -1 (puis 3 au second essai) à la saisie de ligne et -1 (puis 1 au second essai) à la saisie du nombre d'allumettes");
        testCasTour("Ligne n'ayant plus d'allumettes", "*** Entrer 2 (puis 3 au second essai) à la saisie de ligne et 1 à la saisie du nombre d'allumettes");
    }
    
    /**
     * Teste un appel de tour()
     * @param typeTour différents cas pouvant être rencontrés
     * @param message instruction au testeur
     */
    void testCasTour(String typeTour, String message) {
        
        // Arrange
        System.out.println(typeTour + " :");
        System.out.println(message);
        
        // Act
        tour();
        System.out.println();
    }
    
    /**
     * Teste tourMachine();
     */
    void testTourMachine() {
        System.out.println();
        System.out.println("*** testTourMachine()");
        System.out.println("Avant le tour de la machine :");
        affPlateau();
        System.out.println("Suppression d'une allumette de la dernière ligne...");
        suppAllumettes(3, 1);
        tourMachine();
        System.out.println("Après suppression des allumettes de la troisième ligne :");
        affPlateau();
        System.out.println();
    }
    
    /**
     * Test de partie()
     */
    void testPartie () {
        System.out.println();
        System.out.println("*** testPartie()");
        
        testCasPartie("e joueur", "*** Faire commencer l'ordinateur. Utiliser le théorème de Sprague-Grundy pour fare gagner le joueur 1.");
        testCasPartie("'ordinateur", "*** Faire commencer le joueur. A chaque tour, retirer un nombre quelconque d'allumettes pour fare gagner l'ordinateur.");
    }
    
    /**
     * Teste un appel de partie()
     * @param joueur nom du joueur
     * @param message instruction au testeur
     */
    void testCasPartie(String joueur, String message) {
        
        // Arrange
        System.out.println("Partie victorieuse pour l" + joueur);
        System.out.println(message);
        
        // Act
        partie();
        System.out.println();
    }
}
