<?php include __ROOT__."/views/header.html"; 

if( $_SESSION["id"] == null) {
    header("location:connect");
    exit();
}

?>




<h1>Liste des activités</h1>

<?php 

echo "<table>";
for($i = 0; $i < count($data); $i++) {
   echo "<tr>";

   foreach($data[$i] as $value) {
        echo "<td>", $value, "</td>";
   }

   echo "</tr>";
}

echo "</table>";



?>