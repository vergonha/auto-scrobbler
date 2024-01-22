const chalk = require('chalk')
const md5 = require('md5')
const axios = require('axios')
require('dotenv').config()

class Scrobble {
    constructor(sessionKey) {
        this.sessionKey = sessionKey
        this.baseURL = "http://ws.audioscrobbler.com/2.0/?";
    };

    async scrobble(track, artist, timestamp) {

        const sig = md5([
            "api_key", process.env.API,
            "artist", artist,
            "method", "track.scrobble",
            "sk", this.sessionKey,
            "timestamp", timestamp,
            "track", track,
            process.env.SECRET
        ].join(""))

        const body = new URLSearchParams({
            artist: artist,
            track: track,
            timestamp: timestamp,
            api_key: process.env.API,
            api_sig: sig,
            sk: this.sessionKey,
            method: "track.scrobble"
        })

        return await axios.post(this.baseURL + body)
            .then(res => {
                if (res.status == 200) {
                    if (res.data.includes(`scrobbles ignored="1" accepted="0"`)) {
                        console.log(
                            chalk.bgRed("[Fail]") +
                            chalk.yellow(` | ${artist} - ${track} | `) +
                            chalk.red("Ignored")
                        )
                    } else {
                        console.log(
                            chalk.bgGreen("[OK]") +
                            chalk.yellow(` | ${artist} - ${track} | `) +
                            chalk.green("Scrobbled")
                        )
                    }

                    return true;
                }
            })
            .catch(err => {
                if (err.response.status == 429) {
                    console.clear()
                    console.log(chalk.red("[Fail] Rate limited. Please, wait some minutes before try again..."))
                    process.exit();
                };
                
                console.log(chalk.bgRed("Error while trying to scrobble\n"))
                console.log(chalk.red(`[${err.response.status}] Error: \n ${err.response.data}`))
                return false;
            })
    };
};

module.exports = { Scrobble }
