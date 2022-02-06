import "dotenv/config";
import { DataManager } from "./DataManager";
import { DataSaver } from "./DataSaver";
import { host, port } from "./env";
import Server from "./Server";
import { TwitchClient } from "./TwitchClient";
import { makeTwitchUser, TwitchUser } from "./TwitchUser";

const server = await Server(host, port);

const dataSaver = DataSaver();
const dataManager = new DataManager(
  dataSaver.load(),
  function onChange() {
    dataSaver.save(() => dataManager.exportData());
  },
  function onEvolution(user: TwitchUser) {
    server.triggerMessage({
      type: "alert",
      data: {
        user: user,
        evolutionRank: 2,
      },
    });
  }
);

const twitchClient = TwitchClient(
  function onInit(followers) {
    dataManager.addExistingFollowers(followers);
  },
  function onMessage(userId, displayName) {
    dataManager.addMessageForUser(
      makeTwitchUser({
        id: userId,
        displayName: displayName,
      })
    );
    const data = dataManager.getClientDataForUser(userId);

    if (data) {
      server.triggerMessage({
        type: "userMessage",
        data: data,
      });
    }
  }
);

server.start();

const close = async () => {
  await Promise.all([server.close(), dataSaver.close(), twitchClient.close()]);
  process.exit(0);
};

process.once("SIGINT", async function (code) {
  console.log("SIGINT received...");
  await close();
});

process.once("SIGTERM", async function (code) {
  console.log("SIGTERM received...");
  await close();
});
