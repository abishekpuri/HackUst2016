// This is where the game database functions are held

var pgp = require("pg-promise")();
var db = pgp(process.env.DATABASE_URL);

module.exports = {
  createGame : function(data,callback) {
    return db.one('INSERT INTO game_info (topic, mode, host, time_limit,' +
            'word_limit, player_limit, turn_limit, password) VALUES (${topic}, ' +
            '${mode}, ${host}, ${time_limit}, ${word_limit}, ${player_limit}, '+
            '${turn_limit}, ${password}) RETURNING game_id', data.body);
  }
};
