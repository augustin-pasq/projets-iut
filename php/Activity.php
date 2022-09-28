<?php

class Activity {
    
    private string $date;
    private string $description;
    private string $distance;
    private string $mailUser;

    public function  __construct() {}
    
    public function init($da, $de, $di, $a) {
        $this->date = $da;
        $this->description = $de;
        $this->distance = $di;
        $this->mailUser = $a;

    }

    function getDate(): string { return $this->date; }
    function getDescription(): string { return $this->description; }
    function getDistance(): string { return $this->distance; }
    function getMailUser(): string { return $this->mailUser; }

    function setDate(string $date) { $this->date = $date; } 
    function setDescription(string $description) { $this->description = $description; }
    function setDistance(string $distance) { $this->distance = $distance; }
    function setMailUser(string $mailUser) { $this->mailUser = $mailUser; }

    public function  __toString(): string {
        return " | Date : " . $this->date . " | Description : " . $this->description . " | Distance : " . $this->distance . " | Mail de l'utilisateur : " . $this->mailUser . "\n";
    }
}

?>