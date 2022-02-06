import fastify from "fastify";
import fastifyWebsocket from "fastify-websocket";
import fastifyStatic from "fastify-static";
import { join } from "path";

import { DataEvent } from "./client/twitch-alerts/Events";

const Server = async (host: string, port: number) => {
  const app = fastify();

  let connections: WebSocket[] = [];

  app.register(fastifyWebsocket);
  app.get(
    "/ws",
    { websocket: true },
    (connection /* SocketStream */, req /* FastifyRequest */) => {
      connections.push(connection.socket);

      connection.socket.on("message", () => {
        // message.toString() === 'hi from client'
        connection.socket.send("hi from server");
      });
    }
  );

  if (process.env.NODE_ENV === "production") {
    app.register(fastifyStatic, {
      root: join(process.cwd(), "dist/client"),
    });

    app.get("/output/data.json", (request, reply) => {
      reply.sendFile("data.json", join(process.cwd(), "output"));
    });
  } else {
    const fastifyProxy = (await import("fastify-http-proxy")).default;

    app.register(fastifyProxy, {
      upstream: "http://localhost:3000",
    });
  }

  app.get("*", {}, (request, reply) => {
    reply.send("OK");
  });

  return {
    triggerMessage: (message: DataEvent) => {
      connections.forEach((socket) => {
        socket.send(JSON.stringify(message));
      });
    },
    start: () => {
      app.listen(port, host, (err) => {
        console.log("start", port);

        if (err) {
          console.log("error");
          console.error(err);
          app.log.error(err);
          process.exit(1);
        }
      });
    },
    close: () => {
      return app.close();
    },
  };
};

export default Server;
