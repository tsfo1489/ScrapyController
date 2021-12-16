var crawler_data

$(document).ready(function () {
});

function AddParam(target_num){
  var $param_group =$('#spider-' + target_num + ' > .spider-param') 
  var $param_cnt = $param_group.children().last().attr('name')
  if($param_cnt == undefined)
    $param_cnt = 0
  else 
    $param_cnt = parseInt($param_cnt) + 1
  console.log($param_cnt)
  $param_group.append(`
  <div class="input-group mb-1" name="` + $param_cnt + `">
    <button class="btn btn-outline-danger" onclick="DeleteParam(`+ target_num + ',' + $param_cnt + `)" type="button" title="Delete Spider">-</button>
    <input class="form-control param-name" id="` + target_num + '_' + $param_cnt + `" type="text" placeholder="Parameter Name" aria-label="Parameter Name">
  </div>`)
}

function DeleteParam(spider_n, param_n){
  var $param = $('#spider-' + spider_n + ' > .spider-param > [name=' + param_n + ']')
  $param.remove()
}

function AddSpider(target_num){
  var $spider_group =$('#spiders') 
  var $spider_cnt = $spider_group.children().last().attr('name')
  if($spider_cnt == undefined)
    $spider_cnt = 0
  else 
    $spider_cnt = parseInt($spider_cnt) + 1
  console.log($spider_cnt)
  $spider_group.append(`
  <div class="spider-group mb-3" id="spider-` + $spider_cnt + `" name="` + $spider_cnt + `">
    <div class="input-group mb-1">
      <button class="btn btn-outline-danger" onclick="DeleteSpider(` + $spider_cnt + `)" type="button" title="Delete Spider">-</button>
      <input class="form-control spider-name" type="text" placeholder="Spider Name" aria-label="Spider Name">
      <button class="btn btn-outline-success" onclick="AddParam(` + $spider_cnt + `)" type="button" title="Add Parameters">+</button>
    </div>
    <div class="spider-param ms-3"></div>
  </div>`)
}

function DeleteSpider(spider_n){
  var $param = $('#spider-' + spider_n)
  $param.remove()
}

async function Submit(){
  var new_crawler = {};
  if($('#CrawlerName').val() == '') {
    alert('Please Enter Crawler name');
    return;
  }
  var crawler_name = $('#CrawlerName').val();
  if($('#PathText').val() == '') {
    alert('Please Enter Path');
    return;
  }
  new_crawler.path = $('#PathText').val();
  var spider_list = $('.spider-group')
  var spider_name;
  new_crawler.spiders = {}
  for(i = 0; i < spider_list.length; i++){
    spider_name = $(spider_list[i]).find('.spider-name').val();
    if(spider_name == ''){
      alert('Please Enter Crawler name');
      return;
    }
    new_crawler.spiders[spider_name] = {}
    new_crawler.spiders[spider_name].parameters = []
    for(j = 0; j < $(spider_list[i]).find('.param-name').length; j++){
      if($($(spider_list[i]).find('.param-name')[j]).val() == ''){
        alert('Please Enter Parameter name');
        return;
      }
      new_crawler.spiders[spider_name].parameters.push($($(spider_list[i]).find('.param-name')[j]).val());
    }
  }
  file = $('#CrawlerFile')[0].files[0];
  const reader = new FileReader();
  new_crawler['file_name'] = file.name;
  new_crawler['file_bytes'] = reader.readAsDataURL(file, encoding='utf-8');
  reader.onload = function(){
    new_crawler['file_bytes'] = reader.result;
    $.ajax({
      url: '/crawlers/add/' + crawler_name,
      method: "POST",
      contentType: "application/json; charset=utf-8",
      data:JSON.stringify(new_crawler),
      dataType: "json",
      success: function(result) {
        console.log(result);
      }
    });
  }
}