import React, { Component } from "react";
import "./monitor.css";
class Monitor extends Component {
  render() {
    return (
      <div>
        <nav>
          <div class="logo">
            <img id="ssac-icon" src="images/sprout.png" alt="icon" /> SSAC
          </div>
          <a href="/">세팅페이지</a>
          <div class="pre-next">
            <button type="button" name="button">
              이전 Task
            </button>
            <button type="button" name="button">
              다음 Task
            </button>
          </div>
        </nav>
        <div class="task-container container">
          <div class="metadata task-metadata">
            <p id="taskName">Task 이름: TASK NAME</p>
            <p id="taskStat">Task 이름: TASK STATUS</p>
            <p id="nextDate">다음 수집일: YYYY-MM-DD</p>
          </div>
          <div class="btn-nav"></div>
        </div>
        <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
          <li class="nav-item">
            <button
              class="nav-link active"
              id="pills-home-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-home"
              type="button"
              role="tab"
              aria-controls="pills-home"
              aria-selected="true"
            >
              로그 Watcher
            </button>
          </li>

          <li class="nav-item">
            <button
              class="nav-link"
              id="pills-profile-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-profile"
              type="button"
              role="tab"
              aria-controls="pills-profile"
              aria-selected="false"
            >
              에러내용
            </button>
          </li>
        </ul>
        <div class="tab-content" id="pills-tabContent">
          <div
            class="tab-pane fade show active"
            id="pills-home"
            role="tabpanel"
            aria-labelledby="pills-home-tab"
          >
            <div class="metadata log-metadata">
              <p id="logName">로그 이름: LOG_FILE</p>
              <p id="logStat">로그 상태: FIN</p>
            </div>
            <div id="log-analysis">
              <p>로그 분석 내용</p>
            </div>
          </div>
          <div
            class="tab-pane fade"
            id="pills-profile"
            role="tabpanel"
            aria-labelledby="pills-profile-tab"
          >
            <div class="metadata log-metadata">
              <p id="errorLevel">에러 레벨: CRITICAL</p>
              <p id="errorSpot">에러 위치: 여기</p>
            </div>
            <div id="traceStack">
              <p>에러 trace stack 내용</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Monitor;
