# Punto
Projet #1 de la ressource R5.10 - Nouveaux paradigmes de base de données du parcours Réalisation d'applications : conception, développement, validation de la troisième année du BUT informatique à l'IUT de Vannes.

## Description
L'objectif du projet consiste en une implémentation du jeu de société Punto. Les données de jeu doivent pouvoir être stockées, au choix de l'utilisateur, sur une base de données MySQL, MongoDB ou SQLite.
Un outil de gestion des données est également inclus pour procéder à de l'import/export/suppression/génération de données.
A noter que les trois bases de données ne communiquent pas entre elles.

## Règles du jeu
Les règles du Punto sont disponibles ici : https://montvalsurloir.bibli.fr/doc_num.php?explnum_id=4140

### Règles non implémentées
- Dans le cas d'une partie à trois joueurs, la couleur neutre compte quand même (il peut se passer des choses bizarres dans le cas d'une victoire avec cette couleur)
- Ce n'est pas le joueur le plus jeune qui commence, mais le premier qui a créé son pseudo
- Impossible de jouer tout le temps à gauche, comme la grille est fixe
- Une série est gagnante dès 4 cartes, même pour un jeu à 2 joueurs (au lieu de 5 cartes)
- Toutes les cartes sont remélangées au début d'une manche, le gagnant n'enlève pas la carte avec le plus de points
- Jeu par équipes

## Installation

### Application web
- Stack technologique : React.js + Next.js + Prisma (ORM) + PrimeReact
- Installation des dépendances :
```bash
npm install
```
- Lancement de l'application :
```bash
npm run dev
```

### Bases de données
- Ajouter un fichier ``.env`` à la racine du projet :
```env
MYSQL_DATABASE_URL=<mysql_database_url>
MONGODB_DATABASE_URL=<mongodb_database_url>
```
<sup>Note : Le connecteur de base de données MongoDB utilise des transactions pour prendre en charge les écritures imbriquées. Les transactions nécessitent un déploiement de jeu de réplicas. Le moyen le plus simple de déployer un jeu de réplicas consiste à utiliser Atlas. C'est gratuit pour commencer.</sup>
- Créer les clients Prisma :
```bash
npx prisma generate --schema prisma/mysql-schema.prisma
npx prisma generate --schema prisma/mongodb-schema.prisma
npx prisma generate --schema prisma/sqlite-schema.prisma
```
- Adapter le client Prisma pour SQLite à l'arborescence en remplaçant dans le fichier ``database/sqlite-client/schema.prisma`` ``file:../database/sqlite-database.db`` par : ``file:../../database/sqlite-database.db``

## Auteur
- Augustin Pasquier ([@augustin-pasq](https://github.com/augustin-pasq))