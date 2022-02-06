import { UserClientData } from "./client/twitch-alerts/ClientDataStore";
import { TwitchDefaultUser, TwitchFollower, TwitchUser } from "./TwitchUser";

export type TwitchData = {
  users: TwitchUser[];
};

const emptyData = {
  users: [],
};

const updateUser = (oldUser: TwitchUser, newUser: TwitchUser): TwitchUser => {
  if ("followingSince" in newUser) {
    return {
      ...oldUser,
      displayName: newUser.displayName,
      followingSince: newUser.followingSince,
    };
  }

  return {
    ...oldUser,
    displayName: newUser.displayName,
  };
};

export type AlertListener = (user: TwitchUser) => void;

class DataManager {
  private data: TwitchData;
  private changeListener: () => void;
  private alertListener: AlertListener;

  constructor(
    initialData?: TwitchData,
    onChange?: () => void,
    onAlert?: AlertListener
  ) {
    this.data = initialData || emptyData;
    this.changeListener = onChange || (() => {});
    this.alertListener = onAlert || (() => {});
  }

  exportData(): TwitchData {
    return this.data;
  }

  addExistingFollowers(followers: TwitchFollower[]) {
    const newUsers: TwitchUser[] = ([] as TwitchUser[]).concat(this.data.users);

    followers.forEach((newFollower) => {
      const existingUserIndex = this.data.users.findIndex(
        (user) => user.id === newFollower.id
      );
      if (existingUserIndex > -1) {
        newUsers[existingUserIndex] = updateUser(
          this.data.users[existingUserIndex],
          newFollower
        );
      } else {
        newUsers.push(newFollower);
      }
    });

    this.data = {
      ...this.data,
      users: newUsers,
    };

    this.changeListener();
  }

  addMessageForUser(user: TwitchUser) {
    const newUsers = ([] as TwitchUser[]).concat(this.data.users);
    let messageCount: number;

    const existingUserIndex = this.data.users.findIndex(
      (existingUser) => user.id === existingUser.id
    );
    if (existingUserIndex > -1) {
      messageCount = this.data.users[existingUserIndex].messageCount + 1;
      newUsers[existingUserIndex] = {
        ...this.data.users[existingUserIndex],
        messageCount: messageCount,
      };
    } else {
      messageCount = 1;
      newUsers.push({
        ...user,
        messageCount: messageCount,
      });
    }

    this.data = {
      ...this.data,
      users: newUsers,
    };

    this.changeListener();
    if (messageCount === 15) {
      this.alertListener(user);
    }
  }

  getClientDataForUser(userId: string): UserClientData | null {
    const user = this.data.users.find((user) => {
      return user.id === userId;
    });

    if (!user) {
      return null;
    }

    return {
      user: user,
      xp: user.messageCount,
      requiredXpForNextEvolution: 15,
    };
  }
}

export { DataManager };
