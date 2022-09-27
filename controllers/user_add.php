<?php
require(__ROOT__.'/controllers/Controller.php');
require(__ROOT__.'/php/Utilisateur.php');
require(__ROOT__.'/php/UtilisateurDAO.php');

class AddUserController extends Controller{

    public function get($request){
        $this->render('user_add_form',[]);
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

        $user = new Utilisateur;
        $user->init($lname, $fname, $birthdate, $sex, $height, $weight, $email, $password);
        $gestionUser =  UtilisateurDAO::getInstance();

        if ($gestionUser->findUser($user) != null) { $this->render('user_add_valid',['lname' => $lname, 'fname' => $fname, 'email' => $email, 'hasAccount' => true]); }
        else {
            $gestionUser->insert($user);
            $this->render('user_add_valid',['lname' => $lname, 'fname' => $fname, 'email' => $email, 'hasAccount' => false]); }
    }
}
