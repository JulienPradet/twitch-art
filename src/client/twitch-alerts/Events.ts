import { AlertClientData, UserClientData } from "./ClientDataStore";

export type UserMessageEvent = {
  type: "userMessage";
  data: UserClientData;
};

export type AlertEvent = {
  type: "alert";
  data: AlertClientData;
};

export type DataEvent = UserMessageEvent | AlertEvent;
