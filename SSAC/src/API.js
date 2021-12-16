import axios from "axios";

const IP = "localhost";
const PORT = "6000";
const API = axios.create({
  baseURL: `http://${IP}:${PORT}`,
  headers: {
    "Content-Type": "application/json;charset=UTF-8"
  },
  withCredentials: false,
});

export default API;
