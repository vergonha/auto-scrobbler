import axios from "axios";
import md5 from "md5";
import chalk from "chalk";
import Logger from "./helpers/logger";
import { TrackInterface } from "../interfaces/config";
import handleErrors from "./handlers/error";

class Scrobbler {
  private readonly _sessionKey: string;
  private readonly _URL: string;

  constructor(sessionKey: string) {
    this._sessionKey = sessionKey;
    this._URL = "http://ws.audioscrobbler.com/2.0/?";
  }

  async scrobble(track: TrackInterface, timestamp: number): Promise<boolean> {
    const params = this.createParams(track, timestamp);
    try {
      const { data } = await axios.post(this._URL + params);
      const accepted = this.wasAccepted(data);

      if (accepted)
        console.log(
          chalk.bgGreen("[OK]") +
            chalk.yellow(` | ${track.artist} - ${track.name} | `) +
            chalk.green("Scrobbled")
        );
      else
        console.log(
          chalk.bgRed("[Fail]") +
            chalk.yellow(` | ${track.artist} - ${track.name} | `) +
            chalk.red("Ignored")
        );

      return true;
    } catch (error: unknown) {
      handleErrors("scrobbler", error);
      return false;
    }
  }

  private createParams(track: TrackInterface, timestamp: number) {
    const sig = this.generateSignature(track, timestamp);

    if (!process.env.API) {
      Logger.error(
        "Error while trying to generate request parameters! API key is missing."
      );
      return;
    }

    const data = new URLSearchParams({
      artist: track.artist,
      track: track.name,
      timestamp: `${timestamp}`,
      api_key: process.env.API,
      api_sig: sig,
      sk: this._sessionKey,
      method: "track.scrobble",
    });

    return data;
  }

  private generateSignature(track: TrackInterface, timestamp: number): string {
    return md5(
      [
        "api_key",
        process.env.API,
        "artist",
        track.artist,
        "method",
        "track.scrobble",
        "sk",
        this._sessionKey,
        "timestamp",
        timestamp,
        "track",
        track.name,
        process.env.SECRET,
      ].join("")
    ) as string;
  }

  private wasAccepted(data: string) {
    return !data.includes(`scrobbles ignored="1" accepted="0"`);
  }
}

export default Scrobbler;
