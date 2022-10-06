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
        $this->render('upload_activity_form',['isImported' => "not yet"]);
    }

    public function post($request){
        $activityInfo = new CalculDistance();
        try {
            $data = json_decode(file_get_contents($_FILES['file']['tmp_name']), true);
            
            $db = SqliteConnection::getInstance()->getConnection();
            $query = "SELECT date, time, activityUser FROM Activity JOIN DataActivity ON Activity.rowid = DataActivity.idActivity WHERE activityUser='" . $_SESSION['id'] . "';";
            $stmt = $db->prepare($query);
            $stmt->execute();
            $affichage = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $basicData = [
                'date' => $data["activity"]["date"],
                'time' => $data["data"][0]["time"],
                'activityUser' => $_SESSION["id"]
            ];

            if (!in_array($basicData, $affichage)) { 
                $activity = new Activity();
                $activity->init($data["activity"]["date"], $data["activity"]["description"], $activityInfo->calculDistanceTrajet($activityInfo->getAllCoordinates($_FILES['file']['tmp_name'])), $_SESSION["id"]);
                $gestionActivity =  ActivityDAO::getInstance();
                $gestionActivity->insert($activity);

                $db = SqliteConnection::getInstance()->getConnection();
                $query = "SELECT MAX(rowid) FROM Activity WHERE activityUser='" . $_SESSION["id"] . "';";
                $stmt = $db->prepare($query);
                $stmt->execute();
                $affichage = $stmt->fetchAll(PDO::FETCH_ASSOC);

                foreach($data['data'] as $activityPart) {
                    $activityEntry = new ActivityEntry;
                    $activityEntry->init($activityPart["time"], $activityPart["cardio_frequency"], $activityPart["latitude"], $activityPart["longitude"], $activityPart["altitude"], $affichage[0]['MAX(rowid)']);
                    $gestionActivityEntry =  ActivityEntryDAO::getInstance();
                    $gestionActivityEntry->insert($activityEntry);
                }
                $isImported = "true";
            } else {
                $isImported = "false";
            }
        } catch (Exception $e) {
            $isImported = "false";
        }

        $this->render('upload_activity_form',['isImported' => $isImported]);
    }
}
