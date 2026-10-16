import { createApp } from "./app";
import { config } from "./config";

createApp().listen(config.port, config.host, () => {
  console.log(`Wayve Mock API listening on port ${config.port}`);
});
