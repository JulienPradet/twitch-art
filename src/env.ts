export const twitchIdentity = {
  username: process.env.TWITCH_IDENTITY_USERNAME as string,
  password: process.env.TWITCH_IDENTITY_PASSWORD as string,
};

export const twitchBearer = process.env.TWITCH_BEARER as string;

export const twitchClientId = process.env.TWITCH_CLIENT_ID as string;

export const host = process.env.HOST || "0.0.0.0";
export const port = Number(process.env.PORT) || 3004;
export const devPort = Number(process.env.DEV_PORT) || 3002;
