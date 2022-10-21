<?php

session_start();

require(__ROOT__.'/controllers/Controller.php');
require(__ROOT__.'/functions/Utilisateur.php');
require(__ROOT__.'/functions/UtilisateurDAO.php');

class ConnectUserController extends Controller {

    public function get($request) {
        $this->render('user_connect_form',['badCredentials' => true]);
    }

    public function post($request) {

        $pageToRender = "user_connect_form";
        $data = ['badCredentials' => false];
        $_SESSION["id"] = null;
        $email = $request['email'];
        $password = $request['password'];

        $gestionUser =  UtilisateurDAO::getInstance();
        $arrayUser = $gestionUser->findUser($email);
        $mdpUser = null;

        if ($arrayUser != null) $mdpUser = $arrayUser[0]->getPassword();
        
        if ($mdpUser != null && password_verify($password, $mdpUser)) {
            $_SESSION["id"] = $email;
            $data['badCredentials'] = true;
            $data += ['fname' => $arrayUser[0]->getfName()];
            $pageToRender = "user_connect_valid";
        }
        
        $this->render($pageToRender, $data);
    }
}

?>