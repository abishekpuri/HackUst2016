// This is where the game database functions are held

var pgp = require("pg-promise")();
var db = pgp(process.env.DATABASE_URL);

module.exports = {
  createGame: function(data) {
    console.log('create game model function');
    return db.one('INSERT INTO game_info (topic, mode, host, time_limit,' +
            'word_limit, player_limit, turn_limit, password,current_status,current_players) ' +
            ' VALUES (${topic}, ${mode}, ${host}, ${time_limit}, ' +
            '${word_limit}, ${player_limit}, ${turn_limit}, ' +
            '${password},\'waiting\',1) RETURNING game_id', data.body)
            .then(function(data2){
              return db.one('INSERT INTO participants_info(' +
              'game_id, player_id) VALUES(${game_id},${player_id}) ' +
              'RETURNING game_id',
              {'game_id':data2.game_id,'player_id':data.body.host});
            });
  },
  getAllGames: function() {
    console.log('getAllGames model function');
    return db.any('SELECT * FROM game_info WHERE current_status=\'waiting\'');
  },
  getGameStatus: function(data) {
    return db.one('SELECT current_status FROM game_info ' +
    'WHERE game_id=${game_id}',data.body);
  }
  startGame: function(data) {
    console.log('startGame model function');
    return db.none('UPDATE game_info SET current_status=\'started\' ' +
    'WHERE game_id=${game_id}',data.body).then(function(data) {
      return db.one('SELECT player_id FROM participants_info ' +
      'WHERE game_id=${game_id} ORDER BY position ASC LIMIT 1',data.body);
    });
  },
  endGame: function(data) {
    console.log('endGame model function');
    return db.none('UPDATE game_info SET current_status=\'ended\' ' +
    'WHERE game_id=${game_id}',data.body);
  }
};
