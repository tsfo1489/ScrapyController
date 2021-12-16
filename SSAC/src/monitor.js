import React, { Component } from "react";
import "./stylesheet/monitor.css";
import "./stylesheet/component.css";
import API from "./API.js";

class Monitor extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    const match = props.match;
    const location = props.location;
    if (match.params["name"] !== "task") return <h1>404</h1>;
    this.id = "";
    let parse = location.search.split("?");
    parse = parse.filter((ele) => ele.length !== 0);
    if (parse.length === 1) {
      let parseVar = parse[0].split("&");
      parseVar.forEach((element) => {
        let expression = element.split("=");
        if (expression.length === 2 && expression[0] === "id") {
          this.id = expression[1];
        }
      });
    }
    this.setState({
      task: {},
    });
    console.log("id", this.id);
    this.child = React.createRef();
    this.handleGetCrawler();
  }
  state = {
    task: {}, // 0: id, 1: status, 2: name, 3: crawler info
    crawlerInfo: {},
  };
  handleGetCrawler = () => {
    const get = async () => {
      try {
        const result = await API.get("/create/");
        console.log("[get] ", result);
        console.log("[get] result.data", result.data);
        this.setState({
          task: result.data[this.id],
        });
        this.setState({
          crawlerInfo: Object.values(result.data[this.id]["crawlers"]),
        });

        return result;
      } catch (error) {
        console.log(error);
      }
    };
    get();
  };

  render() {
    console.log("task", this.state.task);
    console.log("crawlerInfo", this.state.crawlerInfo);
    return (
      <div>
        <NavForm key={this.id} name={this.id} />
        {/* <MetaForm key={parseResult["id"]} name={parseResult["id"]} /> */}
        <div className="task-container container">
          <h3></h3>
          <div className="metadata task-metadata">
            <p id="taskName">Task 이름: TASK NAME</p>
            <p id="taskStat">Task 이름: TASK STATUS</p>
            <p id="nextDate">다음 수집일: YYYY-MM-DD</p>
          </div>
          <div className="btn-nav"></div>
        </div>
        <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
          <li className="nav-item">
            <button
              className="nav-link active"
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

          <li className="nav-item">
            <button
              className="nav-link"
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
        <div className="tab-content" id="pills-tabContent">
          <div
            className="tab-pane fade show active"
            id="pills-home"
            role="tabpanel"
            aria-labelledby="pills-home-tab"
          >
            <div className="metadata log-metadata">
              <p id="logName">로그 이름: LOG_FILE</p>
              <p id="logStat">로그 상태: FIN</p>
            </div>
            <div id="log-analysis">
              <p>로그 분석 내용</p>
            </div>
          </div>
          <div
            className="tab-pane fade"
            id="pills-profile"
            role="tabpanel"
            aria-labelledby="pills-profile-tab"
          >
            <div className="metadata log-metadata">
              <p id="errorLevel">에러 레벨: CRITICAL</p>
              <p id="errorSpot">에러 위치: 여기</p>
            </div>
            <div id="traceStack">
              <p>에러 trace stack 내용</p>
            </div>
          </div>
        </div>
        <footer className="bg-light">
          <div className="container">SKKU</div>
        </footer>
      </div>
    );
  }
}

class NavForm extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.child = React.createRef();
  }
  render() {
    const key = this.props;
    const id = Number(key.name);
    console.log(key);
    return (
      <nav className="navbar navbar-light bg-light">
        <div className="container">
          <div className="navbar-brand mb-0 h1">
            <div className="d-flex">
              <img
                id="ssac-icon"
                src="/images/sprout.png"
                alt="ssac-icon"
              ></img>{" "}
              SSAC
              <span className="nav-item">
                <a href="/">Control</a>
              </span>
              <span className="nav-item">
                <a href="/monitor" className="active">
                  Monitoring
                </a>
              </span>
            </div>
          </div>
          <div className="pre-next">
            <span className="nav-item">
              <a
                href={"/monitor/task?id=" + (id - 1)}
                className={id <= 1 ? "" : "active"}
              >
                &lt; Pre Task
              </a>
            </span>
            <span className="nav-item">
              <a
                href={"/monitor/task?id=" + (id + 1)}
                className={id >= 0 ? "active" : ""}
              >
                Next Task &gt;
              </a>
            </span>
          </div>
        </div>
      </nav>
    );
  }
}

export default Monitor;
