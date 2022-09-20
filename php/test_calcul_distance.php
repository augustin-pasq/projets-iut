<?php
include "CalculDistance.php";

$data = json_decode(file_get_contents("../tests/dataTests.json"), true);
$parcours = [];
print_r($data);
foreach($data["data"] as $value) {
    $parcours[] = $value["latitude"];
    $parcours[] = $value["longitude"];
}
?>