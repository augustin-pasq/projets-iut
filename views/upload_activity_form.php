<?php

include __ROOT__ . "/views/header.html";
include __ROOT__ . "/views/menu.html";

if (!isset($_SESSION["id"]) || $_SESSION["id"] == null) {
  header("location:/");
  exit();
}

?>

<div class="main-container">
  <h1>Importer des données</h1>
  <?php if ($data['isImported']) echo "<p id='updated'>Les données ont été importées</p>" ?>
  <form action="/upload" method="post" enctype="multipart/form-data">
    <input type="file" id="file" name="file" accept=".json" required><br><br>
    <input type="submit" value="Importer">
  </form>
</div>