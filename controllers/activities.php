<?php
require(__ROOT__.'/controllers/Controller.php');
require(__ROOT__.'/php/SqliteConnection.php');

class ListActivityController extends Controller{

    public function get($request){
        $db = SqliteConnection::getInstance()->getConnection();
        $query = "SELECT * FROM Activity JOIN DataActivity ON idActivity = rowid;";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $affichage = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        
        print_r($affichage);

        $this->render('list_activities',[]);
    }
}

?>
