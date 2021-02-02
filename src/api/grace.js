import Constants from "expo-constants";
const { manifest } = Constants;

// this points to the IP address of each person's laptop where they run the express server
export const EXPRESS_ROOT_PATH = `http://${manifest.debuggerHost.split(":").shift()}:8080`;

