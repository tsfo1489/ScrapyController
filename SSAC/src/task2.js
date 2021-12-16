import React, { Component } from "react";
import API from "./API.js";

class Task2 extends Component {
  constructor(props) {
    super(props);
    let today = new Date();
    let year = today.getFullYear();
    let month = ("0" + (today.getMonth() + 1)).slice(-2);
    let day = ("0" + today.getDate()).slice(-2);
    this.dateString = year + "-" + month + "-" + day;
    this.metaCrawlers = {
            "SKKU_GitHub": {
                "path": "SKKU",
                "spiders": {
                "github": {
                    "parameters": [
                    "id",
                    "date"
                    ]
                }
                }
            },
            "ArsPraxia": {
                "path": "Ars",
                "spiders": {
                "webtoon_naver": {
                    "parameters": [
                    "id"
                    ]
                },
                "webtoon_tapas": {
                    "parameters": [
                    "id"
                    ]
                },
                "Youtube": {
                    "parameters": [
                    "channel_ids",
                    "playlist_ids",
                    "video_ids"
                    ]
                }
                }
            }
        };
    this.metaSpiders = [
    {
      "github": 
      {
        "parameters": 
        [
          "id",
          "date"
        ]
      }
    },
    {
        "webtoon_naver": 
      {
        "parameters": 
        [
            "id"
        ]
      },
      "webtoon_tapas": {
        "parameters": [
          "id"
        ]
      },
      "Youtube": {
        "parameters": [
          "channel_ids",
          "playlist_ids",
          "video_ids"
        ]
      }
    }];
    this.setState({
      tasks: [],
      metaCrawlers: this.metaCrawlers,
      metaSpiders: this.metaSpiders,
      end_date: this.dateString,
    });
    console.log("constructor1", this.metaCrawlers);
    console.log("constructor2", this.metaSpiders);
    this.child = React.createRef();
    //this.handleGetMetaTask();
  }
    state = {
        crawlerName: "Crawler",
        spiderName:"Spider",
        begin_date: "2021-06-01",
        end_date: this.dateString,
        metaCrawlers: this.metaCrawlers,
        metaSpiders:this.metaSpiders,
        keyword: "",
        keywordList: [],
        crawlers: [],
        metaPrams:[],
        project: '0',
        tasks: [],
    };
  handleChange = (e) => {
    console.log(e.target.name);
    console.log(e.target.value);
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  handleProject = (e) =>{
    console.log(e.target.name);
  }
  handleGetMetaTask = () => {
    const get = async () => {
      try {
        const result = await API.get("/crawlers");
        console.log("[get taskmeta] ", result);       
        const metaCrawlers = result.data;
        console.log("metaCrawlers",metaCrawlers);
        console.log("metaSpiders",Object.values(metaCrawlers));
        
        this.setState({
          metaCrawlers: metaCrawlers,
          metaSpiders: Object.values(metaCrawlers),
        });
        return result;
      } catch (error) {
        console.log(error);
      }
    };
    get();
  };
  onFlipCard = (e) => {
    const cardId = "#" + e.currentTarget.id;
    const card = document.querySelector(cardId);
    card.classList.toggle("is-flipped");
  };
  render() {
    return (
      <div>
        <NavForm
          key="nav"
          name="nav"
        />
        <div className="container">
          {/* Crawlers dropdown */}
          <div className="dropdown">
              <button
                className="btn btn-secondary dropdown-toggle me-2"
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {this.state.crawlerName}
              </button>
              <ul
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton1"
              >
              { Object.keys(this.state.metaCrawlers).map((name)=>{
                return (
                 <li>  
                    <button className="dropdown-item"
                    name={name} onClick={this.handleProject}>
                    {name} 
                    </button>
                 </li>
                 );
                 })}
              </ul>
          </div>
          
            <div>
            <input
              type="text"
              className="form-control"
              id="keyword-input"
              placeholder="Enter a keyword here"
              name="keyword"
              onChange={this.handleChange}
            />
            <button
              type="button"
              id="add"
              className="btn btn-primary ms-1 text-nowrap"
              onClick={this.handleKeyword}
            >
              <i className="bi bi-plus"></i>
            </button>
          </div>
          <div className="d-flex justify-content-start flex-wrap mt-2 mb-2">
            {this.state.keywordList.map((keyword) => {
              return (
                <button
                  type="button"
                  key={this.state.keywordList.indexOf(keyword)}
                  className="btn btn-light ms-1 me-1 mt-1 mb-1"
                >
                  {keyword}
                </button>
              );
            })}
          </div>
          <div
            id="date-container"
            className="d-flex justify-content-between mb-2 mt-2"
          >
            <label className="datelabel" htmlFor="start">
              FROM:
            </label>
            <input
              type="date"
              id="start"
              name="begin_date"
              defaultValue="2021-06-01"
              min="2010-01-01"
              max={this.state.end_date}
              onChange={this.handleChange}
            />
            <label className="datelabel" htmlFor="end">
              TO:
            </label>
            <input
              type="date"
              id="end"
              name="end_date"
              defaultValue="2021-11-22"
              min={this.state.begin_date}
              max={this.dateString}
              onChange={this.handleChange}
            />

            <div className="btn-group">
              <button
                type="button"
                id="add_schedule"
                className="btn btn-secondary ms-1 text-nowrap"
                onClick={this.handleSchedule}
              >
                <i className="bi bi-plus"></i> Scheduling
              </button>
              <button
                type="button"
                className="btn btn-primary text-nowrap"
                id="add_crawler"
                onClick={this.handleCrawler}
              >
                <i className="bi bi-plus"></i> Set Crawler
              </button>
              <button
                type="button"
                className="btn btn-primary dropdown-toggle dropdown-toggle-split"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                id="btnLoglevel"
              >
                <span className="visually-hidden">Toggle Dropdown</span>
              </button>
              <ul className="dropdown-menu" aria-labelledby="btnLoglevel">
                <li>
                  <button className="dropdown-item" onClick={this.handleLog}>
                    Information
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={this.handleLog}>
                    Warning
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={this.handleLog}>
                    Error
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={this.handleLog}>
                    Critical
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="d-flex card-container">
            <div className="flex-grow-1 bg-light rounded-2 p-2 w-50">
              <form onSubmit={this.handleSubmit}>
                <div className="d-flex align-items-center mb-2 mt-2">
                  <h3>Settings</h3>
                  <input
                    type="text"
                    className="form-control ms-2"
                    id="task-input"
                    placeholder="Enter a name of task here"
                    name="taskName"
                    onChange={this.handleChange}
                  />
                  <button
                    type="submit"
                    id="create"
                    className="btn btn-primary ms-1 text-nowrap"
                  >
                    <i className="bi bi-plus"></i> Create
                  </button>
                </div>
              </form>

              {this.state.crawlers.map((data) => {
                console.log("crawlers data: ", data);
                return (
                  <button className="btn btn-outline-secondary ms-1 me-1 mt-1 mb-1">
                    {data.name}
                    <button
                      type="button"
                      className="btn btn-sm btn-danger ms-2"
                      name={JSON.stringify(data)}
                      onClick={this.handleCrawlerRemove}
                    >
                      <i className="bi bi-x" name={JSON.stringify(data)}></i>
                    </button>
                  </button>
                );
              })}

              <h3>Tasks</h3>
              <div id="task-list">
                {this.state.tasks.map((data) => {
                  console.log("data ", data);
                  let parse_data = {};
                  if (typeof data === "string") {
                    parse_data = JSON.parse(data);
                  } else {
                    parse_data = data;
                  }
                  if (["new", "stop"].indexOf(parse_data.status) < 0)
                    return null;
                  console.log("data desc", parse_data["crawlers"]);
                  const desc = parse_data.crawlers.map((crawler) => {
                    return (
                      <CardForm
                        key={this.state.taskName}
                        name={crawler.name}
                        parameters={crawler.parameters}
                      />
                    );
                  });
                  return (
                    <div
                      className="card"
                      id={"id" + parse_data.name}
                      onClick={this.onFlipCard}
                    >
                      <div className="front">
                        <div className="card-content middle">
                          <h4 className="card-title">{parse_data.name}</h4>
                          <button
                            type="button"
                            taskid={parse_data.task_id}
                            className="btn btn-sm btn-success ms-1 me-1"
                            onClick={this.handleRun}
                          >
                            <i
                              className="bi bi-caret-right-fill"
                              taskid={parse_data.task_id}
                            ></i>
                          </button>
                          <button
                            type="button"
                            taskid={parse_data.task_id}
                            className="btn btn-sm btn-danger ms-1 me-1"
                            onClick={this.handleDelete}
                          >
                            <i
                              className="bi bi-x"
                              taskid={parse_data.task_id}
                            ></i>
                          </button>
                        </div>
                      </div>
                      {desc}
                    </div>
                  );
                })}
              </div>
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


class CardForm extends Component {
  render() {
    const crawler = this.props;
    console.log("[CardForm] card: ", crawler);

    let mainObj = "keywords";
    if ("channel_ids" in crawler.parameters) mainObj = "channel_ids";
    else if ("playlist_ids" in crawler.parameters) mainObj = "playlist_ids";
    else if ("video_ids" in crawler.parameters) mainObj = "video_ids";
    else if ("users" in crawler.parameters) mainObj = "users";
    else if ("ids" in crawler.parameters) mainObj = "ids";
    else if ("webtoons" in crawler.parameters) mainObj = "webtoons";

    if ("begin_date" in crawler.parameters)
      return (
        <div className="back">
          <div className="card-content middle">
            <h4>{crawler.name}</h4>
            <i className="bi bi-calendar">{crawler.parameters.begin_date}</i>~
            <i className="bi bi-calendar-fill">{crawler.parameters.end_date}</i>
            <div className="d-flex justify-content-start flex-wrap mt-2 mb-2">
              {crawler.parameters[`${mainObj}`].split(",").map((obj) => {
                return (
                  <button
                    type="button"
                    className="btn btn-light ms-1 me-1 mt-1 mb-1"
                  >
                    {obj}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      );
    else
      return (
        <div className="back">
          <div className="card-content middle">
            <h4>{crawler.name}</h4>
            <div className="d-flex justify-content-start flex-wrap mt-2 mb-2">
              {crawler.parameters[`${mainObj}`].split(",").map((obj) => {
                return (
                  <button
                    type="button"
                    className="btn btn-light ms-1 me-1 mt-1 mb-1"
                  >
                    {obj}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      );
  }
}

class NavForm extends Component {
  constructor(props) {
    super(props);
    this.child = React.createRef();
  }
  render() {
    return (
      <nav className="navbar navbar-light bg-light">
        <div className="container">
          <div className="navbar-brand mb-0 h1">
            <div className="d-flex">
              <img id="ssac-icon" src="images/sprout.png" alt="ssac-icon"></img>{" "}
              SSAC
              <span className="nav-item">
                <a href="/" className="active">
                  Control
                </a>
              </span>
              <span className="nav-item">
                <a href="/monitor">Monitoring</a>
              </span>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-success me-1"
          >
            <i className="bi bi-arrow-bar-down"></i>
          </button>
        </div>
      </nav>
    );
  }
}
export default Task2;
