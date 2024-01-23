const chalk = require('chalk')
require('dotenv').config();

const { Scrobbler } = require('./backend/scrobbler')
const { generateTimestamp, generateSessionKey, sleep } = require('./backend/helpers')

async function main() {

    if (!(
        process.env.API &&
        process.env.SECRET &&
        process.env.USER_NAME &&
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
        
        if (!Array.isArray(tracksObject) || tracksObject.length === 0) 
            throw new Error("Tracks are not in a valid format.")

        if (tracksObject[0].name === undefined || tracksObject[0].artist === undefined) 
            throw new Error("Tracks are not in a valid format.")
        
    } catch (error) {
        console.log(chalk.bgRed("[Fail]"), chalk.red("Make sure the tracks are in the right format, with commas in the right place, double quotes, etc..."))
        console.log(chalk.red(error.message))
        process.exit();
    }

    for (let track of tracksObject) {
        await sleep(process.env.TIMEOUT * 1000);
        track.timestamp = generateTimestamp();

        const _ = new Scrobbler(sessionKey);
        try { await _.scrobble(track) }
        catch { console.log(`[Fail] ${track.name} - ${track.artist} | Not Scrobbled`) }
    };

};


main()