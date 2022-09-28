<?php
session_start();
require(__ROOT__.'/controllers/Controller.php');
require(__ROOT__.'/php/CalculDistance.php');
require(__ROOT__.'/php/Activity.php');
require(__ROOT__.'/php/ActivityDAO.php');
require(__ROOT__.'/php/ActivityEntry.php');
require(__ROOT__.'/php/ActivityEntryDAO.php');


class UploadActivityController extends Controller{

    public function get($request){
        $this->render('upload_activity_form',[]);
    }

    public function post($request){
        $activityInfo = new CalculDistance();
        $data = json_decode(file_get_contents($_FILES['file']['tmp_name']), true);

        $activity = new Activity();
        $activity->init($data["activity"]["date"], $data["activity"]["description"], $activityInfo->calculDistanceTrajet($activityInfo->getAllCoordinates($_FILES['file']['tmp_name'])), $_SESSION["id"]);
        $gestionActivity =  ActivityDAO::getInstance();
        $gestionActivity->insert($activity);

        $db = SqliteConnection::getInstance()->getConnection();
        $query = "SELECT MAX(rowid) FROM Activity WHERE activityUser='" . $_SESSION["id"] . "';";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $affichage = $stmt->fetchAll(PDO::FETCH_ASSOC);
        print_r($affichage);

        /*
        foreach($data['data'] as $activityPart) {
            $activityEntry = new ActivityEntry;
            $activityEntry->init($activityPart["time"], $activityPart["cardio_frequency"], $activityPart["latitude"], $activityPart["longitude"], $activityPart["altitude"], 1);
        }

        $gestionActivityEntry =  ActivityEntryDAO::getInstance();
        $gestionActivityEntry->insert($activityEntry);*/

        $this->render('upload_activity_form',['message' => 'Les données ont été correctement importées']);
    }
}
