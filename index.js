/**
 * @description The index is the entry point of the application.
 * @module index
 */
var express = require("express");
var bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.urlencoded({ extended: true }));

var gameModel = require('./models/gameModel.js');
var playerModel = require('./models/playerModel.js');
app.set("port", (process.env.PORT || DEFAULT_FALLBACK_PORT));
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.get("/", function(req, res) {
  var sess = req.session;
  res.render("pages/index", { "sess": sess });
});

//When a game is created, this route is called, it will take all the data about
//the game, including : topic,mode,host,time_limit and/or word_limit,
//player_limit,password,turn_limit. It will return the game_id

app.post('/create_game', function (req,res) {
  gameModel.createGame(req).then(function(data){
    res.send(data);
  });
});

//When a player is created, this route is called, it will take the nickname of
//the player and return the player_id

app.post('/create_player', function(req,res) {
  playerModel.createPlayer(req).then(function(data){
    res.send(data);
  });
});


app.listen(app.get("port"), function() {
  console.log("Node app is running on port", app.get("port"));
});
