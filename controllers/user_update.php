<?php
session_start();
require(__ROOT__.'/controllers/Controller.php');
require(__ROOT__.'/php/Utilisateur.php');
require(__ROOT__.'/php/UtilisateurDAO.php');

class AddUserController extends Controller{

    public function get($request){
        $this->render('user_update_form',['lname' => "Test"]);
    }

    public function post($request){


        $lname = $request['lname'];
        $fname = $request['fname'];
        $birthdate = $request['birthdate'];
        $sex = $request['sex'];
        $height = $request['height'];
        $weight = $request['weight'];
        $email = $request['email'];
        $password = $request['password'];

        $gestionUser = UtilisateurDAO::getInstance();
        $user_info = $gestionUser->findUser($_SESSION['id']);
        $lname = $user_info[0];

        $user = new Utilisateur;
        $user->init($lname, $fname, $birthdate, $sex, $height, $weight, $email, $password);
        $gestionUser = UtilisateurDAO::getInstance();

        $this->render('user_update_form',['lname' => $lname]); 
    }
}
