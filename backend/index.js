require('dotenv').config();

const { Scrobble } = require('./scrobble')

function main(){
    if(!(
        process.env.API &&
        process.env.SECRET &&
        process.env.USERNAME &&
        process.env.PASSWD &&
        process.env.TRACK &&
        process.env.ARTIST &&
        process.env.TIMEOUT
    )){
        console.log("[Fail] Please, check your enviroment variables in .env file.")
        process.exit();
    };
    
    setTimeout(() => {
        let date = new Date(new Date(2023, 2, 1).getTime() + Math.random() * (new Date().getTime() - new Date(2023, 2, 1).getTime()));
        const Wrapper = new Scrobble();

        try { Wrapper.scrobble(process.env.TRACK, process.env.ARTIST, (Date.parse(date)/1000), true)
        } catch (error) { console.log(`[Fail] ${artist[0].toUpperCase() + artist.slice(1)} - ${track[0].toUpperCase() + track.slice(1)} | Not Scrobbled`)}

        if(true){ main() };
    }, process.env.TIMEOUT * 1000) // Seconds to Milliseconds
};


if(require.main === module) { 
    main();
};