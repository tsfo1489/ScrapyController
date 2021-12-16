var express = require('express');
var router = express.Router();
var pug = require('pug');
var request = require('request');
var md5 = require('md5');

/* GET users listing. */
router.get('/', function (req, res, next) {
  request('http://127.0.0.1:5000/schedules', function (err, response, body) {
    data = JSON.parse(body)
    console.log(data)
    param_color = {}
    for(sch in data){
      for(param in data[sch]['parameters']){
        param_color[param] = md5(param).slice(0, 6);
      }
    }
    res.render("schedule", {
      title:"SSAC/Schedule",
      data: data,
      param_color: param_color
    });
  });
});

router.get('/config', function (req, res, next) {
  request('http://127.0.0.1:5000/crawlers', function (err, response, body) {
    data = JSON.parse(body)
    console.log(data)
    html = pug.renderFile("./views/schedule_add.pug", {
      data: data
    });
    res.json({html: html, data: data});
  });
});

router.post('/:schedule_name', function (req, res, next) {
  var sch_name = req.params.schedule_name;
  var sch_data = req.body;
  request.post({
    url: 'http://127.0.0.1:5000/schedules/' + sch_name,
    headers: {'Content-Type': 'application/json; charset=UTF-8'},
    body: JSON.stringify(sch_data)
  }, function (err, response, body) {
    res.json(body);
  });
});

module.exports = router;