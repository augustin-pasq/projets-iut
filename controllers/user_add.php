<?php
require(__ROOT__.'/controllers/Controller.php');
require(__ROOT__.'/php/Utilisateur.php');
require(__ROOT__.'/php/UtilisateurDAO.php');

class AddUserController extends Controller{

    public function get($request){
        $this->render('user_add_form',[]);
    }

    public function post($request){

        $redirect = "user_add_form";

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
            $gestionUser->insert($user);
            $redirect = "user_add_valid";
        }

        $this->render($redirect,['lname' => $lname, 'fname' => $fname, 'email' => $email]);
    }
}
