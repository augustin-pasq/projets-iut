<?php
require(__ROOT__.'/controllers/Controller.php');

class ConnectUserController extends Controller{

    public function get($request){
        $this->render('user_connect_form',[]);
    }

    public function post($request){
        $this->render('user_connect_valid',['email' => $request['email'], 'email' => $request['email']]);

        /*

        $email = $data['email'];
        $password = $data['password'];
        $password = password_hash($password, PASSWORD_DEFAULT);

        $dbc = SqliteConnection::getInstance()->getConnection();
        $query = "SELECT email FROM User WHERE email = '$email' AND password = '$password'";
        $stmt = $dbc->prepare($query);
        $stmt->execute();

        $ArrayEmail = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($ArrayEmail.count() == 1) {
            echo "Connexion réussi";
        } else {
            echo "Le mot de passe et/ou le mot de passe est erronée. Veuillez retenter.";
        }*/
    }
}

?>
