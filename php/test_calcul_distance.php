<?php
include "CalculDistance.php";

function readJSON(String $pathToFile) : Array
{
    $data = json_decode(file_get_contents("../tests/dataTests.json"), true);
    $parcours = [];

    foreach($data["data"] as $value) {
        $parcours[] = $value["latitude"];
        $parcours[] = $value["longitude"];
    }

    return $parcours;
}

$test = readJSON("../test/dataTests.json");
$cd = new CalculDistance();
echo($cd->calculDistanceTrajet($test)); // Expected : 770 m

?>