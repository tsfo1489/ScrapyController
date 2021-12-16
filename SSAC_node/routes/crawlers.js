var express = require('express');
var router = express.Router();
var request = require('request');
var md5 = require('md5');

/* GET users listing. */
router.get('/', function(req, res, next) {
  request('http://127.0.0.1:5000/crawlers', function(err, response, body){
    data = JSON.parse(body)
    console.log(data)
    param_color = {}
    for(crawler in data){
      for(spider in data[crawler]['spiders']){
        for(idx in data[crawler]['spiders'][spider]['parameters']){
          param = data[crawler]['spiders'][spider]['parameters'][idx]
          param_color[param] = md5(param).slice(0, 6);
        }
      }
    }
    console.log(param_color);
    res.render("crawler", {
      title: "SSAC/Crawler",
      keys: Object.keys(data), 
      data: data, 
      param_color: param_color
    });
  });
});

router.post('/add/:crawler_name', function(req, res, next) {
  var crawler_name = req.params.crawler_name;
  var crawler_data = req.body;
  console.log(JSON.stringify(crawler_data));
  request.post({
    url: 'http://127.0.0.1:5000/crawlers/' + crawler_name,
    headers: {'Content-Type': 'application/json; charset=UTF-8'},
    body: JSON.stringify(crawler_data)
  }, function (err, response, body) {
    console.log(err);
    res.json(body);
  });
});

module.exports = router;