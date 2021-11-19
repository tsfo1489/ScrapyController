import axios from "axios";

const IP = "127.0.0.1";
const PORT = "1234";
const API = axios.create({
  baseURL: `http://${IP}:${PORT}`,
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
  },
  withCredentials: false,
});

export default API;
