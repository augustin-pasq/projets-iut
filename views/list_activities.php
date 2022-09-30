<style>
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

td, th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #dddddd;
}
</style>

<?php include __ROOT__."/views/header.html"; 
if( $_SESSION["id"] == null) {
    header("location:connect");
    exit();
}
?>




<h1>Liste des activités</h1>

<?php 

print_r($data);

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