<?php

class ActivityEntry {
    
    private string $time;
    private int $cardio;
    private float $latitude;
    private float $longitude;
    private int $altitude;
    private int $idActivity;


    public function  __construct() {}
    
    public function init($t, $c, $la, $lo, $a, $i) {
        $this->time = $t;
        $this->cardio = $c;
        $this->latitude = $la;
        $this->longitude = $lo;
        $this->altitude = $a;
        $this->idActivity = $i;  

    }

    function getTime(): string { return $this->time; }
    function getCardio(): int { return $this->cardio; }
    function getLatitude(): float { return $this->latitude; }
    function getLongitude(): float { return $this->longitude; }
    function getAltitude(): int { return $this->altitude; }
    function getIdActivity(): int { return $this->idActivity; }

    function setTime(string $time) { $this->time = $time; } 
    function setCardio(int $cardio) { $this->cardio = $cardio; }
    function setLatitude(float $latitude) { $this->latitude = $latitude; }
    function setLongitude(float $longitude) { $this->longitude = $longitude; } 
    function setAltitude(int $altitude) { $this->altitude = $altitude; }
    function setIdActivity(float $idActivity) { $this->idActivity = $idActivity; }

    public function  __toString(): string {
        return " | Temps : " . $this->temps . " | Fréquence cardiaque : " . $this->cardio . " | Latitude : " . $this->latitude . " | Longitude : " . $this->longitude. " | Altitude : " . $this->altitude. " | Id de l'activité : " . $this->idActivity . "\n";
    }
}

?>