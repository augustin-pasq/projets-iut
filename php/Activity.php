<?php

class Utilisateur {
    
    private int $id;
    private string $date;
    private string $description;

    public function  __construct() {}
    
    public function init($i, $da, $de) {
        $this->id = $i;
        $this->date = $da;
        $this->description = $de;

    }

    function getId(): int { return $this->id; }
    function getDate(): string { return $this->date; }
    function getDescription(): string { return $this->description; }

    function setId(int $id) { $this->id = $id; }
    function setDate(string $date) { $this->date = $date; }
    function setDescription(string $description) { $this->description = $description; }

    public function  __toString(): string {
        return "Id : " . $this->id . " | Date : " . $this->date . " | Description : " . $this->description . "\n";
    }
}

?>