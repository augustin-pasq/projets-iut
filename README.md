# Punto
Projet #1 de la ressource R5.10 - Nouveaux paradigmes de base de données du parcours Réalisation d'applications : conception, développement, validation de la troisième année du BUT informatique à l'IUT de Vannes.

## Description
L'objectif du projet consiste en une implémentation du jeu de société Punto. Les données de jeu doivent pouvoir être stockées, au choix de l'utilisateur, sur une base de données MySQL, MongoDB, SQLite ou Neo4j.
Un outil de gestion des données est également inclus pour procéder à de l'import/export/suppression/génération de données.
À noter que les bases de données ne communiquent pas entre elles.

## Règles du jeu
Les règles du Punto sont disponibles ici : https://montvalsurloir.bibli.fr/doc_num.php?explnum_id=4140

### Règles non implémentées
- Dans le cas d'une partie à trois joueurs, la couleur neutre compte quand même (il peut se passer des choses inattendues dans le cas d'une victoire avec cette couleur)
- La grille est fixe, rendant impossible de jouer plus de 2 cartes autour du carré central de 4 cases (là où dans le jeu original, il est impossible de dépasser une grille de 6x6, certes, mais rien n'empêche de jouer toujours à gauche de la première carte posée par exemple)
- Toutes les cartes sont remélangées au début d'une manche, le gagnant n'enlève pas la carte avec le plus de points
- Jeu par équipes

## Fonctionnalités
- `/`
  - Choix de la base de données à utiliser (MySQL, MongoDB, SQLite ou Neo4j)
- `/play`
  - Jeu du Punto, de 2 à 4 joueurs avec choix du pseudo
  - Multijoueur en ligne via WebSocket
  - Nombre de manches personnalisable
- `/admin`
  - Outil de gestion des bases de données
  - Export du contenu de la base en cours, par table (indisponible pour la base Neo4j)
  - Import du contenu de chacune des bases, par table (indisponible pour la base Neo4j)
  - Réinitialisation de la base de données

## Installation

### Application web
- Stack technologique : React.js + Next.js + Prisma (ORM) / Neo4j Driver + PrimeReact
- Installation des dépendances :
```bash
npm install
```

### Bases de données
- Ajouter un fichier ``.env`` à la racine du projet :
```env
MYSQL_DATABASE_URL=<mysql_database_url>
MONGODB_DATABASE_URL=<mongodb_database_url>
NEO4J_URL=<neo4j_database_url>
NEO4J_USER=<neo4j_database_user>
NEO4J_PASSWORD=<neo4j_database_password>
```
<sup>Note : Le connecteur de base de données MongoDB utilise des transactions pour prendre en charge les écritures imbriquées. Les transactions nécessitent un déploiement de jeu de réplicas. Le moyen le plus simple de déployer un jeu de réplicas consiste à utiliser Atlas. C'est gratuit pour commencer.</sup>
- Créer une base de données "Punto" sur chacun des SGBD
- Créer les tables des bases de données MySQL et SQLite avec les scripts de création du dossier ``database``
- Créer les tables de la base de données MongoDB à partir du schéma Prisma :
```bash
npx prisma db push --schema prisma/mongodb-schema.prisma
```
- Créer les clients Prisma :
```bash
npx prisma generate --schema prisma/mysql-schema.prisma
npx prisma generate --schema prisma/mongodb-schema.prisma
npx prisma generate --schema prisma/sqlite-schema.prisma
```

### Build de l'application
```bash
npm run build
```

### Lancement de l'application
```bash
npm run start-all
```

## Schéma de la base de données
![schema.png](database%2Fschema.png)

## Améliorations possibles
- Revoir l'affichage de gauche :
    - Afficher le joueur dont c'est le tour
    - Afficher les decks des autres joueurs
    - Masquer la carte tant que ce n'est pas le tour du joueur
- Afficher les emplacements disponibles pour poser une carte
- Faire le responsive

## Auteur
- Augustin Pasquier ([@augustin-pasq](https://github.com/augustin-pasq))