import Constants from "expo-constants";
const { manifest } = Constants;

// export let EXPRESS_ROOT_PATH;
// if (!manifest.debuggerHost) {
//   EXPRESS_ROOT_PATH = `https://sosus-app.herokuapp.com`;
// } else {
//   EXPRESS_ROOT_PATH = `http://${manifest.debuggerHost.split(":").shift()}:8080`;
// }

import axios from "axios";

let baseURL;
if (process.env.ENV === "development") {
  if (!manifest.debuggerHost) {
    console.log("inside first if")
    // local host when using web browser
    baseURL = `https://localhost:8080/api`;
    console.log("local ");
  } else {
    // to find IP address of local machine
    baseURL = `http://${manifest.debuggerHost.split(":").shift()}:8080/api`;
  }
} else {
  baseURL = "https://sosus-app.herokuapp.com/api";
  console.log("heroku ");
}

export const EXPRESS_ROOT_PATH = axios.create({
  baseURL: baseURL,
});
