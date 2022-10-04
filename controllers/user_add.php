<?php
require(__ROOT__.'/controllers/Controller.php');
require(__ROOT__.'/php/Utilisateur.php');
require(__ROOT__.'/php/UtilisateurDAO.php');

session_start();

class AddUserController extends Controller{

    public function get($request){
        $this->render('user_add_form',[]);
    }

    public function post($request){

        $redirect = "user_add_form";
        $_SESSION["id"] = null;

        $lname = $request['lname'];
        $fname = $request['fname'];
        $birthdate = $request['birthdate'];
        $sex = $request['sex'];
        $height = $request['height'];
        $weight = $request['weight'];
        $email = $request['email'];
        $password = $request['password'];

        $user = new Utilisateur;
        $user->init($lname, $fname, $birthdate, $sex, $height, $weight, $email, $password);
        $gestionUser = UtilisateurDAO::getInstance();

        if ($gestionUser->findUser($email) == null) {
            $_SESSION["id"] = $email;
            $gestionUser->insert($user);
            $redirect = "user_add_valid";
        }

        $this->render($redirect,['lname' => $lname, 'fname' => $fname, 'email' => $email]);
    }
}
