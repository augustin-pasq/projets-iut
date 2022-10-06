<?php
session_start();
require(__ROOT__.'/controllers/Controller.php');
require(__ROOT__.'/php/SqliteConnection.php');

class ListActivityController extends Controller{

    public function get($request){
        $db = SqliteConnection::getInstance()->getConnection();

        $query = "SELECT * FROM Activity WHERE activityUser='" . $_SESSION["id"] . "' ORDER BY Activity.rowid DESC;";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $activities = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $query = "SELECT AVG(cardio_frequency), MIN(cardio_frequency), MAX(cardio_frequency), MIN(time), MAX(time) FROM DataActivity JOIN Activity ON Activity.rowid = DataActivity.idActivity WHERE activityUser='" . $_SESSION["id"] . "' GROUP BY Activity.rowid ORDER BY Activity.rowid DESC;";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $dataActivities = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $data = [];
        
        for($i = 0; $i < count($activities); $i++) {
            date_default_timezone_set('GMT');
            $start = strtotime(date("m-d-Y", strtotime($activities[$i]['date'])) . ' ' . $dataActivities[$i]['MIN(time)']);
            $end = strtotime(date("m-d-Y", strtotime($activities[$i]['date'])) . ' ' . $dataActivities[$i]['MAX(time)']);

            $data[] = [
                'description' => $activities[$i]['description'],
                'date' => $activities[$i]['date'],
                'start' => date('H:i:s', $start),
                'time' => date("H:i:s", $end - $start),
                'distance' => $activities[$i]['distance'] >= 1000 ? round($activities[$i]['distance'] * 1000) . " km" : round($activities[$i]['distance']) . " m",
                'avg_cf' => round($dataActivities[$i]['AVG(cardio_frequency)']) . " bpm",
                'min_cf' => $dataActivities[$i]['MIN(cardio_frequency)'] . " bpm",
                'max_cf' => $dataActivities[$i]['MAX(cardio_frequency)'] . " bpm",
            ];
        }

        $this->render('list_activities', $data);
    }
}

?>
