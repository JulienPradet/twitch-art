import tmi from "tmi.js";
import fetch from "node-fetch";
import { twitchIdentity, twitchBearer, twitchClientId } from "./env";
import { makeTwitchFollower, TwitchFollower } from "./TwitchUser";

type TwitchApiFollow = {
  from_id: string;
  from_name: string;
  followed_at: string;
};

type TwitchApiFollowsBody = {
  total: number;
  data: TwitchApiFollow[];
};

const TwitchClient = (
  onInit: (followers: TwitchFollower[]) => void,
  onMessage: (userId: string, displayName: string) => void
) => {
  const client = new tmi.Client({
    options: { debug: true, messagesLogLevel: "info" },
    connection: {
      reconnect: true,
      secure: true,
    },
    identity: twitchIdentity,
    channels: ["superroipatate"],
  });

  // TODO: Handle pagination when we have more than 100 followers between server starts
  fetch("https://api.twitch.tv/helix/users/follows?to_id=253152270&first=100", {
    method: "GET",
    headers: {
      Accept: "application/vnd.twitchtv.v5+json",
      Authorization: `Bearer ${twitchBearer}`,
      "Client-ID": twitchClientId,
    },
  })
    .then((response: any) => {
      return response.json();
    })
    .then((data: TwitchApiFollowsBody) => {
      onInit(
        data.data.map((follow) => {
          return makeTwitchFollower({
            id: follow.from_id,
            displayName: follow.from_name,
            followingSince: new Date(follow.followed_at),
          });
        })
      );
    });

  client.connect().catch(console.error);

  client.on("message", (channel, tags, message, self) => {
    if (self) return;

    if (tags["message-type"] === "chat") {
      if (!tags["user-id"]) {
        console.error("Oops, user-id undefined");
        return;
      }
      if (!tags["username"]) {
        console.error("Oops, username undefined");
        return;
      }

      onMessage(tags["user-id"], tags["username"]);
    }
  });

  return {
    close: () => {
      return client.disconnect();
    },
  };
};

export { TwitchClient };
