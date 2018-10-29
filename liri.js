require("dotenv").config();
let keys = require('./keys');
let Spotify = require("node-spotify-api");
let request = require("request");
let fs = require('fs');
let moment = require('moment');
//spotify credentials
let spotify = new Spotify(keys.spotify);
let search = "";
let omdbURL = "http://www.omdbapi.com/?apikey=" + keys.omdb.id + "&t=";
// set search to process.argv
for (let i = 3; i < process.argv.length; i++) {

  search += process.argv[i] + " ";

}

liri(process.argv[2], search);

function liri(command, search) {

  if (command === 'spotify-this-song') {

    //check if search is empty 
    if (process.argv.length === 3) {

      search = "The Sign";
    }

    spotify.search({
      type: 'track',
      query: search.trim()
    }, function (err, data) {

      if (err) {
        return console.log('spotify: ' + err);
      }

      for (let i = 0; i < data.tracks.items.length; i++) {

        //look for an exact match 
        if (search.trim().toLowerCase() === data.tracks.items[i].name.toLowerCase()) {
          console.log("Artist: " + data.tracks.items[i].artists[0].name)
          console.log("Song Name: " + data.tracks.items[i].name)
          console.log("Preview Link: " + data.tracks.items[i].external_urls.spotify)
          console.log("Album: " + data.tracks.items[i].album.name)
          return;
        }

      }

      //if no exact match return the first item
      console.log("Artist: " + data.tracks.items[0].artists[0].name)
      console.log("Song Name: " + data.tracks.items[0].name)
      console.log("Preview Link: " + data.tracks.items[0].external_urls.spotify)
      console.log("Album: " + data.tracks.items[0].album.name)

    })
  } else if (command === 'movie-this') {

    if (process.argv.length === 3) {

      search = "Mr. Nobody";
    }
    request(omdbURL + search.trim(), function (err, response, body) {
      console.log('');
      console.log("Title: " + JSON.parse(body).Title);
      console.log('');
      console.log("Year: " + JSON.parse(body).Year)
      console.log('');
      console.log("IMDB: " + JSON.parse(body).imdbRating)
      console.log('');
      console.log("Country Produced: " + JSON.parse(body).Country)
      console.log('');
      console.log("Language: " + JSON.parse(body).Language)
      console.log('');
      console.log("Plot: " + JSON.parse(body).Plot)
      console.log('');
      console.log("Actors: " + JSON.parse(body).Actors)
    })


  } else if (command === 'concert-this') {
    //concert this stuffs 

    if (process.argv.length === 3) {

      search = "drake";
    }
    let bandsURL = 'https://rest.bandsintown.com/artists/' + search.trim() + '/events?app_id=codingbootcamp';
    request(bandsURL, function (err, response, body) {
      if (err) {
        console.log(err)
      }
      let x = JSON.parse(body);
      x.forEach(element => {
        console.log("Event Venue: " + element.venue.name)
        console.log("Event Location: " + element.venue.city + "," + element.venue.region)
        console.log("Event Date: " + moment(element.datetime).format('MM/DD/YYYY'))
        console.log("------------------------------------")
      });
    });
  } else {

    let text;
    fs.readFile('random.txt', 'utf8', function (err, data) {
      text = data.split("\r\n");
      let textArray = text[0].split(',')

      liri(textArray[0], textArray[1])

    })

  }


}