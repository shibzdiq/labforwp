import axios from "axios";
import { API_URL } from "../config/env";
import { applyInterceptors } from "./interceptors";

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

applyInterceptors(api);
