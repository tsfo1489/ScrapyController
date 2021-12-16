var crawler_data

$(document).ready(function () {
  $('#AddModal').on("show.bs.modal", function (e) {
    var $this = $(this),
      loadurl = $this.attr('data-url')
    $.ajax({
      url: loadurl,
      method: "GET",
      dataType: "JSON",
      success: function(result) {
        $this.html(result.html)
        crawler_data = result.data
      }
    });
  });
});

function CrawlerChange(){
  var crawler_name = $('#crawler-select').val();
  var $spider_option = $('#spider-select');
  var $param_tag = $('#parameters');
  $spider_option.attr("disabled", false);
  $spider_option.children().remove();
  $param_tag.children().remove();
  console.log(crawler_data[crawler_name]['spiders'])
  $spider_option.append('<option selected>Choose Spider</option>');
  for(spi in crawler_data[crawler_name]['spiders']) {
    console.log('<option value="' + spi + '">' + spi + '</option>');
    $spider_option.append('<option value="' + spi + '">' + spi + '</option>');
  }
}

function SpiderChange(){
  var crawler_name = $('#crawler-select').val();
  var spider_name = $('#spider-select').val();
  var $param_tag = $('#parameters');
  var param_list = crawler_data[crawler_name]['spiders'][spider_name]['parameters'];
  $param_tag.children().remove();
  for(i = 0; i < param_list.length; i++) {
    console.log(param_list[i]);
    $param_tag.append(`
    <div class="input-group mb-3">  
      <div class="input-group-text">
        <input class="form-check-input mt-0" type="checkbox" value="" aria-label="Checkbox Param ` + i + `" id="param_check_` + i + `">
      </div>
      <span class="input-group-text">` + param_list[i] + `</span>
      <input type="text" class="form-control" aria-label="Text input Param ` + i + `" id="param_` + i + `">
    </div>`);
  }
}

function Submit(){
  var new_sch = {};
  if($('#TaskName').val() == '')
    alert('Please Enter Task name');
  var crawler_name = $('#crawler-select').val();
  if(crawler_name == 'Choose Crawler')
    alert('Please Select Crawler');
  var spider_name = $('#spider-select').val();
  if(spider_name == 'Choose Spider')
    alert('Please Select Spider');
  var param_list = crawler_data[crawler_name]['spiders'][spider_name]['parameters'];
  new_sch.log = $('#LogText').val();
  if(new_sch.log == '')
    alert('Please Enter Log');
  new_sch.crawler = crawler_name;
  new_sch.spider = spider_name;
  new_sch.parameters = {}
  for(i = 0; i < param_list.length; i++){
    if($('#param_check_' + i).is(':checked')){
      new_sch.parameters[param_list[i]] = $('#param_' + i).val();
    }
  }
  new_sch.options = {}
  console.log(new_sch);
  $.ajax({
    url: '/add/' + $('#TaskName').val(),
    method: "POST",
    contentType: "application/json; charset=utf-8",
    data:JSON.stringify(new_sch),
    dataType: "json",
    success: function(result) {
      if(result.message != 'Success'){
        alert(result.message)
      }
      location.reload();
    }
  });
  console.log(new_sch);
}