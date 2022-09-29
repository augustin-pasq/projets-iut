<?php include __ROOT__ . "/views/header.html";
$lname = $data['lname'];
?>
<link rel="stylesheet" href="../css/register.css">



<h1>Modifier mon profil</h1>
  <form action="../php/register.php" method="post" autocomplete="on">
    <label>Nom</label><br>
    <input type="text" id="lname" name="lname" value="<?php echo $lname;?>" pattern="^[A-Za-z0-9-\s]*$" required><br>
    <br>
   <input type="submit" value="Modifier">
</form>
