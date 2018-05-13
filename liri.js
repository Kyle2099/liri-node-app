require("dotenv").config();
var keys = require('./keys.js');
var request = require('request');
var twitter = require('twitter');
var spotify = require('node-spotify-api');
var client = new twitter(keys.twitterKeys);
var fs = require('fs');

//Stored argument's array
var argv = process.argv;
var command = process.argv[2];
var spotify = new spotify(keys.spotify);
var client = new twitter(keys.twitter);
//movie or song
var x = " ";
//attaches multiple word arguments

tool = process.argv[3]

//switch case
switch (command) {
    case "my-tweets":
        showTweets();
        break;

    case "spotify-this-song":
        if (tool) {
            spotifySong(tool);
        } else {
            spotifySong("The Sign");
        }
        break;

    case "movie-this":
        if (tool) {
            omdbData(tool);
        } else {
            omdbData("Mr. Nobody");
        }
        break;

    case "do-what-it-says":
        doThing();
        break;

    default:
        console.log("{Please enter a command: my-tweets, spotify-this-song, movie-this, do-what-it-says}");
        break;
}

function showTweets(tool) {
    //Display last 20 Tweets
    var screenName = { screen_name: 'BrunoSouther' };
    client.get('statuses/user_timeline', screenName, function (error, tweets, response) {
        if (!error) {
            for (var i = 0; i < tweets.length; i++) {
                var date = tweets[i].created_at;
                console.log("@BrunoSouther: " + tweets[i].text + " Created At: " + date.substring(0, 19));
                console.log("-----------------------");

                // fs.writeFile("text.txt", data, (error) => { /* handle error */ });
                //adds text to log.txt file
                fs.appendFile('log.txt', "@BrunoSouther: " + tweets[i].text + " Created At: " + date.substring(0, 19), (error) => { /* handle error */ });
                fs.appendFile('log.txt', "-----------------------", (error) => { /* handle error */ });
            }
        } else {
            console.log('Error occurred');
        }
    });
}

function spotifySong(song) {
    spotify.search({ type: 'track', query: song }, function (error, data) {
        if (!error) {
            for (var i = 0; i < data.tracks.items.length; i++) {
                var songData = data.tracks.items[i];
                //artist
                console.log("Artist: " + songData.artists[0].name);
                //song name
                console.log("Song: " + songData.name);
                //spotify preview link
                console.log("Preview URL: " + songData.preview_url);
                //album name
                console.log("Album: " + songData.album.name);
                console.log("-----------------------");

                //adds text to log.txt
                fs.appendFile('log.txt', songData.artists[0].name, (error) => { /* handle error */ });
                fs.appendFile('log.txt', songData.name, (error) => { /* handle error */ });
                fs.appendFile('log.txt', songData.preview_url, (error) => { /* handle error */ });
                fs.appendFile('log.txt', songData.album.name, (error) => { /* handle error */ });
                fs.appendFile('log.txt', "-----------------------", (error) => { /* handle error */ });
            }
        } else {
            console.log('Error occurred.');
        }
    });
}

function omdbData(tool) {
    var queryUrl = "http://www.omdbapi.com/?t=" + tool + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function (error, response, body) {

        var getRating = function (source) {
            // console.log('You passed in: ' + source);
            for (var i = 0; i < body.Ratings.length; i++) {
                // console.log('This iteration: ' + body.Ratings[i].Source);
                if (body.Ratings[i].Source === source) {
                    // console.log('You\'ve matched! ' + body.Ratings[i].Source + ' = ' + source);
                    return body.Ratings[i];
                }
            }
            return { Source: 'Undefined', Value: -1 }
        };

        if (!error && response.statusCode == 200) {
            var body = JSON.parse(body);
            //console.log(body);

            if (body.Response === 'False') {
                console.log('You entered: ' + tool);
                console.log(body.Error);
                return;
            }

            var rating_tomato = getRating('Rotten Tomatoes');
            //console.log(rating_tomato);

            console.log("Title: " + body.Title);
            console.log("Release Year: " + body.Year);
            console.log("IMdB Rating: " + body.imdbRating);
            console.log("Country: " + body.Country);
            console.log("Language: " + body.Language);
            console.log("Plot: " + body.Plot);
            console.log("Actors: " + body.Actors);
            console.log("Rotten Tomatoes Rating: " + rating_tomato.Value);

            //adds text to log.txt
            fs.appendFile('log.txt', "Title: " + body.Title, (error) => { /* handle error */ });
            fs.appendFile('log.txt', "Release Year: " + body.Year, (error) => { /* handle error */ });
            fs.appendFile('log.txt', "IMdB Rating: " + body.imdbRating, (error) => { /* handle error */ });
            fs.appendFile('log.txt', "Country: " + body.Country, (error) => { /* handle error */ });
            fs.appendFile('log.txt', "Language: " + body.Language, (error) => { /* handle error */ });
            fs.appendFile('log.txt', "Plot: " + body.Plot, (error) => { /* handle error */ });
            fs.appendFile('log.txt', "Actors: " + body.Actors, (error) => { /* handle error */ });
            fs.appendFile('log.txt', "Rotten Tomatoes Rating: " + rating_tomato.Value, (error) => { /* handle error */ });

        } else {
            console.log('Error occurred.');
            console.log(error);
        }
    });

}

function doThing(tool) {
    fs.readFile('random.txt', "utf8", function (error, data) {
        var txt = data.split(',');

        spotifySong(txt[1]);
    });
}

