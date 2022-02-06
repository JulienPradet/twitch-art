import App from "./src/client/twitch-alerts/App.svelte";
import {
  ClientDataStore,
  makeClientDataStore,
} from "./src/client/twitch-alerts/ClientDataStore";
import { DataEvent } from "./src/client/twitch-alerts/Events";

const clientDataStore = makeClientDataStore();
const socket = new WebSocket(import.meta.env.VITE_WEBSOCKET_URL);

socket.addEventListener("open", () => {
  console.log("connected");
});

socket.addEventListener("message", (event) => {
  const message: DataEvent = JSON.parse(event.data);
  const oldData = clientDataStore.get();

  if (message.type === "userMessage") {
    clientDataStore.set({
      ...oldData,
      lastUser: message.data,
    });
  } else if (message.type === "alert") {
    clientDataStore.set({
      ...oldData,
      alerts: oldData.alerts.concat({
        key: Math.random(),
        ...message.data,
      }),
    });
  }
});

const app = new App({
  target: document.body,
  props: {
    debug: !window.location.search.includes("twitch=1"),
    dataStore: clientDataStore,
  },
});
