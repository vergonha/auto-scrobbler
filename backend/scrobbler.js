const chalk = require('chalk')
const md5 = require('md5')
const axios = require('axios')
require('dotenv').config()

class Scrobbler {
    constructor(sessionKey) {
        this.sessionKey = sessionKey
        this.baseURL = "http://ws.audioscrobbler.com/2.0/?";
    };

    async scrobble(track) {
        const params = this.createParams(track)

        try {
            const response = await axios.post(this.baseURL + params)


            const accepted = this.wasAccepted(response.data)
            if (accepted)
                console.log(chalk.bgGreen("[OK]") + chalk.yellow(` | ${track.artist} - ${track.name} | `) + chalk.green("Scrobbled"))
            else
                console.log(chalk.bgRed("[Fail]") + chalk.yellow(` | ${track.artist} - ${track.name} | `) + chalk.red("Ignored"))

            return true
        } catch (err) {
            this.handleErrors(err)
            return false
        }
    };

    createSignature = (track) => {
        const sig = md5([
            "api_key", process.env.API,
            "artist", track.artist,
            "method", "track.scrobble",
            "sk", this.sessionKey,
            "timestamp", track.timestamp,
            "track", track.name,
            process.env.SECRET
        ].join(""))

        return sig
    }

    createParams = (track) => {
        const sig = this.createSignature(track)
        const data = new URLSearchParams({
            artist: track.artist,
            track: track.name,
            timestamp: track.timestamp,
            api_key: process.env.API,
            api_sig: sig,
            sk: this.sessionKey,
            method: "track.scrobble"
        })

        return data
    }

    handleErrors = (err) => {
        if (err.response.status == 429) {
            console.clear()
            console.log(chalk.red("[Fail] Rate limited. Please, wait some minutes before try again..."))
            process.exit();
        };

        console.log(chalk.bgRed("Error while trying to scrobble\n"))
        console.log(chalk.red(`[${err.response.status}] Error: \n ${err.response.data}`))

        return false;
    }


    wasAccepted = (data) => {
        return !data.includes(`scrobbles ignored="1" accepted="0"`)
    }


};

module.exports = { Scrobbler }
