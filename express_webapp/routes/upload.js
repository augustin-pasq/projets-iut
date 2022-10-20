var express = require('express');
var router = express.Router();
const fileUpload = require('express-fileupload');
var db = require('sport-track-db').db;
var activity_dao = require('sport-track-db').activity_dao;
var activity_entry_dao = require('sport-track-db').activity_entry_dao;
const calcDist = require("../../functions/calcDist")

router.use(fileUpload());

router.get('/', async function (req, res, next) {
  if (req.session.userID == undefined) { res.redirect('/') }
  else {
    res.render('upload_activity_form', { 'isImported': undefined });
  }
});

router.post('/', async function (req, res) {

  try {
    sampleFile = req.files.activity;
    var data = JSON.parse(sampleFile.data);

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

    userActivities = await readDB(`SELECT date, time, activityUser FROM Activity JOIN DataActivity ON Activity.rowid = DataActivity.idActivity WHERE activityUser='${req.session.userID}';`);
    var basicData = {
      'date': data.activity.date,
      'time': data.data[0].time,
      'activityUser': req.session.userID
    };

    if (!userActivities.find(element => JSON.stringify(element) === JSON.stringify(basicData))) {
      activity_dao.insert([data.activity.date, data.activity.description, calcDist.calculDistanceTrajet(data), req.session.userID]);
      activityContent = await readDB(`SELECT MAX(rowid) FROM Activity WHERE activityUser = '${req.session.userID}';`);
      data.data.forEach(element => { activity_entry_dao.insert([element.time, element.cardio_frequency, element.latitude, element.longitude, element.altitude, activityContent[0]['MAX(rowid)']]) });
      var isImported = true;
    } else {
      var isImported = false;
    }
  } catch (e) {
    console.log(e)
    var isImported = false;
  }

  res.render('upload_activity_form', { 'isImported': isImported });
});

module.exports = router;
