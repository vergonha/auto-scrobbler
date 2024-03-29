const md5 = require('md5');
const axios = require('axios')
const chalk = require('chalk')
require('dotenv').config()

class MobileAuth {
    constructor(user, password) {
        this.user = user;
        this.password = password;
        this.baseURL = "http://ws.audioscrobbler.com/2.0/?";
    };


    getMobileSession = async () => {
        const params = this.createParams()


        try {
            const response = await axios.post(this.baseURL + params)


            const key = this.extractKey(response.data)
            return key
        } catch (err) {
            this.handleErrors(err)
        }
    };

    createSignature = () => {
        // Combo: 
        // md5(api_key<YOUR_API_KEY>method<auth.getMobileSession>password<YOUR_PASSWD>username<USERNAME><YOUR_SECRET>)
        const sig = md5([
            "api_key", process.env.API,
            "method", "auth.getMobileSession",
            //It needs to be in that exact order for the signature to work.
            "password", (this.password || process.env.PASSWD),
            "username", (this.user || process.env.USER_NAME),
            process.env.SECRET].join(""));

        return sig
    }

    createParams = () => {
        const sig = this.createSignature()
        const params = new URLSearchParams({
            api_key: process.env.API,
            api_sig: sig,
            method: "auth.getMobileSession",
            username: (this.user || process.env.USER_NAME),
            password: (this.password || process.env.PASSWD)

        })

        return params
    }

    handleErrors = (err) => {
        let regError = new RegExp(/<error code=".*">(.*?)<\/error>/)
        let reCode = new RegExp(/<error code="(.*?)">/)

        console.log(chalk.bgRed(`[${err.response.status}] Error: `));
        console.log(chalk.red(`${regError.exec(err.response.data)[1]}`));
        console.log(chalk.red(`Error code: ${reCode.exec(err.response.data)[1]}`));
        console.log(chalk.yellow("\nSee the API errors better specified at this link: \n" +
            "https://lastfm-docs.github.io/api-docs/codes/"))
        process.exit();

        return
    }

    extractKey = (data) => {
        return new RegExp(/<key>(.*)<\/key>/).exec(data)[1]
    }

};

module.exports = { MobileAuth };