<?php

class Activity {
    
    private string $date;
    private string $description;
    private string $mailUser;

    public function  __construct() {}
    
    public function init($da, $de, $a) {
        $this->date = $da;
        $this->description = $de;
        $this->mailUser = $a;

    }

    function getDate(): string { return $this->date; }
    function getDescription(): string { return $this->description; }
    function getMailUser(): string { return $this->mailUser; }

    function setDate(string $date) { $this->date = $date; } 
    function setDescription(string $description) { $this->description = $description; }
    function setMailUser(string $mailUser) { $this->mailUser = $mailUser; }

    public function  __toString(): string {
        return " | Date : " . $this->date . " | Description : " . $this->description . " | Mail de l'utilisateur : " . $this->mailUser . "\n";
    }
}

?>