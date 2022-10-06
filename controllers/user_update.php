<?php

session_start();

require(__ROOT__.'/controllers/Controller.php');
require(__ROOT__.'/php/Utilisateur.php');
require(__ROOT__.'/php/UtilisateurDAO.php');

class AddUserController extends Controller {

    public function get($request) {
        if ($_SESSION["id"] == null) {
            header("location:/");
            exit();
        }
          
        $gestionUser = UtilisateurDAO::getInstance();
        $user_info = $gestionUser->findUser($_SESSION['id']);
        $lname = $user_info["0"]->getlname();
        $fname = $user_info["0"]->getfname();
        $birthdate = $user_info["0"]->getBirthdate();
        $sex = $user_info["0"]->getSex();
        $height = $user_info["0"]->getHeight();
        $weight = $user_info["0"]->getWeight();

        $this->render('user_update_form',['lname' => $lname, 'fname' => $fname, 'birthdate' => $birthdate, 'sex' => $sex, 'height' => $height, 'weight' => $weight]);
    }

    public function post($request) {

        $lname = $request['lname'];
        $fname = $request['fname'];
        $birthdate = $request['birthdate'];
        $sex = $request['sex'];
        $height = $request['height'];
        $weight = $request['weight'];
        $email = $_SESSION['id'];
        $password = "";

        $gestionUser = UtilisateurDAO::getInstance();
        $user = new Utilisateur;
        $user->init($lname, $fname, $birthdate, $sex, $height, $weight, $email, $password);
        $gestionUser->update($user);

        $this->render('user_update_form',['lname' => $lname, 'fname' => $fname, 'birthdate' => $birthdate, 'sex' => $sex, 'height' => $height, 'weight' => $weight, 'isUpdated' => true]); 
    }
}

?>