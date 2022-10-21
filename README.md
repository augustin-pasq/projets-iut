# SportTrack

Projet d'application web de suivi de données sportives - Projet universitaire.

## Description

Ce projet, s'inscrivant dans le cadre de la ressource R3.01 - Développement web du BUT Informatique à l'IUT de Vannes, a pour but de développer en PHP et en JavaScript une application de suivi de données sportives.

## Lancement

Des instructions se trouvent dans les dossiers `PHP` et `JavaScript`.

## Arborescence

`database` : Fichiers pour la base de données, contient entre autres le script de création et le fichier de base de données (`sport_track.db`). Le SGBD utilisé est SQLite 3.

`javascript` : Contient l'ensemble des fichiers nécessaires à l'application codée en JavaScript. Des détails sont disponible dans le fichier `README.md` du dossier.

`php` : Contient l'ensemble des fichiers nécessaires à l'application codée en PHP. Des détails sont disponible dans le fichier `README.md` du dossier.

`tests` : Contient des données fictives (e.g. des fichiers d'activité physique) pour tester le fonctionnement de l'application. Ces fichiers sont au format `.json` et suivent la structure suivante :
```
{
    "activity": {
        "date": "01/09/2022",
        "description": "IUT -> RU"
    },
    "data": [
        {
            "time": "13:00:00",
            "cardio_frequency": 99,
            "latitude": 47.644795,
            "longitude": -2.776605,
            "altitude": 18
        },
        {
            "time": "13:00:05",
            "cardio_frequency": 100,
            "latitude": 47.646870,
            "longitude": -2.778911,
            "altitude": 18
        }
    ]
}
```

`website` : Contient les éléments de l'interface de l'application web.