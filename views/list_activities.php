<?php include __ROOT__."/views/header.html"; 
if( $_SESSION["id"] == null) {
    header("location:connect");
    exit();
}

?>



<h1>Liste des activités</h1>

