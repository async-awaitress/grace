import Constants from "expo-constants";
const { manifest } = Constants;

export let EXPRESS_ROOT_PATH;
if (!manifest.debuggerHost) {
  EXPRESS_ROOT_PATH = `http://localhost:8080`;
} else {
  EXPRESS_ROOT_PATH = `http://${manifest.debuggerHost.split(":").shift()}:8080`;
}
