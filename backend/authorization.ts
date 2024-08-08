import md5 from "md5";
import axios, { type AxiosError } from "axios";
import handleErrors from "./handlers/error";
import Logger from "./helpers/logger";

class MobileAuthorization {
  private readonly _password: string;
  private readonly _username: string;
  private readonly _URL: string;

  constructor(username: string, password: string) {
    Logger.debug("Mobile Authorization initialized.");
    Logger.debug(`Loged as ${username}:${password}`);
    this._username = username;
    this._password = password;
    this._URL = "http://ws.audioscrobbler.com/2.0/?";
  }

  public async authorize() {
    try {
      const params = this.generateRequestParameters();
      Logger.debug(`Authorization Parameters: ${params}`);
      const { data } = await axios.post(this._URL, params);

      return this.extractKey(data);
    } catch (errors: unknown) {
      handleErrors("auth", errors);
    }
  }

  private generateRequestParameters() {
    const sig = this.generateSignature();
    Logger.debug(`Signature: ${sig}`);

    if (!process.env.API) {
      Logger.error(
        "Error while trying to generate request parameters! API key is missing."
      );
      return;
    }

    const params = new URLSearchParams({
      api_key: process.env.API,
      api_sig: sig,
      method: "auth.getMobileSession",
      username: this._username,
      password: this._password,
    });

    return params;
  }

  private extractKey(xml: string) {
    const keyRegex = new RegExp(/<key>(.*?)<\/key>/);
    const key = keyRegex.exec(xml);

    if (key == null) {
      Logger.error("Error while trying to extract the key from the response.");
      process.exit();
    }

    Logger.debug(`Key: ${key[1]}`);
    Logger.debug("Mobile Authorization OK.");
    return key[1];
  }

  private generateSignature(): string {
    // Combo:
    // md5(api_key<YOUR_API_KEY>method<auth.getMobileSession>password<YOUR_PASSWD>username<USERNAME><YOUR_SECRET>)
    return md5(
      [
        "api_key",
        process.env.API,
        "method",
        "auth.getMobileSession",
        //It needs to be in that exact order for the signature to work.
        "password",
        this._password,
        "username",
        this._username,
        process.env.SECRET,
      ].join("")
    ) as string;
  }
}

if (!process.env.USER_NAME || !process.env.PASSWD) {
  process.exit();
}

export default MobileAuthorization;
