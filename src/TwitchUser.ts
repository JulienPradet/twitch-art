interface MinimalTwitchUserDefinition {
  id: string;
  displayName: string;
}

export interface TwitchDefaultUser {
  id: string;
  displayName: string;
  messageCount: number;
}

export interface TwitchFollower extends TwitchDefaultUser {
  followingSince: Date;
}

export type TwitchUser = TwitchDefaultUser | TwitchFollower;

export const makeTwitchUser = (
  user: Partial<TwitchDefaultUser> & MinimalTwitchUserDefinition
): TwitchUser => {
  return {
    messageCount: 0,
    ...user,
  };
};

export const makeTwitchFollower = (
  user: Partial<TwitchFollower> & MinimalTwitchUserDefinition
): TwitchFollower => {
  return {
    messageCount: 0,
    followingSince: new Date(),
    ...user,
  };
};
