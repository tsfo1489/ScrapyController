import React, { Component } from "react";
import API from "./API.js";

class App1 extends Component {
  constructor(props) {
    super(props);
    this.child = React.createRef();
  }
  state = {
    maxNo: 3,
    boards: [
      {
        board_No: 1,
        board_Title: "Crawler Name",
        board_Keyword: ["K-pop", "BTS", "TWICE"],
        isStarted: "False",
        crawler_No: null,
      },
      {
        board_No: 2,
        board_Title: "Reddit KDRAMA",
        board_Keyword: ["KD", "BTS", "TWICE"],
        isStarted: "False",
        crawler_No: null,
      },
    ],
  };
  handleSaveData = (data) => {
    console.log("handleSaveData");
    let boards = this.state.boards;
    if (
      data.board_No === null ||
      data.board_No === "" ||
      data.board_No === undefined
    ) {
      this.setState({
        maxNo: this.state.maxNo + 1,
        boards: this.state.boards.concat({
          board_No: this.state.maxNo,
          board_Title: data.board_Title,
          board_Keyword: data.board_Keyword,
          isStarted: "False",
          crawler_No: null,
        }),
      });
    } else {
      console.log(data.board_No);
      this.setState({
        boards: boards.map((row) =>
          data.board_No === row.board_No ? { ...data } : row
        ),
      });
    }
  };

  handleSelectRow = (row) => {
    this.child.current.handleSelectRow(row);
  };
  handleRemove = (board_No) => {
    this.setState({
      boards: this.state.boards.filter((row) => row.board_No !== board_No),
    });
  };
  handleSubmit = (board_Title, board_Keyword) => {
    console.log("handleSubmit");
    const post = async () => {
      try {
        const result = await API.post("/create/", {
          name: board_Title,
          crawlers: [
            {
              type: "News",
              newspaperId: 4,
              parameters: {
                begin_date: "20180101",
                end_date: "20210630",
                keywords: [board_Keyword],
              },
            },
          ],
        });
        console.log("create ", result);
      } catch (error) {
        console.log(error);
      }
    };
    const response = post();
    console.log("submit end");
    console.log(response);
  };

  render() {
    const { boards } = this.state;

    return (
      <div>
        <BoardForm
          onSaveData={this.handleSaveData}
          onSubmit={this.handleSubmit}
          ref={this.child}
        />
        <table border="1">
          <tbody>
            <tr align="center">
              <td width="50">No.</td>
              <td width="300">Title</td>
              <td width="100">Keyword</td>
              <td width="50">Run</td>
            </tr>
            {boards.map((row) => (
              <BoardItem
                key={row.board_Title}
                row={row}
                onRemove={this.handleRemove}
                onSelectRow={this.handleSelectRow}
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

class BoardItem extends React.Component {
  handleRemove = () => {
    const { row, onRemove } = this.props;
    onRemove(row.board_No);
  };

  handleStart = () => {
    //   let response = await API.post("/start/", {
    //     name: row.board_Title,
    //     crawlers: [
    //       {
    //         type: "News",
    //         newspaperId: 4,
    //         parameters: {
    //           begin_date: "20180101",
    //           end_date: "20210630",
    //           keywords: [row.board_Keyword],
    //         },
    //       },l
    //     ],
    //   });
    //   if (response === "ok") row.isStarted = True;
  };
  handleSelectRow = () => {
    const { row, onSelectRow } = this.props;
    onSelectRow(row);
  };
  render() {
    console.log(this.props.row.board_No);
    return (
      <tr>
        <td>{this.props.row.board_No}</td>
        <td>
          <a href="#/" onClick={this.handleSelectRow}>
            {this.props.row.board_Title}
          </a>
        </td>
        <td>{this.props.row.board_Keyword}</td>
        <td>{this.props.row.isStarted}</td>
        <td>
          <button onClick={this.handleRemove}>X</button>
        </td>
        <td>
          <button onClick={this.handleStart}>Start</button>
        </td>
      </tr>
    );
  }
}
class BoardForm extends Component {
  state = {
    board_Title: "",
    board_Keyword: "",
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSelectRow = (row) => {
    this.setState(row);
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.onSaveData(this.state);
    this.props.onSubmit(this.state.board_Title, this.state.board_Keyword);
    this.setState({
      board_No: "",
      board_Title: "",
      board_Keyword: "",
    });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          placeholder="title"
          name="board_Title"
          onChange={this.handleChange}
        />
        <input
          placeholder="keyword"
          name="board_Keyword"
          onChange={this.handleChange}
        />
        <button type="submit">Save</button>
      </form>
    );
  }
}
export default App1;
