// This is where the move database functions are held

var pgp = require("pg-promise")();
var db = pgp(process.env.DATABASE_URL);

module.exports =
{
  addWord: function(data,callback) {
    db.one('INSERT INTO move_info (game_id, player_id, word) '+
    'VALUES (${game_id}, ${player_id}, ${word})',data.body)
    .then(function(data) {
      return db.any('SELECT player_id FROM participants_info ' +
      'WHERE game_id=${game_id} AND position < (' +
      'SELECT position FROM participants_info WHERE player_id=${player_id})' +
      'LIMIT 1',data.body)
    });
  }
}
