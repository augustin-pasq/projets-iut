<?php
require(__ROOT__.'/controllers/Controller.php');

class ListActivityController extends Controller{

    public function get($request){
        $this->render('list_activities',[]);
    }
}

?>
