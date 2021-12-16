window.onload = function () {
  refresh_cycle();
}

function refresh() {
  $.ajax({
    url: '/refresh',
    method: "POST",
    success: function (result) {
      $.ajax({
        url: '/indexcard',
        method: "GET",
        success: function (result) {
          console.log("Refresh")
          $('#ready_card').html(result.ready_html);
          $('#run_card').html(result.run_html);
          $('#finish_card').html(result.finish_html);
        }
      })
    }
  });
}

function refresh_cycle() {
  refresh()
  setTimeout(refresh_cycle, 10000);
}

function run(task_name) {
  $.ajax({
    url: '/run/' + task_name,
    method: "POST",
    success: function (result) {
      console.log(result);
      location.reload();
    }
  })
}