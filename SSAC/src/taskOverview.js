import React, { Component } from "react";

class TaskOverview extends Component {
  constructor(props) {
    super(props);
    this.child = React.createRef();
  }
  render() {
    return (
      <div>
        <NavForm key="nav" name="nav" />
        <h1>Hello task overview page!!</h1>
        <ul>
          <li>
            ex1:<a href="/monitor/task?id=1">/monitor/task?id=1</a>
            <br />
            ex2:<a href="/monitor/task?id=2">/monitor/task?id=2</a>
          </li>
        </ul>
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
        </div>
      </nav>
    );
  }
}

export default TaskOverview;
