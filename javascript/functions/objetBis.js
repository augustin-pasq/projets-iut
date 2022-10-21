class CalculDistance {

    /**
     * Retourne la distance en mètres entre 2 points GPS exprimés en degrés.
     * @param lat1 Latitude du premier point GPS
     * @param long1 Longitude du premier point GPS
     * @param lat2 Latitude du second point GPS
     * @param long2 Longitude du second point GPS
     * @return La distance entre les deux points GPS
     */
    calculDistance2PointsGPS(lat1, long1, lat2, long2) {

        // Conversion en radian des coordonnées en degré
        var pi = Math.PI;
        lat1 = lat1 * (pi / 180);
        long1 = long1 * (pi / 180);
        lat2 = lat2 * (pi / 180);
        long2 = long2 * (pi / 180);

        // Calcul de distance
        return 6378137 * Math.acos(Math.sin(lat1) * Math.sin(lat2) + Math.cos(lat1) * Math.cos(lat2) * Math.cos(long1 - long2));
    }

    /**
     * Retourne la distance en mètres du parcours passé en paramètres. Le parcours est
     * défini par un tableau ordonné de points GPS.
     * @param parcours Le tableau contenant les points GPS
     * @return La distance du parcours
     */
    calculDistanceTrajet(fileName) {

        let data = require(fileName);

        // Récupérer seulement le partie data du ficher Json
        data = data.data;

        let distance = 0;
        for (let i = 0; i < data.length - 1; i += 1) distance += this.calculDistance2PointsGPS(data[i].latitude, data[i].longitude, data[i + 1].latitude, data[i + 1].longitude);

        return distance;
    }
}

calcDist = new CalculDistance();
console.log(calcDist.calculDistanceTrajet("./dataTests.json") + " m");