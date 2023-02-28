const md5       = require('md5')
const axios     = require('axios')
const { MobileAuth } = require('./auth')
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
                    console.log(`[OK] ${artist[0].toUpperCase() + artist.slice(1)} - ${track[0].toUpperCase() + track.slice(1)} | Scrobbled`)
                    return true;
                } else { return true } ; 
             }})
            .catch(err => {
                console.log("Error while trying to scrobble\n")
                console.log(`[${err.response.status}] Error: \n ${err.response.data}`)
                return false;
            })
    };
};

module.exports = { Scrobble }
