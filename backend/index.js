require('dotenv').config();

const { Scrobble } = require('./scrobble')

function main(){
    setTimeout(() => {
        let date = new Date(new Date(2023, 2, 1).getTime() + Math.random() * (new Date().getTime() - new Date(2023, 2, 1).getTime()));
        const Wrapper = new Scrobble();
        try {
            Wrapper.scrobble(process.env.TRACK, process.env.ARTIST, (Date.parse(date)/1000), true)
        } catch (error) {
            console.log(`[Fail] ${artist[0].toUpperCase() + artist.slice(1)} - ${track[0].toUpperCase() + track.slice(1)} | Not Scrobbled`)
        }

        if(true){
            main();
        };
    }, process.env.TIMEOUT * 1000)
};


if(require.main === module) { 
    main();
};