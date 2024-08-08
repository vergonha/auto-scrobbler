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
$ bun install
```

After that, rename the ".env.example" file to ".env".

**You can get your API and SECRET [here](https://www.last.fm/api/account/create)**

```
API=YOUR API KEY
SECRET=YOUR SECRET KEY
USER_NAME=YOUR LASTFM USER_NAME
PASSWD=YOUR LASTFM PASSWORD
```

<img align="right" alt= "example" src="https://imgur.com/2bAJZ8H.png" />

⚠️ Your username and password are only saved on your computer, it is not sent anywhere other than the LastFM servers. ⚠️

After that, type in your bash:

```
$ bun start
```

## Multi Scrobbler Function ⛏

Now you can scrobble more than one song at the same time.

```json
// config.ts

{
  "tracks": [
    {
      "name": "There is a Light That Never Goes Out",
      "artist": "The Smiths"
    },

    {
      "name": "This Charming Man",
      "artist": "The Smiths"
    }
  ],
  "timeout": 1,
  "debug": false
}
```

Add your songs in the `config.ts` file. You can add as many songs as you like.

### End.

<img align="center" alt="footer" src="https://e0.pxfuel.com/wallpapers/605/109/desktop-wallpaper-header-twitter-header-aesthetic-twitter-header-twitter-layouts.jpg">
