// This is where the move database functions are held

var pgp = require("pg-promise")();
var db = pgp(process.env.DATABASE_URL);

module.exports =
{
  addWord: function(data) {
    console.log('add Word Function');
    return db.one('INSERT INTO move_info (game_id, player_id, word) '+
    'VALUES (${game_id}, ${player_id}, ${word})',data.body)
    .then(function(data) {
      return db.one('SELECT player_id FROM participants_info ' +
      'WHERE game_id=${game_id} AND position > (' +
      'SELECT position FROM participants_info WHERE player_id=${player_id})' +
      'ASC LIMIT 1',data.body).then(function(data) {
        if(data == null) {
          return db.one('SELECT player_id FROM participants_info ' +
          'WHERE game_id=${game_id} ORDER BY position ASC LIMIT 1',data.body);
        }
        else {
          return db.one('SELECT player_id FROM participants_info ' +
          'WHERE game_id=${game_id} AND position > (' +
          'SELECT position FROM participants_info WHERE player_id=${player_id})' +
          'ASC LIMIT 1',data.body);
        }
      })
    });
  }
};
