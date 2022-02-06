import App from "./src/client/fresque/App.svelte";
import { TwitchData } from "./src/DataManager";

const container = document.querySelector("#container");
if (!container) {
  throw new Error(
    "Invalid HTML: should contain an element with id `container`."
  );
}

const start = async () => {
  const query = await fetch("/output/data.json");
  const data: TwitchData = await query.json();

  const app = new App({
    target: container,
    props: {
      data: data,
    },
  });
};

start();
