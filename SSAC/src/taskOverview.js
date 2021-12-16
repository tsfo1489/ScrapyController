import React, { Component } from "react";
import "./stylesheet/taskOverview.css";
import "./stylesheet/component.css";
import API from "./API.js";
class TaskOverview extends Component {
  constructor(props) {
    super(props);
    this.child = React.createRef();
    this.handleGetTask();
  }
  state = {
    tasks: [],
    crawlerName: [],
  };
  handleGetTask = () => {
    const get = async () => {
      try {
        const result = await API.get("/tasks");
        this.setState({
          tasks: result.data,
        });
        return result;
      } catch (error) {
        console.log(error);
      }
    };
    get();
  };
  render() {
    return (
      <div>
        <NavForm
          key="nav"
          name="nav"
          handleGetTask={this.handleGetTask}
        />
        <div className="container">
          <h3>Tasks</h3>
          <div className="flex-grow-1 bg-light rounded-3 p-2 w-100">
            <table className="task-table w-100 text-center">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Status</th>
                  <th>Crawler</th>
                  <th>Spider</th>
                  <th>Parameter</th>
                  <th>By</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(this.state.tasks).map((key, idx) => {
                  return (
                    <tr>
                      <td>{key}</td>
                      <td>{this.state.tasks[key]["status"]}</td>
                      <td>{this.state.tasks[key]["crawler"]}</td>
                      <td>{this.state.tasks[key]["spider"]}</td>
                      <td>
                        {Object.keys(this.state.tasks[key]["parameters"]).map((param_key, idx) => {
                          return (
                            <button className="btn ms-1 me-1 mt-1 mb-1 btn-para" title={param_key}>
                              {param_key}: {this.state.tasks[key]["parameters"][param_key]}
                            </button>
                          )
                        })}
                      </td>
                      <td>{this.state.tasks[key]["by"]}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="task-container">
              <div className="task-header">
                <div className="flex-item">Task</div>
                <div className="flex-item">Status</div>
                <div className="flex-item">Crawler</div>
                <div className="flex-item">Spider</div>
                <div className="flex-item">Parameter</div>
                <div className="flex-item">By</div>
              </div>
              {Object.keys(this.state.tasks).map((key, idx) => {
                return (
                  <a href={"/monitor/" + key} className="task-desc">
                    <div className="flex-item align-middle">{key}</div>
                    <div className="flex-item align-middle">{this.state.tasks[key]["status"]}</div>
                    <div className="flex-item align-middle">{this.state.tasks[key]["crawler"]}</div>
                    <div className="flex-item align-middle">{this.state.tasks[key]["spider"]}</div>
                    <div className="flex-item parameter align-middle">
                      {Object.keys(this.state.tasks[key]["parameters"]).map((param_key, idx) => {
                        return (
                          <button className="btn ms-1 me-1 mt-1 mb-1 btn-para" title={param_key}>
                            {param_key}: {this.state.tasks[key]["parameters"][param_key]}
                          </button>
                        )
                      })}
                    </div>
                    <div className="flex-item align-middle">{this.state.tasks[key]["by"]}</div>
                  </a>
                );
              })}
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
    this.child = React.createRef();
  }
  handleGetTask = (e) => {
    this.props.handleGetTask();
  };
  render() {
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
              <div className="nav-item">
                <a href="/">Control</a>
              </div>
              <div className="nav-item">
                <a href="/monitor" className="active">
                  Monitoring
                </a>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-success me-1"
            onClick={this.handleGetTask}
          >
            <i className="bi bi-arrow-bar-down"></i>
          </button>
        </div>
      </nav>
    );
  }
}

export default TaskOverview;
