/**
 * Jeu de Marienbad en joueur contre joueur
 * @author Augustin Pasquier
 */

import java.util.Arrays;

class Marienbad {
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
    }
    
    /**
     * Partie de jeu
     */
    void partie() {
        int[] nbAllumettes = compteur();
        int i = 0;
        String joueur1 = SimpleInput.getString("Nom du premier joueur : ");
        String joueur2 = SimpleInput.getString("Nom du second joueur : ");
        String joueur = joueur1;
        
        // Le jeu d'arrête s'il n'y a plus d'allumettes
        while ((nbAllumettes[0] + nbAllumettes[1] + nbAllumettes[2] + nbAllumettes[3]) != 0) {
            
            // Sélection du joueur
            if (i % 2 == 0) {
                joueur = joueur1;
            } else {
                joueur = joueur2;
            }
            
            // Affichage du plateau puis du nom du joueur, lancement d'un tour puis compte du nombre d'allumettes
            affPlateau();
            System.out.println("C'est au tour de " + joueur);
            tour();
            nbAllumettes = compteur();
            
            // Changement de joueur
            i = i + 1;
        }
        
        affPlateau();
        
        // Annonce du gagnant
        if (joueur == joueur1) {
            System.out.println(joueur1 + " a retiré la dernière allumette et gagne donc la partie !");
        } else {
            System.out.println(joueur2 + " a retiré la dernière allumette et gagne donc la partie !");
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
        testTour();
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
        System.out.println("Après suppression des allumettes de la deuxième ligne : " + Arrays.toString(compteur()));
        System.out.println();
    }
    
    /**
     * Test de tour()
     */
    void testTour() {
        System.out.println();
        System.out.println("*** testTour()");
        
        testCasTour("Ligne et nombre d'allumettes corrects", "*** Entrer 2 à la saisie de ligne et 1 à la saisie du nombre d'allumettes");
        testCasTour("Ligne incorrecte et nombre d'allumettes correct", "*** Entrer -1 (puis 2 au second essai) à la saisie de ligne et 1 à la saisie du nombre d'allumettes");
        testCasTour("Ligne correcte et nombre d'allumettes incorrect", "*** Entrer 2 à la saisie de ligne et -1 (puis 1 au second essai) à la saisie du nombre d'allumettes");
        testCasTour("Ligne et nombre d'allumettes incorrects", "*** Entrer -1 (puis 2 au second essai) à la saisie de ligne et -1 (puis 2 au second essai) à la saisie du nombre d'allumettes");
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
     * Test de partie()
     */
    void testPartie () {
        System.out.println();
        System.out.println("*** testPartie()");
        
        testCasPartie("joueur 1", "*** A chaque tour, retirer un nombre pair d'allumettes. Retirer ensuite la dernière allumette restante sur chaque ligne pour fare gagner le joueur 1.");
        testCasPartie("joueur 2", "*** A chaque tour, retirer un nombre impair d'allumettes pour fare gagner le joueur 2.");
    }
    
    /**
     * Teste un appel de partie()
     * @param joueur nom du joueur
     * @param message instruction au testeur
     */
    void testCasPartie(String joueur, String message) {
        
        // Arrange
        System.out.println("Partie victorieuse pour le " + joueur);
        System.out.println(message);
        
        // Act
        partie();
        System.out.println();
    }
}
