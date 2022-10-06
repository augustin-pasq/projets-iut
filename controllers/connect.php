<?php
/**La fonction session_start() permet de démarrer une nouvelle session ou reprendre une session déjà existante. 
 * Quand cette fonction est exécutée, le serveur vérifie si la session qui a le même identifiant envoyé existe. 
 * Si oui, c'est cette session qui est reprise sinon une nouvelle session est créée et son identifiant est 
 * envoyé au client sous forme de cookie.  */
 session_start();

require(__ROOT__.'/controllers/Controller.php');
require(__ROOT__.'/php/Utilisateur.php');
require(__ROOT__.'/php/UtilisateurDAO.php');


class ConnectUserController extends Controller{

    public function get($request){
        $this->render('user_connect_form',['badCredentials' => true]);
    }

    public function post($request){

        $pageToRender = "user_connect_form";
        $data = [
            'badCredentials' => false
        ];

        $_SESSION["id"] = null;

        $email = $request['email'];
        $password = $request['password'];

        $gestionUser =  UtilisateurDAO::getInstance();

        $arrayUser = $gestionUser->findUser($email);
        $mdpUser = null;

        if ($arrayUser != null) $mdpUser = $arrayUser[0]->getPassword();
        
        if ($mdpUser != null) {
            /**
             * Pour vérifier la correspondance d'un mot de passe hashé en password_hash(), on utilise la fonction password_verify() qui recoit deux paramètres :
             * - le mot de passe non hashé
             * - le mot de passe hashé
             */
            if (password_verify($password, $mdpUser)) {
                $_SESSION["id"] = $email;
                $data['badCredentials'] = true;
                $data += ['fname' => $arrayUser[0]->getfName()];
                $pageToRender = "user_connect_valid";
            }
        }
        
        $this->render($pageToRender, $data);

    }
}

?>
