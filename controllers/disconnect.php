<?php
session_start();
require(__ROOT__.'/controllers/Controller.php');

class DisconnectUserController extends Controller{

    public function get($request){

        /** Supprimer la variable d’environnement servant à identifier l’utilisateur */
        unset($_SESSION['id']);

        /** Détruire la session utilisateur */
        session_destroy();
        
        $this->render('user_disconnect',['isDisconnected' => true]);
    }

}

?>