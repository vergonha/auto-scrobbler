
# LastFM Auto Scrobbler

Automatic scrobbler for you scrobble your favorite track as many times as you want. 

![LastFM Scrobbles](https://imgur.com/X7MzwTD.png)
### **⚠️ Attention ⚠️**
Remember that the daily limit of Scrobbles on LastFM is 2800. More than that will cause the "Rate Limit" error, so you will be 24 hours without being able to interact with the scrobble API.

## How to Use:

Follow the commands in your terminal:

```bash
$ git clone https://github.com/vergonha/auto-scrobbler.git
$ cd auto-scrobbler
$ npm install
```

After that, rename the ".env.example" file to ".env".

**You can get your API and SECRET [here](https://www.last.fm/api/account/create)**

```
API=YOUR API KEY
SECRET=YOUR SECRET KEY
USER_NAME=YOUR USER_NAME
PASSWD=YOUR PASSWORD
TRACKS='[
    {
        "name": "TRACK 1 NAME",
        "artist": "TRACK 1 ARTIST"

    },
    {
        "name": "TRACK 2 NAME",
        "artist": "TRACK 2 ARTIST"
    }
]'
TIMEOUT=1
```

The timeout is the time between each request, it is recommended to keep 1 (second) as default.

<img align="right" alt= "example" src="https://imgur.com/2bAJZ8H.png" />

⚠️ Your username and password are only saved on your computer, it is not sent anywhere other than the LastFM servers. ⚠️

After that, type in your bash: 
```
$ node index.js
```

## Multi Scrobbler Function ⛏


Now you can scrobble more than one song at the same time.

```
TRACKS='[
    {
        "name": "Glimpse of Us",
        "artist": "Joji"
    }
]'
```

Add your songs in this format in the .env file, remember the commas and quotes. You can add as many songs as you like.

### End.

<img align="center" alt="footer" src="https://e0.pxfuel.com/wallpapers/605/109/desktop-wallpaper-header-twitter-header-aesthetic-twitter-header-twitter-layouts.jpg">
