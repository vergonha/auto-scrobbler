const chalk = require('chalk')
require('dotenv').config();

const { Scrobble } = require('./backend/scrobble')

async function main(){
    if(!(
        process.env.API &&
        process.env.SECRET &&
        process.env.USER_NAME &&
        process.env.PASSWD &&
        process.env.TRACKS &&
        process.env.TIMEOUT
    )){
        console.log(chalk.bgRed("[Fail]"), chalk.red("Please, check your enviroment variables in .env file."))
        process.exit();
    };
    
    let tracksObject = JSON.parse(process.env.TRACKS)
    const sleep = m => new Promise(r => setTimeout(r, m));
    for(let track of tracksObject){
            await sleep(process.env.TIMEOUT * 1000);
            // Generates random timestamp
            let atualMonth = new Date().getMonth()
            let atualDay = new Date().getDay()
            let date = new Date(new Date(2023, atualMonth, atualDay).getTime() + Math.random() * (new Date().getTime() - new Date(2023, atualMonth, atualDay).getTime()));
            //
            const Wrapper = new Scrobble();
            try { Wrapper.scrobble(track['name'], track['artist'], (Date.parse(date)/1000), true)} 
            catch { console.log(`[Fail] ${artist[0].toUpperCase() + artist.slice(1)} - ${track[0].toUpperCase() + track.slice(1)} | Not Scrobbled`)}
    }; if(true){ main() };
};


if(require.main === module) { 
    main();
};
