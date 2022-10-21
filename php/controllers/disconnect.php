<?php

session_start();

require(__ROOT__.'/controllers/Controller.php');

class DisconnectUserController extends Controller {

    public function get($request) {
        session_destroy();
        
        $this->render('user_disconnect',['isDisconnected' => true]);
    }
}

?>