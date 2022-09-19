<?php

class SQLiteConnection {

    private $db;

    public function connect() {
        if ($this->db == null) $this->db = new \PDO("sqlite:/mnt/c/Users/Augustin Pasquier/Documents/Cours/IUT/BUT INFO 2/R3.01 - Développement web/SportTrack/database/sport_track.db");
        return $this->db;
    }
}

?>