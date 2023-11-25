# TODO

## Urgent
- [x] Superposition : la valeur de la carte doit être supérieure à celle déjà posée
- [x] Des fois couleur manquante
- [ ] Conditions d'arrêt :
  - Série de 4 cartes de la même couleur → je le vérifie à chaque fois qu'on pose une carte : on prend toutes les séries de la couleur et on vérifie si c'est à suivre
  - Plus de cartes dans le deck
  - Dès qu'un joueur ne peut plus poser de cartes :
    - Compter le nombre de séries de 3 par joueur
    - Si égalité : la série la plus faible gagne
- [x] Triage des cartes à la fin de la manche
- [ ] Stocker la date des opérations
- [x] Stocker les victoires et les défaites du joueur
- [ ] Gestion des manches

## Important
- [ ] Afficher les decks des autres joueurs / Revoir l'affichage de gauche

## Moyennement important
- [ ] Masquer la carte tant que ce n'est pas le tour du joueur
- [ ] Afficher le joueur dont c'est le tour
- [ ] Afficher les emplacements disponibles pour poser une carte

## On verra
- [ ] Faire le responsive

## Règles non implémentées :
- Dans le cas d'une partie à trois joueurs, la couleur neutre compte quand même (il peut se passer des choses bizarres dans le cas d'une victoire avec cette couleur)
- Ce n'est pas le joueur le plus jeune qui commence, mais le premier qui a créé son pseudo
- Impossible de jouer tout le temps à gauche, comme la grille est fixe
- Une série est gagnante dès 4 cartes, même pour un jeu à 2 joueurs (au lieu de 5 cartes)
- Toutes les cartes sont remélangées au début d'une manche, le gagnant n'enlève pas la carte avec le plus de points
- Jeu par équipes

## Fonctionnalités manquantes :
- Gestion des déconnexions