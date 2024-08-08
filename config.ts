import type { ConfigurationTemplate } from "./interfaces/config";

const Config: ConfigurationTemplate = {
  tracks: [
    {
      name: "There is a Light That Never Goes Out",
      artist: "The Smiths",
    },

    {
      name: "This Charming Man",
      artist: "The Smiths",
    },
  ],
  timeout: 1,
  debug: false,
};

export default Config;
