var express = require('express');
var router = express.Router();
var db = require('sport-track-db').db;

router.get('/', async function (req, res, next) {
  if (req.session.userID == undefined) { res.redirect('/') }
  else {

    readDB = function (query) {
      return new Promise(function (resolve, reject) {
        db.all(query, function (err, rows) {
          if (err) reject("Read error: " + err.message)
          else {
            resolve(rows)
          }
        })
      })
    };

    var activities = await readDB(`SELECT * FROM Activity WHERE activityUser = '${req.session.userID}' ORDER BY Activity.rowid DESC;`);
    var dataActivities = await readDB(`SELECT AVG(cardio_frequency), MIN(cardio_frequency), MAX(cardio_frequency), MIN(time), MAX(time) FROM DataActivity JOIN Activity ON Activity.rowid = DataActivity.idActivity WHERE activityUser='${req.session.userID}' GROUP BY Activity.rowid ORDER BY Activity.rowid DESC;`);

    var data = []

    for (let i = 0; i < activities.length; i++) {

      data.push({
        'description': activities[i].description,
        'date': activities[i].date,
        'start': 'TO DO',
        'time': 'TO DO',
        'distance': activities[i].distance >= 1000 ? `${Math.round($activities[i].distance * 1000)} km` : `${Math.round(activities[i].distance)} m`,
        'avg_cf': `${Math.round(dataActivities[i]['AVG(cardio_frequency)'])} bpm`,
        'min_cf': `${dataActivities[i]['MIN(cardio_frequency)']} bpm`,
        'max_cf': `${dataActivities[i]['MAX(cardio_frequency)']} bpm`,
      });
    }

    console.log(data)
    res.render('list_activities', data);
  }
});

module.exports = router;
