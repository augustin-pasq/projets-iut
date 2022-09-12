
<?php

$lname = $_POST['lname'];
$fname = $_POST['fname'];
$birthdate = $_POST['birthdate'];
$sex = $_POST['sex'];
$height = $_POST['value'];
$weight = $_POST['value'];
$email = $_POST['email'];
$password = $_POST['password'];
echo ("$lname, $fname, $birthdate, $sex, $height, $weight, $email, $password");


class MyDB extends SQLite3
{
    function __construct()
    {
        $this->open('..database/sport_track.db');
    }
}

$db = new MyDB();
$db->exec("INSERT INTO User (lname, fname, birthdate, sex, height, weight, email, password) VALUES ($lname, $fname, $birthdate, $sex, $height, $weight, $email, $password)");
var_dump($result->fetchArray());

?>