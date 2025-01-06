import axios from "axios";
import { notify } from "../utils/notify";

export const axiosRequestInterceptor = () =>
  axios.interceptors.request.use(
    function (config) {
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

export const axiosResponseInterceptor = () =>
  axios.interceptors.response.use(
    function (response) {
      console.log("res", response);
      if (response.data.notification?.value) {
        notify("success", response.data.notification.message);
      }
      return response;
    },
    function (error) {
      console.log("App error");
      return Promise.reject(error);
    }
  );
