import { it, describe, expect, fn } from "vitest";
import { DataManager } from "./DataManager";
import {
  makeTwitchFollower,
  makeTwitchUser,
  TwitchFollower,
} from "./TwitchUser";

describe("DataManager", () => {
  describe("exportData", () => {
    it("should return an empty array for users if the manager was initialized with an empty json", () => {
      const dataManager = new DataManager(undefined);
      expect(dataManager.exportData().users).toEqual([]);
    });

    it("should return the same number of users if the manager was initialized with 3 users already", () => {
      const dataManager = new DataManager({
        users: [
          makeTwitchUser({
            id: "5",
            displayName: "Bob",
          }),
          makeTwitchUser({
            id: "45",
            displayName: "Alice",
          }),
          makeTwitchUser({
            id: "952",
            displayName: "Carl",
          }),
        ],
      });

      expect(dataManager.exportData().users.length).toBe(3);
    });
  });

  describe("addExistingFollowers", () => {
    it("should add a new user to an empty dataManager", () => {
      const dataManager = new DataManager();
      dataManager.addExistingFollowers([
        makeTwitchFollower({
          id: "5",
          displayName: "Bob",
          followingSince: new Date("2021-12-01"),
        }),
      ]);

      expect(dataManager.exportData().users.length).toBe(1);
    });

    it("should not add a new user if the follower already existed in the data manager", () => {
      const bobUser = makeTwitchFollower({
        id: "5",
        displayName: "Bob",
        followingSince: new Date("2021-12-01"),
      });

      const dataManager = new DataManager({
        users: [bobUser],
      });
      dataManager.addExistingFollowers([bobUser]);

      expect(dataManager.exportData().users.length).toBe(1);
    });

    it("should update the user name if we're adding a follower that already exists in the data manager but updated their name", () => {
      const bobUser = makeTwitchFollower({
        id: "5",
        displayName: "Bob",
        followingSince: new Date("2021-12-01"),
      });

      const dataManager = new DataManager({
        users: [bobUser],
      });
      dataManager.addExistingFollowers([
        {
          ...bobUser,
          displayName: "Alice",
        },
      ]);

      expect(dataManager.exportData().users.length).toBe(1);
      expect(dataManager.exportData().users[0].displayName).toBe("Alice");
    });

    it("should keep the number of messages if the user already had some messages", () => {
      const bobUser = makeTwitchUser({
        id: "5",
        displayName: "Bob",
        messageCount: 5,
      });

      const dataManager = new DataManager({
        users: [bobUser],
      });
      dataManager.addExistingFollowers([
        makeTwitchFollower({
          id: "5",
          displayName: "Bob",
          followingSince: new Date("2021-12-01"),
        }),
      ]);

      expect(dataManager.exportData().users[0]).toEqual({
        id: "5",
        displayName: "Bob",
        followingSince: new Date("2021-12-01"),
        messageCount: 5,
      });
    });

    it("should call the onChangeListener when a new follower is added", () => {
      const onChangeMock = fn();
      const dataManager = new DataManager({ users: [] }, onChangeMock);
      dataManager.addExistingFollowers([
        makeTwitchFollower({
          id: "5",
          displayName: "Bob",
          followingSince: new Date("2021-12-01"),
        }),
      ]);
      expect(onChangeMock).toHaveBeenCalledOnce();
    });
  });

  describe("addMessageForUser", () => {
    it("should increment the number of messages of a user if the user already exists in the data manager", () => {
      const bobUser = makeTwitchUser({
        id: "5",
        displayName: "Bob",
      });

      const dataManager = new DataManager({
        users: [bobUser],
      });

      dataManager.addMessageForUser(bobUser);

      expect(dataManager.exportData().users[0].messageCount).toBe(1);
    });

    it("should add a new user to the data manager if the user did not previously exist", () => {
      const dataManager = new DataManager();

      const bobUser = makeTwitchUser({
        id: "5",
        displayName: "Bob",
      });
      dataManager.addMessageForUser(bobUser);

      expect(dataManager.exportData().users[0]).toEqual({
        id: "5",
        displayName: "Bob",
        messageCount: 1,
      });
    });

    it("should call the change listener when a new message is added", () => {
      const onChangeMock = fn();
      const bobUser = makeTwitchUser({
        id: "5",
        displayName: "Bob",
      });

      const dataManager = new DataManager(
        {
          users: [bobUser],
        },
        onChangeMock
      );

      dataManager.addMessageForUser(bobUser);

      expect(onChangeMock).toHaveBeenCalledOnce();
    });
  });

  describe("getClientDataForUser", () => {
    it("should return an xp of 0 if the user was just created", () => {
      const bobUser = makeTwitchUser({
        id: "5",
        displayName: "Bob",
      });

      const dataManager = new DataManager({
        users: [bobUser],
      });

      expect(dataManager.getClientDataForUser("5")).toEqual({
        displayName: "Bob",
        xp: 0,
        requiredXpForNextEvolution: 15,
      });
    });
    it("should add 1 xp for a user that just sent a message", () => {
      const bobUser = makeTwitchUser({
        id: "5",
        displayName: "Bob",
      });

      const dataManager = new DataManager({
        users: [bobUser],
      });
      dataManager.addMessageForUser(bobUser);

      expect(dataManager.getClientDataForUser("5")).toEqual({
        displayName: "Bob",
        xp: 1,
        requiredXpForNextEvolution: 15,
      });
    });
  });
});
