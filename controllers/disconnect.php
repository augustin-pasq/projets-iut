<?php
require(__ROOT__.'/controllers/Controller.php');

class DisconnectUserController extends Controller{

    public function get($request){
        $this->render('user_disconnect',[]);
    }

}

?>