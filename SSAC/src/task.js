import React, { Component } from "react";
import API from "./API.js";

class Task extends Component {
  constructor(props) {
    super(props);
    this.child = React.createRef();
  }
  state = {
    taskName: "",
    mediaName: "Media",
    submedia: new Set(),
    begin_date: "2021-06-01",
    end_date: "2021-06-30",
    keyword: "",
    keywordList: [],
    crawlers: [],
    tasks: [],
    NEWS_LIST: [
      "[CN]Global Times",
      "[US]New York Times",
      "[UK]Guardian",
      "[US]LA Times",
      "[SG]Straits Times",
      "[JP]Asahi Shimbun",
      "[JP]Sankei Shimbun",
      "[SA]BBC Mundo",
      "[FR]Le Monde",
      "[ES]El Pais",
    ],
    YOUTUBE_LIST: ["channel_ids", "playlist_ids", "video_ids"],
    TWITTER_LIST: ["user", "user_rt", "geo"],
    REDDIT_LIST: ["kpop", "KDRAMA", "koreanvariety", "manhwa"],
    WEBTOON_LIST: ["Naver", "Tapas"],
  };

  handleChange = (e) => {
    console.log("name", e.target.name);
    console.log("value", e.target.value);
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  handleCheck = (submedia, check) => {
    let set = new Set();
    set.add(submedia);
    if (check === 1) {
      if (this.state.submedia.has(submedia)) {
        this.state.submedia.delete(submedia);
      } else {
        this.setState({
          submedia: this.state.submedia.add(submedia),
        });
      }
    } else if (check === 0) {
      if (this.state.submedia.has(submedia)) {
        this.state.submedia.delete(submedia);
      } else {
        this.setState({
          submedia: set,
        });
      }
    }
    console.log("set ", this.state.submedia);
  };
  handleMedia = (e) => {
    this.setState({
      mediaName: e.target.innerText,
      submedia: new Set(),
    });
    console.log(this.state);
  };

  handleKeyword = () => {
    let addButton = document.querySelector("#add");
    if (this.state.keyword === "") {
      addButton.className = "btn btn-danger ms-1 text-nowrap";
      return;
    }
    if (
      this.state.keywordList.find(
        (element) => element === this.state.keyword
      ) !== undefined
    ) {
      addButton.className = "btn btn-danger ms-1 text-nowrap";
      return;
    }
    this.setState({
      keywordList: this.state.keywordList.concat(this.state.keyword),
    });
    this.setState({
      keyword: "",
    });
    document.querySelector("#keyword-input").value = "";
    addButton.className = "btn btn-primary ms-1 text-nowrap";
  };
  handleCrawlerRemove = (e) => {
    console.log("e.target ", e.target);
    this.setState({
      crawlers: this.state.crawlers.filter((crawler) => {
        return e.target.getAttribute("name") !== JSON.stringify(crawler);
      }),
    });
  };
  handleCrawler = (e) => {
    e.preventDefault();
    let addCrawlerButton = document.querySelector("#add_crawler");
    let hasDate = true;
    let param = "keywords";
    let mediaName = "";
    if (this.state.submedia.size === 0 && this.state.mediaName !== "IMDB") {
      addCrawlerButton.className = "btn btn-danger ms-1 text-nowrap";
      return;
    }
    switch (this.state.mediaName) {
      case "News":
        mediaName = "News";
        hasDate = true;
        break;
      case "Youtube":
        mediaName = "Youtube";
        hasDate = false;
        break;
      case "Twitter":
        mediaName = "Twitter";
        break;
      case "Reddit":
        mediaName = "Reddit";
        break;
      case "Webtoon":
        mediaName = "Webtoon";
        hasDate = false;
        param = "webtoons";
        console.log("test ", this.state.submedia);
        break;
      case "IMDB":
        mediaName = "imdb";
        param = "ids";
        break;
      default:
        break;
    }
    let result = "";
    if (this.state.mediaName === "IMDB") {
      result = new Function(
        `return{name: '${mediaName}',
          parameters: {
            ${param}: '${this.state.keywordList.join(",")}',
          },
          options: {
            LOG_LEVEL: "INFO",
            LOG_FILE: "youtube.log",
          },};`
      )();
    } else {
      result = Array.from(this.state.submedia).map((sub) => {
        console.log("in map ", this.state.mediaName);
        if (this.state.mediaName === "Twitter") {
          if (Number.parseInt(sub) === 1) {
            mediaName = "twitter_user";
            param = "users";
          } else if (Number.parseInt(sub) === 2) {
            mediaName = "twitter_user_rt";
            param = "users";
          } else if (Number.parseInt(sub) === 3) {
            mediaName = "twitter_geo";
            param = "keywords";
          }
        } else if (this.state.mediaName === "Youtube") {
          if (Number.parseInt(sub) === 1) {
            param = "channel_ids";
            console.log("param ", param);
          } else if (Number.parseInt(sub) === 2) {
            param = "playlist_ids";
          } else if (Number.parseInt(sub) === 3) {
            param = "video_ids";
          }
        } else if (this.state.mediaName === "Webtoon") {
          if (Number.parseInt(sub) === 1) {
            mediaName = "webtoon_naver";
          } else if (Number.parseInt(sub) === 2) {
            mediaName = "webtoon_tapas";
          }
        }
        console.log("out param ", param);
        let ret;
        if (hasDate === true) {
          ret = new Function(
            `return{name: '${mediaName}',
          parameters: {
            ${param}: '${this.state.keywordList.join(",")}',
            begin_date: ${this.state.begin_date.split("-").join("")},
            end_date: ${this.state.end_date.split("-").join("")},
          },
          options: {
            LOG_LEVEL: "INFO",
            LOG_FILE: "${mediaName}.log",
          },};`
          )();
        } else {
          ret = new Function(
            `return{name: '${mediaName}',
          parameters: {
            ${param}: '${this.state.keywordList.join(",")}'
          },
          options: {
            LOG_LEVEL: "INFO",
            LOG_FILE: "${mediaName}.log",
          },};`
          )();
        }
        return ret;
      });
    }
    this.setState({
      crawlers: this.state.crawlers.concat(result),
    });

    console.log(this.state.crawlers);
    this.setState({
      mediaName: "Media",
      begin_date: this.state.begin_date,
      end_date: this.state.end_date,
      keyword: "",
      keywordList: [],
    });
    addCrawlerButton.className = "btn btn-primary ms-1 text-nowrap";
  };

  handleSubmit = (e) => {
    e.preventDefault();
    let createButton = document.querySelector("#create");
    if (this.state.taskName === "") {
      createButton.className = "btn btn-danger ms-1 text-nowrap";
      return;
    }
    if (this.state.crawlers.length === 0) {
      createButton.className = "btn btn-danger ms-1 text-nowrap";
      return;
    }
    const post = async () => {
      try {
        const result = await API.post("/create/", {
          name: this.state.taskName,
          crawlers: this.state.crawlers,
        });
        console.log("create ", result);
        this.handleGetCrawler();
        return result;
      } catch (error) {
        console.log(error);
      }
    };
    const response = post();
    console.log("submit end");
    console.log(response);

    // 초기화
    this.setState({
      taskName: "",
      mediaName: "Media",
      keyword: "",
      keywordList: [],
      crawlers: [],
    });

    document.querySelector("#task-input").value = "";
    createButton.className = "btn btn-primary ms-1 text-nowrap";
  };
  handleGetCrawler = () => {
    const get = async () => {
      try {
        const result = await API.get("/create/");
        console.log("[get] ", result);
        console.log("[get] result.data", result.data);
        this.setState({
          tasks: Object.values(result.data),
        });
        return result;
      } catch (error) {
        console.log(error);
      }
    };
    get();
  };
  handleDelete = (e) => {
    e.preventDefault();
    const task_id = e.target.getAttribute("taskid");
    if (task_id === null) {
      console.log("null");
      return;
    }

    const del = async () => {
      try {
        const task_id = e.target.getAttribute("taskid");
        const result = await API.delete(`/create/${task_id}/`);
        console.log("delete ", result);
        this.handleGetCrawler();
        return result;
      } catch (error) {
        console.log(error);
      }
    };
    const response = del();
    console.log("delete end");
    console.log(response);
  };
  handleRun = (e) => {
    e.preventDefault();
    console.log("Run");
    const get = async () => {
      try {
        const task_id = e.target.getAttribute("taskid");
        console.log("state.tasks[id]", task_id, " ", typeof task_id);
        console.log(
          "state.tasks[id]",
          this.state.tasks[Number.parseInt(task_id) - 1]
        );
        console.log(`get + /start/${task_id}`);
        const result = await API.get(`/start/${task_id}/`);
        console.log("get ", result);
        const newTaskList = this.state.tasks.map((oneTask) => {
          if (String(oneTask.task_id) === task_id) {
            oneTask.status = "running";
            console.log("oneTask: ", oneTask);
          }
          return oneTask;
        });
        this.setState({
          tasks: newTaskList,
        });
        console.log("Run tasks ", this.state.tasks);
        return result;
      } catch (error) {
        console.log("error: ", error);
        console.log("error.response: ", error.response);
        console.log("error.request: ", error.request);
        console.log("error.message: ", error.message);
      }
    };
    const response = get();
    console.log(response);
  };
  handlePause = (e) => {
    console.log("Pause");
    const get = async () => {
      try {
        const task_id = e.target.getAttribute("taskid");
        // const result = await API.get(`/pause/${task_id}/`);
        // console.log("get ", result);
        const result = "";
        this.setState({
          tasks: this.state.tasks.map((oneTask) => {
            if (String(oneTask.task_id) === task_id) {
              oneTask.status = "pause";
              console.log("oneTask: ", oneTask);
            }
            return oneTask;
          }),
        });
        return result;
      } catch (error) {
        console.log(error);
      }
    };
    get();
  };
  handleResume = (e) => {
    console.log("Resume");
    const get = async () => {
      try {
        const task_id = e.target.getAttribute("taskid");
        // const result = await API.get(`/unpause/${task_id}/`);
        // console.log("get ", result);
        const result = "";
        this.setState({
          tasks: this.state.tasks.map((oneTask) => {
            if (String(oneTask.task_id) === task_id) {
              oneTask.status = "running";
              console.log("oneTask: ", oneTask);
            }
            return oneTask;
          }),
        });
        return result;
      } catch (error) {
        console.log(error);
      }
    };
    get();
  };
  handleStop = (e) => {
    console.log("Stop");
    const get = async () => {
      try {
        const task_id = e.target.getAttribute("taskid");
        // const result = await API.get(`/stop/${task_id}/`);
        // console.log("get ", result);
        const result = "";
        this.setState({
          tasks: this.state.tasks.map((oneTask) => {
            if (String(oneTask.task_id) === task_id) {
              oneTask.status = "stop";
              console.log("oneTask: ", oneTask);
            }
            return oneTask;
          }),
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
        <nav className="navbar navbar-light bg-light">
          <div className="container">
            <span className="navbar-brand mb-0 h1">
              <img id="ssac-icon" src="images/sprout.png"></img> SSAC
            </span>
            <button
              type="button"
              className="btn btn-sm btn-success me-1"
              onClick={this.handleGetCrawler}
            >
              <i className="bi bi-arrow-bar-down"></i>
            </button>
          </div>
        </nav>
        <div className="container">
          <div className="d-flex align-items-center mb-2 mt-2">
            <div className="dropdown">
              <button
                className="btn btn-secondary dropdown-toggle me-2"
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {this.state.mediaName}
              </button>
              <ul
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton1"
              >
                <li>
                  <button className="dropdown-item" onClick={this.handleMedia}>
                    News
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={this.handleMedia}>
                    Youtube
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={this.handleMedia}>
                    Twitter
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={this.handleMedia}>
                    Reddit
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={this.handleMedia}>
                    IMDB
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={this.handleMedia}>
                    Webtoon
                  </button>
                </li>
              </ul>
            </div>

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
            <SubInputForm
              key={this.state.mediaName}
              medianame={this.state.mediaName}
              handleCheck={this.handleCheck}
            />
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
          <div className="d-flex justify-content-between mb-2 mt-2">
            <label htmlFor="start">FROM:</label>
            <input
              type="date"
              id="start"
              name="begin_date"
              defaultValue="2021-06-01"
              min="2018-01-01"
              max="2021-07-31"
              onChange={this.handleChange}
            />
            <label htmlFor="end">TO:</label>

            <input
              type="date"
              id="end"
              name="end_date"
              defaultValue="2021-06-30"
              min="2018-01-01"
              max="2021-07-31"
              onChange={this.handleChange}
            />
            <div className="d-grid d-md-flex justify-content-md-end">
              <button
                type="button"
                id="add_crawler"
                className="btn btn-primary ms-1 text-nowrap"
                onClick={this.handleCrawler}
              >
                <i className="bi bi-plus"></i> Set Crawler
              </button>
            </div>
          </div>

          <div className="d-flex">
            <div className="flex-grow-1 bg-light rounded-2 p-2 me-1 w-50">
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
          <div className="d-flex">
            <div className="flex-grow-1 bg-light rounded-2 p-2 w-50">
              <h3>Run</h3>
              <div id="run-list">
                {this.state.tasks.map((data) => {
                  //console.log("run data ", data);
                  let parse_data = {};
                  if (typeof data === "string") {
                    parse_data = JSON.parse(data);
                  } else {
                    parse_data = data;
                  }
                  if (parse_data.status !== "running") return null;
                  const desc = parse_data.crawlers.map((crawler) => {
                    console.log("run crawler", crawler);
                    return (
                      <CardForm
                        key={this.state.taskName}
                        name={crawler.name}
                        parameters={crawler.parameters}
                      />
                    );
                  });
                  return (
                    <div className="task bg-light p-1 rounded-2 ps-2 d-flex align-items-center">
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
                              className="btn btn-sm btn-danger ms-1 me-1"
                              onClick={this.handlePause}
                            >
                              <i
                                className="bi bi-pause"
                                taskid={parse_data.task_id}
                              ></i>
                            </button>
                            <div className="progress mt-3 ms-3 me-3">
                              <div
                                className="progress-bar w-75"
                                role="progressbar"
                                aria-valuenow="75"
                                aria-valuemin="0"
                                aria-valuemax="100"
                              ></div>
                            </div>
                          </div>
                        </div>
                        {desc}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex-grow-1 bg-light rounded-2 p-2 w-50">
              <h3>Pause</h3>
              <div id="pause-list">
                {this.state.tasks.map((data) => {
                  //console.log("pause data ", data);
                  let parse_data = {};
                  if (typeof data === "string") {
                    parse_data = JSON.parse(data);
                  } else {
                    parse_data = data;
                  }
                  if (parse_data.status !== "pause") return null;
                  const desc = parse_data.crawlers.map((crawler) => {
                    console.log("run crawler", crawler);
                    return (
                      <CardForm
                        key={this.state.taskName}
                        name={crawler.name}
                        parameters={crawler.parameters}
                      />
                    );
                  });
                  return (
                    <div className="task bg-light p-1 rounded-2 ps-2 d-flex align-items-center">
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
                              className="btn btn-sm btn-danger ms-1 me-1"
                              onClick={this.handleResume}
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
                              onClick={this.handleStop}
                            >
                              <i
                                className="bi bi-x"
                                taskid={parse_data.task_id}
                              ></i>
                            </button>
                            <div className="progress mt-3 ms-3 me-3">
                              <div
                                className="progress-bar bg-danger w-75"
                                role="progressbar"
                                aria-valuenow="75"
                                aria-valuemin="0"
                                aria-valuemax="100"
                              ></div>
                            </div>
                          </div>
                        </div>
                        {desc}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class SubInputForm extends Component {
  handleCheck = (e) => {
    // pass parameter 1(checkbox) or 0(radio)
    const val = e.target.value;
    if (parseInt(val / 10) === 0 || parseInt(val / 10) === 3)
      this.props.handleCheck(val % 10, 1);
    else this.props.handleCheck(val % 10, 0); // radio
  };
  render() {
    const NEWS_LIST = [
      "[CN]Global Times",
      "[US]New York Times",
      "[UK]Guardian",
      "[US]LA Times",
      "[SG]Straits Times",
      "[JP]Asahi Shimbun",
      "[JP]Sankei Shimbun",
      "[SA]BBC Mundo",
      "[FR]Le Monde",
      "[ES]El Pais",
    ];
    const YOUTUBE_LIST = ["channel_ids", "playlist_ids", "video_ids"];
    const TWITTER_LIST = ["user", "user_rt", "geo"];
    const REDDIT_LIST = ["kpop", "KDRAMA", "koreanvariety", "manhwa"];
    const WEBTOON_LIST = ["Naver", "Tapas"];
    const MEDIA_LIST = [
      NEWS_LIST,
      YOUTUBE_LIST,
      TWITTER_LIST,
      REDDIT_LIST,
      WEBTOON_LIST,
    ];
    const GEO_LIST = [
      "North_America",
      "South_America",
      "Southeast_Asia",
      "Japan",
      "Europe",
      "India",
      "Australia",
      "South_Africa",
      "Middle_East",
    ];
    let mediaIdx = 0;
    let checkform = "radio";
    let subSelect = true;
    let geo = false;
    if (this.props.medianame === "News") {
      mediaIdx = 0;
      checkform = "checkbox";
    } else if (this.props.medianame === "Youtube") mediaIdx = 1;
    else if (this.props.medianame === "Twitter") {
      mediaIdx = 2;
      geo = true;
    } else if (this.props.medianame === "Reddit") {
      mediaIdx = 3;
      checkform = "checkbox";
    } else if (this.props.medianame === "Webtoon") mediaIdx = 4;
    else {
      subSelect = false;
    }

    if (subSelect && !geo) {
      return (
        <div className="d-flex justify-content-start flex-wrap mt-2 mb-2">
          {MEDIA_LIST[mediaIdx].map((select) => {
            return (
              <div className="form-check me-2">
                <input
                  className="form-check-input"
                  type={checkform}
                  name={"check" + mediaIdx}
                  key={MEDIA_LIST[mediaIdx].indexOf(select) + 1}
                  value={
                    mediaIdx * 10 + MEDIA_LIST[mediaIdx].indexOf(select) + 1
                  }
                  id={checkform + (MEDIA_LIST[mediaIdx].indexOf(select) + 1)}
                  onChange={this.handleCheck}
                />
                <label
                  className="form-check-label"
                  value={
                    mediaIdx * 10 + MEDIA_LIST[mediaIdx].indexOf(select) + 1
                  }
                  htmlFor={
                    checkform + (MEDIA_LIST[mediaIdx].indexOf(select) + 1)
                  }
                  onChange={this.handleCheck}
                >
                  {select}
                </label>
              </div>
            );
          })}
        </div>
      );
    } else if (subSelect && geo) {
      return (
        <div>
          <div className="d-flex justify-content-start flex-wrap mt-2 mb-2">
            {GEO_LIST.map((select) => {
              return (
                <div className="form-check me-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name={"check" + select}
                    key={GEO_LIST.indexOf(select) + 1}
                    value={mediaIdx * 10 + GEO_LIST.indexOf(select) + 1}
                    id={"checkbox" + (GEO_LIST.indexOf(select) + 1)}
                    onChange={this.handleCheck}
                  />
                  <label
                    className="form-check-label"
                    value={mediaIdx * 10 + GEO_LIST.indexOf(select) + 1}
                    htmlFor={checkform + (GEO_LIST.indexOf(select) + 1)}
                    onChange={this.handleCheck}
                  >
                    {select}
                  </label>
                </div>
              );
            })}
          </div>

          <div className="d-flex justify-content-start flex-wrap mt-2 mb-2">
            {MEDIA_LIST[mediaIdx].map((select) => {
              return (
                <div className="form-check me-2">
                  <input
                    className="form-check-input"
                    type={checkform}
                    name={"check" + mediaIdx}
                    key={MEDIA_LIST[mediaIdx].indexOf(select) + 1}
                    value={
                      mediaIdx * 10 + MEDIA_LIST[mediaIdx].indexOf(select) + 1
                    }
                    id={checkform + (MEDIA_LIST[mediaIdx].indexOf(select) + 1)}
                    onChange={this.handleCheck}
                  />
                  <label
                    className="form-check-label"
                    value={
                      mediaIdx * 10 + MEDIA_LIST[mediaIdx].indexOf(select) + 1
                    }
                    htmlFor={
                      checkform + (MEDIA_LIST[mediaIdx].indexOf(select) + 1)
                    }
                    onChange={this.handleCheck}
                  >
                    {select}
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      );
    } else {
      return null;
    }
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
export default Task;
