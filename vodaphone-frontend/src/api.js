import axios from "axios";

const api = axios.create({
  baseURL: "https://timophone.onrender.com", // ton back Render
});

export default api;
