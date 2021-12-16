import React, { Component } from "react";
import API from "./API.js";

class Task extends Component {
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
    this.metaSpiders = [{
      "github": {
        "parameters": [
          "id",
          "date"
        ]
      }
    ,"webtoon_naver": {
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
      }}];
    this.setState({
      tasks: [],
      metaCrawlers: this.metaCrawlers,
      metaSpiders: this.metaSpiders,
      end_date: this.dateString,
    });
    this.child = React.createRef();
    //this.handleGetCrawler();
    this.handleGetMetaTask();
  }
  state = {
    taskName: "",
    mediaName: "Media",
    crawlerName: "Crawler",
    spiderName:"Spider",
    submedia: new Set(),
    begin_date: "2021-06-01",
    end_date: this.dateString,
    loglevel: "INFO",
    keyword: "",
    keywordList: [],
    crawlers: [],
    metaCrawlers:[],
    metaSpiders:[],
    metaPrams:[],
    project: '0',
    tasks: [],
    geo: new Set(),
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
    NEWSNAME_LIST: [
      "CN_globaltimes",
      "US_nytimes",
      "UK_guardian",
      "US_latimes",
      "SG_straitstimes",
      "JP_asahi",
      "JP_sankei",
      "SA_bbcmundo",
      "FR_lemonde",
      "ES_elpais",
    ],
    YOUTUBE_LIST: ["channel_ids", "playlist_ids", "video_ids"],
    TWITTER_LIST: ["user", "user_rt", "geo"],
    TWITTER_GEO_LIST: [
      "North_America",
      "South_America",
      "Southeast_Asia",
      "Japan",
      "Europe",
      "India",
      "Australia",
      "South_Africa",
      "Middle_East",
    ],
    WEBTOON_LIST: ["Naver", "Tapas"],
  };
  handleChange = (e) => {
    console.log(e.target.name);
    console.log(e.target.value);
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  handleGeo = (geo) => {
    let set = new Set();
    console.log("geo", geo);
    set.add(geo);
    if (this.state.geo.has(geo)) {
      this.state.geo.delete(geo);
    } else {
      this.setState({
        geo: this.state.geo.add(this.state.TWITTER_GEO_LIST[geo]),
      });
    }
    console.log("set geo", this.state.geo);
  };
  handleProject = (e) =>{
    console.log("target project name", e.target.name);
    this.setState({
      project: e.target.name,
      crawlerName:e.target.innerText,
    });
  }
  handleSpider = (e) =>{
    //console.log("target spider name", e.target.name);
    this.setState({
      spiderName:e.target.innerText,
    });
    //console.log("keys",Object.keys(this.state.metaSpiders[this.state.project]));
  }
  handleCheck = (submedia, check) => {
    let set = new Set();
    console.log("sub", submedia);
    if (submedia >= 20) {
      // its twittergeo
      this.handleGeo(submedia % 10);
      return;
    }
    set.add(submedia);
    if (check === 1) {
      this.setState({
        submedia: this.state.submedia.add(submedia),
      });
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
  handleLog = (e) => {
    let loglevel = e.target.innerText;
    if (loglevel === "Information") {
      loglevel = "INFO";
    }
    this.setState({
      loglevel: loglevel.toUpperCase(),
    });
    const btnLoglevel = document.getElementById("btnLoglevel");
    if (loglevel === "INFO")
      btnLoglevel.className =
        "btn btn-primary dropdown-toggle dropdown-toggle-split show";
    else if (loglevel === "Warning")
      btnLoglevel.className =
        "btn btn-warning dropdown-toggle dropdown-toggle-split show";
    else if (loglevel === "Error")
      btnLoglevel.className =
        "btn btn-danger dropdown-toggle dropdown-toggle-split show";
    else if (loglevel === "Critical")
      btnLoglevel.className =
        "btn btn-dark dropdown-toggle dropdown-toggle-split show";
  };
  handleSchedule = (e) => {
    console.log("schedule");
  };
  // handleCrawler = (e) => {
  //   e.preventDefault();
  //   let addCrawlerButton = document.querySelector("#add_crawler");
  //   let hasDate = true;
  //   let param = "keywords";
  //   let mediaName = "";
  //   if (this.state.submedia.size === 0 && this.state.mediaName !== "IMDB") {
  //     addCrawlerButton.className = "btn btn-danger text-nowrap";
  //     return;
  //   }
  //   switch (this.state.mediaName) {
  //     case "News":
  //       let setIter = this.state.submedia.values();
  //       let newsmedia = setIter.next().value;
  //       mediaName = this.state.NEWSNAME_LIST[newsmedia];
  //       hasDate = true;
  //       break;
  //     case "Youtube":
  //       mediaName = "Youtube";
  //       hasDate = false;
  //       break;
  //     case "Twitter":
  //       mediaName = "Twitter";
  //       break;
  //     case "Reddit":
  //       mediaName = "Reddit";
  //       break;
  //     case "Webtoon":
  //       mediaName = "Webtoon";
  //       hasDate = false;
  //       param = "webtoons";
  //       break;
  //     case "IMDB":
  //       mediaName = "imdb";
  //       param = "ids";
  //       break;
  //     default:
  //       break;
  //   }
  //   let result = "";
  //   if (this.state.mediaName === "IMDB") {
  //     result = new Function(
  //       `return{name: '${mediaName}',
  //         parameters: {
  //           ${param}: '${this.state.keywordList.join(",")}',
  //         },
  //         options: {
  //           LOG_LEVEL: '${this.state.loglevel}',
  //           LOG_FILE: "${mediaName}.log",
  //         },};`
  //     )();
  //   } else if (this.state.mediaName === "Reddit") {
  //     console.log("red", Array.from(this.state.submedia).join(","));
  //     result = new Function(
  //       `return{name: '${mediaName}',
  //         parameters: {
  //           ${param}: '${this.state.keywordList.join(",")}',
  //           subreddit: '${Array.from(this.state.submedia).join(",")}',
  //           begin_date: ${this.state.begin_date.split("-").join("")},
  //           end_date: ${this.state.end_date.split("-").join("")},
  //         },
  //         options: {
  //           LOG_LEVEL: '${this.state.loglevel}',
  //           LOG_FILE: "${mediaName}.log",
  //         },};`
  //     )();
  //   } else {
  //     result = Array.from(this.state.submedia).map((sub) => {
  //       console.log("in map ", this.state.mediaName);
  //       if (this.state.mediaName === "Twitter") {
  //         if (Number.parseInt(sub) === 1) {
  //           mediaName = "twitter_user";
  //           param = "users";
  //         } else if (Number.parseInt(sub) === 2) {
  //           mediaName = "twitter_user_rt";
  //           param = "users";
  //         } else if (Number.parseInt(sub) === 3) {
  //           mediaName = "twitter_geo";
  //           param = "keywords";
  //         }
  //       } else if (this.state.mediaName === "Youtube") {
  //         if (Number.parseInt(sub) === 1) {
  //           param = "channel_ids";
  //           console.log("param ", param);
  //         } else if (Number.parseInt(sub) === 2) {
  //           param = "playlist_ids";
  //         } else if (Number.parseInt(sub) === 3) {
  //           param = "video_ids";
  //         }
  //       } else if (this.state.mediaName === "Webtoon") {
  //         if (Number.parseInt(sub) === 1) {
  //           mediaName = "webtoon_naver";
  //         } else if (Number.parseInt(sub) === 2) {
  //           mediaName = "webtoon_tapas";
  //         }
  //       }
  //       console.log("out param ", param);
  //       let ret;

  //       if (this.state.mediaName === "Twitter") {
  //         console.log("end", this.state.end_date);
  //         ret = new Function(
  //           `return{name: '${mediaName}',
  //         parameters: {
  //           ${param}: '${this.state.keywordList.join(",")}',
  //           begin_date: ${this.state.begin_date.split("-").join("")},
  //           end_date: ${this.state.end_date.split("-").join("")},
  //           geo: '${Array.from(this.state.geo).join(",")}',
  //         },
  //         options: {
  //           LOG_LEVEL: '${this.state.loglevel}',
  //           LOG_FILE: "${mediaName}.log",
  //         },};`
  //         )();
  //       } else if (hasDate === true) {
  //         ret = new Function(
  //           `return{name: '${mediaName}',
  //         parameters: {
  //           ${param}: '${this.state.keywordList.join(",")}',
  //           begin_date: ${this.state.begin_date.split("-").join("")},
  //           end_date: ${this.state.end_date.split("-").join("")},
  //         },
  //         options: {
  //           LOG_LEVEL: '${this.state.loglevel}',
  //           LOG_FILE: "${mediaName}.log",
  //         },};`
  //         )();
  //       } else {
  //         ret = new Function(
  //           `return{name: '${mediaName}',
  //         parameters: {
  //           ${param}: '${this.state.keywordList.join(",")}'
  //         },
  //         options: {
  //           LOG_LEVEL: '${this.state.loglevel}',
  //           LOG_FILE: "${mediaName}.log",
  //         },};`
  //         )();
  //       }
  //       return ret;
  //     });
  //   }
  //   this.setState({
  //     crawlers: this.state.crawlers.concat(result),
  //   });

  //   console.log(this.state.crawlers);
  //   this.setState({
  //     mediaName: "Media",
  //     begin_date: this.state.begin_date,
  //     end_date: this.state.end_date,
  //     keyword: "",
  //     keywordList: [],
  //   });
  //   addCrawlerButton.className = "btn btn-primary text-nowrap";
  // };
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
  handleGetMetaTask = () => {
    const get = async () => {
      try {
        const result = await API.get("/crawlers");
        console.log("[get taskmeta] ", result);
        console.log("[get taskmeta] result.data", result.data);
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
        <NavForm
          key="nav"
          name="nav"
          handleGetCrawler={this.handleGetCrawler}
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
              { Object.keys(this.state.metaCrawlers).map((name, idx)=>{
                return (
                 <li>  <button className="dropdown-item"
                  name={name} onClick={this.handleProject}>
                    {name} 
                  </button>
                  </li>);})}
              </ul>
          </div>
          {/* Spiders Dropdown */}
          <div className="dropdown">
              <button
                className="btn btn-secondary dropdown-toggle me-2"
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {this.state.spiderName}
              </button>
              <ul
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton1"
              >
              { Object.keys(this.state.metaSpiders[this.state.project]["spiders"]).map((name)=>{
                return (
                  <button className="dropdown-item" onClick={this.handleSpider}>
                    <li> {name} </li>
                  </button>);})}
              </ul>
          </div>
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
          <div className="d-flex card-container">
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
                                aria-valuenow="100"
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
                                aria-valuenow="100"
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
        <footer className="bg-light">
          <div className="container">SKKU</div>
        </footer>
      </div>
    );
  }
}

class SubInputForm extends Component {
  handleCheck = (e) => {
    // pass parameter 1(checkbox) or 0(radio)
    const val = e.target.value;
    if (parseInt(val / 10) === 3) this.props.handleCheck(val % 10, 1);
    else this.props.handleCheck(val % 10, 0); // radio
  };
  handleGeo = (e) => {
    const val = e.target.value;
    console.log("handlegeo", val);
    console.log("props", this.props);
    this.props.handleCheck(val, 1); // radio
  };
  handleKeyword = (e) => {
    const addSubredditButton = document.getElementById("add-subreddit");
    const subreddit = document.getElementById("subredditKeyword");

    let btnSubredditKeyword = document.createElement("button");
    btnSubredditKeyword.setAttribute(
      "class",
      "btn btn-light ms-1 me-1 mt-1 mb-1 subreddit-keyword"
    );
    btnSubredditKeyword.innerText =
      document.getElementById("subreddit-input").value;
    const checkKeyword = document.getElementsByClassName("subreddit-keyword");
    if (btnSubredditKeyword.innerText === "") {
      addSubredditButton.className = "btn btn-danger ms-1 text-nowrap";
      return;
    }
    for (let i = 0; i < checkKeyword.length; i++) {
      if (checkKeyword.item(i).innerText === btnSubredditKeyword.innerText) {
        addSubredditButton.className = "btn btn-danger ms-1 text-nowrap";
        return;
      }
    }
    subreddit.appendChild(btnSubredditKeyword);
    this.props.handleCheck(document.getElementById("subreddit-input").value, 1);
    document.getElementById("subreddit-input").value = "";
    addSubredditButton.className = "btn btn-primary ms-1 text-nowrap";
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
    if (this.props.medianame === "Reddit") {
      return (
        <div
          id="subredditKeyword"
          className="d-flex align-items-center mb-2 mt-2"
        >
          <input
            type="text"
            className="form-control"
            id="subreddit-input"
            placeholder="Enter a subreddit here"
            name="subreddit"
            onChange={this.handleChange}
          />
          <button
            type="button"
            id="add-subreddit"
            className="btn btn-primary ms-1 text-nowrap"
            onClick={this.handleKeyword}
          >
            <i className="bi bi-plus"></i>
          </button>
        </div>
      );
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
                    onChange={this.handleGeo}
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

class NavForm extends Component {
  constructor(props) {
    super(props);
    this.child = React.createRef();
  }
  handleGetCrawler = (e) => {
    this.props.handleGetCrawler();
  };
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
            onClick={this.handleGetCrawler}
          >
            <i className="bi bi-arrow-bar-down"></i>
          </button>
        </div>
      </nav>
    );
  }
}
export default Task;
