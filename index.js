/**
 * @description The index is the entry point of the application.
 * @module index
 */
var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var pg = require("pg");

app.use(bodyParser.json());

var gameModel = require('./models/gameModel.js');
var playerModel = require('./models/playerModel.js');
var participantsModel = require('./models/participantsModel.js');
var moveModel = require('./models/moveModel.js');

app.set("port", (process.env.PORT || DEFAULT_FALLBACK_PORT));
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.get("/", function(req, res) {
  var sess = req.session;
  res.render("pages/index", { "sess": sess });
});

//When a player is created, this route is called, it will take the nickname of
//the player and return the player_id

app.post('/create_player', function(req,res) {
  console.log('create_player route entered');
  playerModel.createPlayer(req).then(function(data){
    res.send(data);
  },function(error) {
    console.log('',error);
  });
});

//When a game is created, this route is called, it will take all the data about
//the game, including : topic,mode,host,time_limit and/or word_limit,
//player_limit,password,turn_limit. It will return the game_id

app.post('/create_game', function (req,res) {
  console.log('create_game route entered');
  gameModel.createGame(req).then(function(data){
    res.send(data);
  },function(error) {
    console.log('',error);
  });
});

//To get all the games, this route is called, doesn't need any information,
//Returns all information about all games that are in waiting state

app.post('/get_all_games', function (req, res) {
  console.log('get_all_games route entered');
  gameModel.getAllGames().then(function(data) {
    res.send(data);
  });
});

//When a player joins a game, this route is called, it will take the game and
//player id, and returns all the players currently waiting in the game

app.post('/join_game', function(req,res) {
  console.log('join_game route entered');
  participantsModel.joinGame(req).then(function(data) {
    console.log("COMPLETED JOOINING GAME");
    console.log("data sent : ", data);
    res.send(data);
  },function(error) {
    console.log('',error);
  });
});
// req.body = player id that wants game status
app.post('/get_game_status', function (req, res) {
  gameModel.getGameStatus(req).then(function(result) {
    res.send(result);
  });
})

//When a game is started, this route is called, it will take the game id and
//will return the first player whose turn it is

app.post('/start_game', function (req, res) {
  console.log('start_game route entered');
  gameModel.startGame(req).then(function(data) {
    res.send(data);
  },function(error) {
    console.log('',error);
  });
})

//This is a poll for the last word, takes in the game id and returns the word
//and whose turn it is

app.post('/get_word', function (req, res) {
  console.log('getting word route entered');
  moveModel.getLatestWord(req).then(function(data) {
    console.log('latest word data :',data);
    data.game_id = req.body.game_id;
    moveModel.getNextPlayer(data).then(function(data2) {
      data2.word = data.word;
      console.log('latest word data 2 : ',data2);
      res.send(data2);
    },function(error) {
      console.log(error);
    })
  });
})
//When a move is made, this route is called, it will take the word,game_id
//and the player_id, returning the player_id of whoever is next and the last word

app.post('/add_word', function (req, res) {
  console.log('add_word route entered');
  moveModel.addWord(req).then(function(data) {
    console.log("DB ADD WORD DONE");
    res.send(data);
  })
})
//When a game is finished, this route is called, it will take the game id and
//return nothing

app.post('/end_game', function (req, res) {
  console.log('end_game route entered');
  gameModel.endGame(req).then(function() {
    res.send('ENDED');
  },function(error) {
    console.log(error);
  });
})
//When a player waiting in a lobby requests to know when a player has arrived,
//this route is called, it will take the player_id and (eventually) return the
//updated list of all players in the game

app.post('/request_next_player', function(req,res) {
  console.log('request_next_player route entered');
  participantsModel.nextPlayerRequests.set(req.body.player_id,{
    handler: function(data) {
      res.send(data);
    }
  });
});

//This will listen for any notifications that come from the database, and depending
//on the notification channel will act accordingly

pg.connect(process.env.DATABASE_URL, function(error, client) {
  if(error) {
    console.log(error);
  } else {
    var query = client.query("listen game_waiting");
    client.on("notification", function(notif) {
      console.log('received notification');
      if (notif.channel === "game_waiting") {
        //payload will be the game_id text
        console.log('the payload is '+notif.payload);
        handleGameWaitingNotif(parseInt(JSON.parse(notif.payload)));
      }
    });
  }
});

//When the channel is notified, it will run the following function to ensure all
//the players from the game who just got a new addition are informed

function handleGameWaitingNotif(payload){
  console.log("handleGameWaitingNotif function called");
  participantsModel.getNicknamesByGame(payload);
}
app.listen(app.get("port"), function() {
  console.log("Node app is running on port", app.get("port"));
});
