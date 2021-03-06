import React, { Component } from "react";
import { Route, BrowserRouter as Router } from "react-router-dom";

import App1 from "./App1";
import Task from "./task";
import Task2 from "./task2";
import Log from "./Log";
import TaskOverview from "./taskOverview";
import Monitor from "./monitor";
// simple list
class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={Task} />
          <Route exact path="/newtask" component={Task2} />
          <Route exact path="/App1" component={App1} />
          <Route exact path="/log" component={Log} />
          <Route exact path="/monitor" component={TaskOverview} />
          <Route exact path="/monitor/:name" component={Monitor} />
        </div>
      </Router>
    );
  }
}

export default App;
