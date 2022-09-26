<?php
require(__ROOT__.'/controllers/Controller.php');

class UploadActivityController extends Controller{

    public function get($request){
        $this->render('upload_activity_form',[]);
    }

    public function post($request){
        $this->render('upload_activity_form',['message' => 'Les données ont été correctement importées']);
    }
}

?>
