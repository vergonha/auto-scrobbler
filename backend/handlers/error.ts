import axios, { AxiosError } from "axios";
import Logger from "../helpers/logger";

export default function handleErrors(
  source: "scrobbler" | "auth",
  error: unknown
) {
  if (axios.isAxiosError(error)) {
    source == "scrobbler"
      ? handleAuthorizationErrors(error)
      : handleScrobbleErrors(error);
  } else {
    Logger.error("Error while trying to authorize user: Unhandled error.");
    process.exit();
  }
}

function handleScrobbleErrors(error: AxiosError) {
  if (error.status == 429) {
    console.clear();
    Logger.error("Rate limited. Please, wait some minutes before try again...");
    process.exit();
  }

  Logger.error("An error occurred while trying to scrobble.");
  if (!error.response) {
    Logger.error(`Uknown error`);

    return;
  }

  Logger.error(`[${error.response.status}] Error: \n ${error.response.data}`);
}

function handleAuthorizationErrors(error: AxiosError) {
  const errorsRegex = new RegExp(/<error code=".*">(.*?)<\/error>/);
  const errorCodeRegex = new RegExp(/<error code="(.*?)">/);
  if (
    !error.response ||
    typeof error.response.data != "string" ||
    !error.response.data
  ) {
    Logger.error(
      "Error while trying to authorize user: No response from the server."
    );
    return;
  }

  Logger.error(`[${error.response.status}] Error: `);

  const errors = errorsRegex.exec(error.response.data);
  Logger.error(`${errors == null ? "Unknown response!" : errors[1]}`);

  const errorCode = errorCodeRegex.exec(error.response.data);
  Logger.error(`Error code: ${errorCode == null ? "Unknown" : errorCode[1]}`);

  Logger.warning(
    "See the API errors better specified at this link: \n" +
      "https://lastfm-docs.github.io/api-docs/codes/"
  );
  process.exit();
}
