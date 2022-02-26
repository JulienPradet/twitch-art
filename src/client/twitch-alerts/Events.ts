import { AlertClientData, UserClientData } from "./ClientDataStore";

export type UserMessageEvent = {
  type: "userMessage";
  data: UserClientData;
};

export type AlertEvent = {
  type: "alert";
  data: AlertClientData;
};

// Used to keep the connection opened
export type LiveEvent = {
  type: "live";
  data: null;
};

export type DataEvent = UserMessageEvent | AlertEvent | LiveEvent;
