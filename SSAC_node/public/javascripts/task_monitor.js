var log_list;
$(document).ready(function () {
  var status = $('#status').html();
  var viewer = $('#LogViewer');
  if (status != 'ready') {
    $.ajax({
      url: location.pathname + '/log',
      method: 'GET',
      success: function (result) {
        log_list = result;
        for (idx in log_list) {
          viewer.append(buildLog(log_list[idx], idx));
        }
      }
    });
  }
});

function ChangeFilter(){
  var level_btn_list = $.find('button.active[level]');
  var level_list = [];
  for(idx in level_btn_list) {
    level_list.push($(level_btn_list[idx]).attr('level'));
  }
  var viewer = $('#LogViewer');
  viewer.children().remove();
  for(idx in log_list) {
    if(level_list.includes(log_list[idx].level)){
      viewer.append(buildLog(log_list[idx], idx));
    }
  }
}

function buildLog(log, id) {
  level_color = {
    'ERROR': 'btn-danger',
    'WARNING': 'btn-warning',
    'INFO': 'btn-primary',
    'DEBUG': 'btn-secondary'
  }
  var date = log.time.split('T')[0]
  var time = log.time.split('T')[1]
  var LogTag = $('<div>', {
    id: id,
    class: 'accordion-item'
  }).append(
    $('<h2>', {
      id: 'log-head-' + id,
      class: 'accordion-header'
    }).append(
      $('<div>', {
        class: 'accordion-button collapsed p-2 ' + level_color[log.level] + (log.content == '' ? ' accordion-button-nodata' : ''),
        type: 'button',
        'data-bs-toggle': (log.content != '' ? 'collapse' : ''),
        'data-bs-target': '#log-body-' + id,
        'aria-expanded': false,
        'aria-controls': 'log-body-' + id
      }).append(
        $('<p>', {
          html: date + '\n' + time,
          class: 'text-center m-0 text-break',
          style: 'width: 15%'
        })).append(
        $('<p>', {
          html: document.createTextNode(log.msg),
          class: 'm-0 ms-2 text-break fw-lighter',
          style: 'width: 80%'
        }))
      )
  ).append(
    $('<div>', {
      id: 'log-body-' + id,
      class: 'accordion-collapse collapse',
      'aria-labelledby': 'log-head-' + id
    }).append(
      $('<div>', {
        class: 'accordion-body',
        html: document.createTextNode(log.content)
      })
    )
  );
  if(log.content == ''){
    target = LogTag.find('.accordion-button').css('content:none')
  }
  return LogTag;
}

function run() {
  task_name = $('#TaskName').text()
  $.ajax({
    url: '/run/' + task_name,
    method: "POST",
    success: function (result) {
      console.log(result);
      location.reload();
    }
  })
}

function delete_task() {
  task_name = $('#TaskName').text()
  $.ajax({
    url: '/tasks/' + task_name,
    method: "DELETE",
    success: function (result) {
      console.log(result);
      window.location.replace('/')
    }
  })
}

function json_download() {
  task_name = $('#TaskName').text()
  window.location.replace('/data/' + task_name);
}