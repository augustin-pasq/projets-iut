<?php

include __ROOT__."/views/header.html";

if ($_SESSION['id'] == null) {
  header("location:/");
  exit();
}

unset($_SESSION['id']);

?>

<div class="main-container">
  <h1>SportTrack</h1>

  <?php if ($data['isDisconnected']) echo "<p class='success-message'>Vous avez été déconnecté de l'application</p>"; ?>

  <button onclick="location.href='/connect'">Connexion</a></button><br>
  <button onclick="location.href='/user_add'">Inscription</a></button><br>
  <p id="about"><a href="/apropos">A propos de SportTrack</a></p>
</div>