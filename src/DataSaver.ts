import { URL } from "url"; // in Browser, the URL in native accessible on window
import { join } from "path";
import { readFileSync } from "fs";
import { writeFile } from "fs/promises";
import { TwitchData } from "./DataManager";

const __dirname = new URL(".", import.meta.url).pathname;

const DataSaver = (timeout = 100) => {
  const filename = join(__dirname, "../output/data.json");
  let timeoutReference: NodeJS.Timeout | null = null;
  let closeResolve: (value: void) => void | null;

  return {
    load: (): TwitchData => {
      const buffer = readFileSync(filename);
      return JSON.parse(buffer.toString());
    },
    save: (getExportedData: () => TwitchData) => {
      if (timeoutReference) {
        clearTimeout(timeoutReference);
        timeoutReference = null;
      }

      timeoutReference = setTimeout(() => {
        const data = getExportedData();
        writeFile(filename, JSON.stringify(data, null, 2));

        timeoutReference = null;

        if (closeResolve) {
          closeResolve();
        }
      }, timeout);
    },
    close: () => {
      return new Promise<void>((resolve, reject) => {
        if (timeoutReference) {
          closeResolve = resolve;
        } else {
          resolve();
        }
      });
    },
  };
};

export { DataSaver };
