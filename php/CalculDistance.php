<?php
class CalculDistance {
    /**
     * Retourne la distance en mètres entre 2 points GPS exprimés en degrés.
     * @param float $lat1 Latitude du premier point GPS
     * @param float $long1 Longitude du premier point GPS
     * @param float $lat2 Latitude du second point GPS
     * @param float $long2 Longitude du second point GPS
     * @return float La distance entre les deux points GPS
     */
    public function calculDistance2PointsGPS(float $lat1, float $long1, float $lat2, float $long2): float 
    {
        return 6378137 * acos(sin(deg2rad($lat1)) * sin(deg2rad($lat2)) + cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * cos(deg2rad($long1 - $long2)));
    }

    /**
     * Retourne la distance en mètres du parcours passé en paramètres. Le parcours est
     * défini par un tableau ordonné de points GPS.
     * @param Array $parcours Le tableau contenant les points GPS
     * @return float La distance du parcours
     */
    public function calculDistanceTrajet(Array $parcours): float
    {
        $distance = 0;
        for($i = 0; $i < count($parcours); $i+=4) {
            $distance += ($this->calculDistance2PointsGPS($parcours[$i], $parcours[$i+2], $parcours[$i+1], $parcours[$i+3]));
        }

        return $distance;
    }
}
?>