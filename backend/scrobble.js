const chalk             = require('chalk')
const md5               = require('md5')
const axios             = require('axios')
const { MobileAuth }    = require('./auth')
require('dotenv').config()

class Scrobble {
    constructor(user, password){
        this.user = user;
        this.password = password;
        this.baseURL = "http://ws.audioscrobbler.com/2.0/?";
    };

    async scrobble(track, artist, timestamp, prettyPrint){
        const Wrapper = new MobileAuth(this.user, this.password)
        if(!Wrapper){return false}
        
        let sessionKey = await Wrapper.getMobileSession()
            .then(response => {return new RegExp(/<key>(.*)<\/key>/).exec(response)[1]})


        const sig = md5([
            "api_key", process.env.API,
            "artist", artist,
            "method", "track.scrobble",
            "sk", sessionKey,
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
            sk: sessionKey,
            method: "track.scrobble"
        })

        return axios.post(this.baseURL + body)
            .then(res => {if(res.status == 200){ 
                if(prettyPrint){
                    let reIgnored = new RegExp(/ignored="(.*?)"/).exec(res.data)[1]
                    if(reIgnored == 0){
                        console.log(
                            chalk.bgGreen("[OK]") +
                            chalk.yellow(` | ${artist} - ${track} | `) +
                            chalk.green("Scrobbled")
                            )
                    } else {
                        chalk.bgRed("[Fail]") +
                        chalk.yellow(` | ${artist} - ${track} | `) +
                        chalk.red("Ignored")
                    }
                    return true;
                } else { return true } ; 
             }})
            .catch(err => {
                if(err.response.status == 429){
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
