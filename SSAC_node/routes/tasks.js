var express = require('express');
var router = express.Router();
var pug = require('pug');
var request = require('request');
var md5 = require('md5');

/* GET users listing. */
router.get('/:task_name', function (req, res, next) {
  task_name = req.params.task_name
  console.log(task_name)
  request('http://127.0.0.1:5000/stats/' + task_name, function (err, response, body) {
    if(parseInt(response.statusCode / 100) == 2){
      data = JSON.parse(body);
      if(response.statusCode == 202){
        data = JSON.parse(data.task_data);
      }
      console.log(data);
      param_color = {}
      for(sch in data){
        for(param in data['parameters']){
          param_color[param] = md5(param).slice(0, 6);
        }
      }
      res.render('tasks', {
        title: task_name,
        data: data,
        param_color: param_color
      })
    }
    else{
      res.send(body);
    }
  });
});

router.get('/:task_name/log', function(req, res, next){
  task_name = req.params.task_name
  request('http://127.0.0.1:5000/logs/' + task_name, function (err, response, body) {
    if(response.statusCode != 200){
      res.send(body);
    }
    else{
      data = JSON.parse(body);
      console.log(data);
      res.json(data);
    }
  });
});

router.delete('/:task_name', function(req, res, next){
  task_name = req.params.task_name
  request.delete('http://127.0.0.1:5000/tasks/' + task_name, function (err, response, body) {
    if(response.statusCode != 200){
      res.send(body);
    }
    else{
      data = JSON.parse(body);
      console.log(data);
      res.json(data);
    }
  });
});

module.exports = router;