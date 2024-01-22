const chalk = require('chalk')
require('dotenv').config();

const { Scrobble } = require('./backend/scrobble')
const { generateTimestamp, generateSessionKey, sleep } = require('./backend/helpers')

async function main() {

    if (!(
        process.env.API &&
        process.env.SECRET &&
        process.env.LOGIN &&
        process.env.PASSWD &&
        process.env.TRACKS &&
        process.env.TIMEOUT
    )) {
        console.log(chalk.bgRed("[Fail]"), chalk.red("Please, check your enviroment variables in .env file."))
        process.exit();
    };

    const sessionKey = await generateSessionKey();
    while (true) {
        await run(sessionKey)
    }
}

async function run(sessionKey) {
    let tracksObject = undefined; // for now

    try {
        tracksObject = JSON.parse(process.env.TRACKS)
    } catch (error) {
        console.log(chalk.bgRed("[Fail]"), chalk.red("Make sure the tracks are in the right format, with commas in the right place, double quotes, etc..."))
        process.exit();
    }

    for (let track of tracksObject) {
        await sleep(process.env.TIMEOUT * 1000);
        const date = generateTimestamp();
        const Wrapper = new Scrobble(sessionKey);
        try { await Wrapper.scrobble(track['name'], track['artist'], date/1000 ) }
        catch { console.log(`[Fail] ${track['name']} - ${track['artist']} | Not Scrobbled`) }
    };

};


main()