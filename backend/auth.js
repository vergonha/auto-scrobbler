const md5       = require('md5');
const axios     = require('axios')
const Scrobble  = require('./scrobble')
require('dotenv').config()

export default class MobileAuth {
    constructor(user, password){
        this.user = user;
        this.password = password;
        this.baseURL = "http://ws.audioscrobbler.com/2.0/?";
    };

    getMobileSession(){
        // Combo: 
        // md5(api_key<YOUR_API_KEY>method<auth.getMobileSession>password<YOUR_PASSWD>username<YOUR_USERNAME><YOUR_SECRET>)
        const sig = md5([
            "api_key", process.env.API,
            "method",  "auth.getMobileSession",
            //It needs to be in that exact order for the signature to work.
            "password", (this.password || process.env.PASSWD),
            "username", (this.user || process.env.USERNAME),
            process.env.SECRET].join(""));
            

        const body = new URLSearchParams({
            api_key: process.env.API,
            api_sig: sig,
            method: "auth.getMobileSession",
            username: (this.user || process.env.USERNAME),
            password: (this.password || process.env.PASSWD)
            
        })

        return axios.post(this.baseURL + body)
            .then(res => {if(res.status == 200){ return res.data }})
            .then(data => { return data })
            .catch( err => {
                console.log("Probably invalid user:password combination.")
                console.log(`[${err.response.status}]:\n ${err.response.data}`)
            });
    };
};