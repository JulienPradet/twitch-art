import { TwitchUser } from "../../TwitchUser";

export type UserClientData = {
  user: TwitchUser;
  xp: number;
  requiredXpForNextEvolution: number;
};

export type AlertClientData = {
  key?: number;
  user: TwitchUser;
  evolutionRank: number;
};

export type ClientData = {
  lastUser: UserClientData | null;
  alerts: AlertClientData[];
};
type ClientDataListener = (data: ClientData) => void;

export type ClientDataStore = {
  subscribe: (listener: ClientDataListener) => () => void;
  set: (newData: ClientData) => void;
  get: () => ClientData;
  deleteFirstAlert: () => void;
  getUser: (id: string) => UserClientData;
};

const makeClientDataStore = (): ClientDataStore => {
  let data: ClientData = {
    lastUser: null,
    alerts: [],
  };
  let listeners: ClientDataListener[] = [];

  const set = (newData: ClientData) => {
    data = newData;
    listeners.forEach((listener) => {
      listener(newData);
    });
  };

  return {
    subscribe: (listener: ClientDataListener) => {
      listeners.push(listener);
      listener(data);
      return () => {
        listeners = listeners.filter((item) => item !== listener);
      };
    },
    set: set,
    get: (): ClientData =>
      data || {
        user: null,
      },
    deleteFirstAlert: (): void => {
      set({
        ...data,
        alerts: data.alerts.slice(1),
      });
    },
    getUser: (id: string): UserClientData => {
      throw new Error("not implemented yet.");
    },
  };
};

export { makeClientDataStore };
