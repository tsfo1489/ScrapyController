var express = require('express');
var router = express.Router();
var request = require('request');
var md5 = require('md5');
var pug = require('pug');

/* GET home page. */
router.get('/', function(req, res, next) {
  request('http://127.0.0.1:5000/tasks', function(err, response, body){
    data = JSON.parse(body)
    res.render("index", {title:"SSAC", data: data});
  });
});

router.get('/config', function (req, res, next) {
  request('http://127.0.0.1:5000/crawlers', function (err, response, body) {
    data = JSON.parse(body)
    html = pug.renderFile("./views/task_add.pug", {
      data: data
    });
    res.json({html: html, data: data});
  });
});

router.post('/add/:task_name', function (req, res, next) {
  var task_name = req.params.task_name;
  var task_data = req.body;
  request.post({
    url: 'http://127.0.0.1:5000/tasks/' + task_name,
    headers: {'Content-Type': 'application/json; charset=UTF-8'},
    body: JSON.stringify(task_data)
  }, function (err, response, body) {
    res.json(JSON.parse(body));
  });
});

router.post('/refresh', function (req, res, next) {
  request.post({
    url: 'http://127.0.0.1:5000/refresh',
  }, function (err, response, body) {
  });
  res.send('OK')
});

router.post('/run/:task_name', function (req, res, next) {
  request.post({
    url: 'http://127.0.0.1:5000/run/' + req.params.task_name,
  }, function (err, response, body) {
  });
  res.send('OK');
});

router.get('/data/:task_name', function (req, res, next) {
  task_name = req.params.task_name
  request.get({
    url: 'http://127.0.0.1:5000/data/' + task_name,
  }, function (err, response, body) {
    if(response.statusCode != 200){
      res.send(body);
    }
    else{
      console.log();
      res.setHeader('Content-Disposition', `attachment; filename=${task_name}.json`);
      res.send(body)
    }
  });
});

router.get('/indexcard', function (req, res, next) {
  request('http://127.0.0.1:5000/tasks_stats', function (err, response, body) {
    data = JSON.parse(body)
    result = {};
    let readyList = {};
    let runList = {};
    let finishList = {};
    var param_color = {};
    for (obj in data){
      if(data[obj].status === "ready")
        readyList[obj] = data[obj];
      else if(data[obj].status === "run")
        runList[obj] = data[obj];
      else if(data[obj].status === "finish")
        finishList[obj] = data[obj];
      for(param in data[obj]['parameters']){
        param_color[param] = md5(param).slice(0, 6);
      }
    }
    ready_html = pug.renderFile("./views/task_card.pug", {cards: readyList, param_color: param_color});
    run_html = pug.renderFile("./views/task_card.pug", {cards: runList, param_color: param_color});
    finish_html = pug.renderFile("./views/task_card.pug", {cards: finishList, param_color: param_color});
    res.json({ready_html: ready_html, run_html:run_html, finish_html:finish_html});
  });
});
module.exports = router;
