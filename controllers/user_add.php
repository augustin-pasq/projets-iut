<?php
require(__ROOT__.'/controllers/Controller.php');

class AddUserController extends Controller{

    public function get($request){
        $this->render('user_add_form',[]);
    }

    public function post($request){
        $this->render('user_add_valid',['lname' => $request['lname'], 'fname' => $request['fname'], 'birthdate' => $request['birthdate'], 'sex' => $request['sex'], 'height' => $request['height'], 'weight' => $request['weight'], 'email' => $request['email'], 'password' => $request['password']]);
    }
}

?>
