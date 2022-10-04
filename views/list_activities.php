<?php

include __ROOT__ . "/views/header.html";
include __ROOT__ . "/views/menu.html";

if ($_SESSION["id"] == null) {
    header("location:/");
    exit();
}

?>

<div class="main-container" id="list-activities">
    <h1>Liste des activités</h1>

    <table>
        <tr>
            <th>Description</th>
            <th>Date</th>
            <th>Heure de début</th>
            <th>Durée</th>
            <th>Distance</th>
            <th>Fréquence cardiaque<br>moyenne</th>
            <th>Fréquence cardiaque<br>minimale</th>
            <th>Fréquence cardiaque<br>maximale</th>
        </tr>

        <?php
        for ($i = 0; $i < count($data); $i++) {
            echo "<tr>";

            foreach ($data[$i] as $value) {
                echo "<td>", $value, "</td>";
            }

            echo "</tr>";
        }
        ?>

    </table>
</div>