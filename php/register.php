<?php

use SQLiteConnection;
use SQLiteInsert;

$pdo = (new SQLiteConnection())->connect();
$sqlite = new SQLiteInsert($pdo);

/*
$lname = 'lname';
$fname = 'fname';
$birthdate = 'birthdate';
$sex = 'sex';
$height = 'height';
$weight = 'weight';
$email = 'email';
$password = hash('sha512', 'password');*/
$projectId = $sqlite->insertProject('PHP SQLite Demo');
$lname = 'lname';
$fname = 'fname';
$birthdate = '2022-01-01';
$sex = 'F';
$height = 1;
$weight = 2;
$email = 'email';
$password = 'password';

$pdo->insertTask($lname, $fname, $birthdate, $sex, $height, $weight, $email, $password, $projectId);

?>