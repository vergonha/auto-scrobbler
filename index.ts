import Scrobbler from "./backend/scrobbler";
import generateTimestamp from "./backend/helpers/timestamp";
import sleep from "./backend/helpers/sleep";
import generateSessionKey from "./backend/helpers/session";
import Logger from "./backend/helpers/logger";
import Config from "./config";

async function main() {
  if (
    !(
      process.env.API &&
      process.env.SECRET &&
      process.env.USER_NAME &&
      process.env.PASSWD
    )
  ) {
    Logger.error("Missing environment variables.");
    process.exit();
  }

  const session = await generateSessionKey();
  if (!session) {
    Logger.error("Failed to generate session key.");
    process.exit();
  }

  while (true) {
    await run(session);
  }
}

async function run(sessionKey: string) {
  const instance = new Scrobbler(sessionKey);

  for (const track of Config.tracks) {
    await sleep(Config.timeout * 1000);
    const timestamp = generateTimestamp();
    await instance.scrobble(track, timestamp);
  }
}

main();
