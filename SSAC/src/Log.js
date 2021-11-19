import React, { Component } from "react";

class Log extends Component {
  render() {
    return (
      /*
      <div>
        <h1>TASK 현황 및 생성 페이지</h1>

        <ul>
          <button>Critical</button>
          <button>Error</button>
          <button>Warning</button>
          <button>Info</button>
          <button>Debug</button>
        </ul>
        <textarea id="log_list" rows="5" cols="24">
          로그 표시창
        </textarea>
        <ul id="under_buttons">
          <button>Save</button>
          <button>Download</button>
          <button>Delete</button>
        </ul>
      </div>*/
      <div>
        <nav class="navbar navbar-light bg-light">
          <div class="container">
          <span class="navbar-brand mb-0 h1">Log List</span>
          </div>
          </nav>
          <div class="container">
          
          </div>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <div id="root"></div>
        
        <div class="container">
          <div class="d-flex justify-content-between">
                  <button type="button" class="btn btn-primary">Critical</button>
                  <button type="button" class="btn btn-primary">Error</button>
                  <button type="button" class="btn btn-primary">Warning</button>
                  <button type="button" class="btn btn-primary">Info</button>
                  <button type="button" class="btn btn-primary">Debug</button>
          </div>
        </div>
        <div class="container">
              <textarea id="log_list">Logs</textarea>
          </div>
        <div class="container">
          <div class="d-flex justify-content-between">
              <button type="button" class="btn btn-primary px-3">Save <i class="bi bi-save"></i></button>
              <button type="button" class="btn btn-primary">Download DB <i class="bi bi-download"></i></button>
              <button type="button" class="btn btn-primary">Delete <i class="bi bi-trash"></i></button>
          </div>
      </div>
    </div>
    );
  }
}

export default Log;
