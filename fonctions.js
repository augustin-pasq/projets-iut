    function deg2rad(degrees)
    {
    var pi = Math.PI;
    return degrees * (pi/180);
    }

    /**
     * Retourne la distance en mètres entre 2 points GPS exprimés en degrés.
     * @param lat1 Latitude du premier point GPS
     * @param long1 Longitude du premier point GPS
     * @param lat2 Latitude du second point GPS
     * @param long2 Longitude du second point GPS
     * @return La distance entre les deux points GPS
     */
    function calculDistance2PointsGPS (lat1, lat2, long1, long2)  {
        return 6378137 * Math.acos(Math.sin(deg2rad(lat1)) * Math.sin(deg2rad(lat2)) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.cos(deg2rad(long1 - long2)));
    }

    /**
     * Retourne la distance en mètres du parcours passé en paramètres. Le parcours est
     * défini par un tableau ordonné de points GPS.
     * @param parcours Le tableau contenant les points GPS
     * @return La distance du parcours
     */
    function calculDistanceTrajet (parcours) {
        distance = 0;
        for(let i = 2; i < parcours.length; i+=2) {
            distance += calculDistance2PointsGPS(parcours[i-2], parcours[i-1], parcours[i], parcours[i+1]);
        }

        return distance;
    }

    function getAllCoordinates(pathToFile) {
        const fs = require('fs')
        let fichier = fs.readFileSync('dataTests.json')
        let data = JSON.parse(fichier)
        console.log(data)
        data = data["data"]
        var parcours = []

        for(let i = 2; i < data.length; i+=2) {
            //  push()	Il ajoute un ou plusieurs éléments à la fin d’un tableau.
            parcours.push(data["latitude"])
            parcours.push(data["longitude"])
        }

        return parcours;
        }


        // Test 
        $data = getAllCoordinates("C:\Users\liaml\Documents\BUT info 2\R3.01 Web\SportTrack\dataTests.json");
        console.log("[+] Test de calcul de distance : ");
        console.log(calculDistanceTrajet($data) + "m \n"); // Expected : 770 m
    
    


