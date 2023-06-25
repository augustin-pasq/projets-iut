# Projet NoSQL

Projet NoSQL de la ressource R4.03 - Qualité et non relationnel du BUT Informatique 2ème année.

## Arborescence du projet

- ```/app``` : contient l'application web permettant une interaction simple avec les donénes
- ```/data``` : contient le jeux de données du projet
- ```/results``` : contient les résultats des tests de montée en charge
- ```/scripts``` : contient les scripts de remplissage, de requêtage et de tests de montée en charge
- ```config.yaml``` : fichier de configuration pour lancer le serveur Mongod

## Rapport

Le fichier ``Rapport.docx`` constitue le rapport détaillé du travail effectué ainsi que le rendu du projet.

## Installation

### Application web

- Stack technologique : React.js + Next.js + Prisma (ORM) + PrimeReact
- Installation des dépendances : ```npm install```
- Lancement de l'application : ```npm run dev```

### Base de données

- Installation de MongoDB : https://docs.mongodb.com/manual/installation/
- Lancemement du serveur : ```mongod --config config.yaml```

### Scripts

- Installation des dépendances : ```npm install```
- Lancement des scripts : ```node [script].js```

## Auteurs

Augustin Pasquier et Liam Le Ny