const md5       = require('md5')
const axios     = require('axios')
const { MobileAuth } = require('./auth')
require('dotenv').config()

export default class Scrobble {
    constructor(user, password){
        this.user = user;
        this.password = password;
        this.baseURL = "http://ws.audioscrobbler.com/2.0/?";
    };

    async scrobble(track, artist, timestamp){
        const Wrapper = new MobileAuth(this.user, this.password)
        
        const old_sig = md5([
            "api_key", process.env.API,
            "method",  "auth.getMobileSession",
            //It needs to be in that exact order for the signature to work.
            "password", (this.password || process.env.PASSWD),
            "username", (this.user || process.env.USERNAME),
            process.env.SECRET].join(""));

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
            .then(res => {if(res.status == 200){ return true }})
            .catch(err => {
                console.log("Error while trying to scrobble\n")
                console.log(`[${err.response.status}] Error: \n ${err.response.data}`)
                return false;
            })
    };
};


// Scrobble test
//let i= new Scrobble();
//i.scrobble('harbor', 'clairo', parseInt(Math.floor(Date.now() / 1000)))
//    .then(sk => console.log(sk))

