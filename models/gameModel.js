// This is where the game database functions are held

var pgp = require("pg-promise")();
var db = pgp(process.env.DATABASE_URL);

module.exports = {
  createGame : function(data) {
    console.log('create game function');
    return db.one('INSERT INTO game_info (topic, mode, host, time_limit,' +
            'word_limit, player_limit, turn_limit, password,current_status) ' +
            ' VALUES (${topic}, ${mode}, ${host}, ${time_limit}, ' +
            '${word_limit}, ${player_limit}, ${turn_limit}, ' +
            '${password},\'waiting\') RETURNING game_id', data.body)
            .then(function(data2){
              return db.one('INSERT INTO participants_info(' +
              'game_id, player_id) VALUES(${game_id},${player_id}) ' +
              'RETURNING game_id',
              {'game_id':data2.game_id,'player_id':data.body.player_id});
            });
  }
};
