<?php

include "CalculDistance.php";

$test = new CalculDistance();
$data = $test->getAllCoordinates("../tests/dataTests.json");
echo("[+] Test de calcul de distance : ");
echo($test->calculDistanceTrajet($data) . " m \n"); // Expected : 770 m

?>