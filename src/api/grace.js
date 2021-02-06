// import Constants from "expo-constants";
// const { manifest } = Constants;

// export let EXPRESS_ROOT_PATH;
// if (!manifest.debuggerHost) {
//   EXPRESS_ROOT_PATH = `https://sosus-app.herokuapp.com`;
// } else {
//   EXPRESS_ROOT_PATH = `http://${manifest.debuggerHost.split(":").shift()}:8080`;
// }

import axios from "axios"

export const EXPRESS_ROOT_PATH = axios.create({
  baseURL:'https://sosus-app.herokuapp.com/api'
})