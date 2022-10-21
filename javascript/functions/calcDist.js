function deg2rad(degrees) {
    var pi = Math.PI;
    return degrees * (pi / 180);
}

/**
 * Retourne la distance en mètres entre 2 points GPS exprimés en degrés.
 * @param lat1 Latitude du premier point GPS
 * @param long1 Longitude du premier point GPS
 * @param lat2 Latitude du second point GPS
 * @param long2 Longitude du second point GPS
 * @return La distance entre les deux points GPS
 */
function calculDistance2PointsGPS(lat1, long1, lat2, long2) {
    return 6378137 * Math.acos(Math.sin(deg2rad(lat1)) * Math.sin(deg2rad(lat2)) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.cos(deg2rad(long1 - long2)));
}

/**
 * Retourne la distance en mètres du parcours passé en paramètres. Le parcours est
 * défini par un tableau ordonné de points GPS.
 * @param parcours Le tableau contenant les points GPS
 * @return La distance du parcours
 */
function calculDistanceTrajet(content) {
    data = content.data;

    distance = 0;
    for (let i = 0; i < data.length - 1; i += 1) {
        distance += calculDistance2PointsGPS(data[i].latitude, data[i].longitude, data[i + 1].latitude, data[i + 1].longitude);
    }

    return distance;
}

module.exports = { calculDistanceTrajet }