// This is where the move database functions are held

var pgp = require("pg-promise")();
var db = pgp(process.env.DATABASE_URL);

module.exports =
{
  addWord: function(data) {
    console.log('add Word Function');
    return db.one('INSERT INTO move_info (game_id, player_id, word) '+
    'VALUES (${game_id}, ${player_id}, ${word}) RETURNING game_id',data.body);
  },
  getLatestWord: function(data) {
    console.log('getWord Function');
    return db.one('SELECT word,player_id FROM move_info WHERE game_id=${game_id} ' +
    'ORDER BY move_id DESC LIMIT 1',data.body)
  },
  getNextPlayer: function(data) {
    console.log('getNextPlayer function');
    return db.any('SELECT player_id FROM participants_info WHERE game_id=${game_id} ' +
    'AND position > (SELECT position FROM participants_info WHERE player_id=${player_id}) ' +
    'ORDER BY position ASC LIMIT 1',data).then(function(data2) {
      if(data2[0].player_id === undefined) {
        return db.one('SELECT player_id FROM participants_info WHERE game_id=${game_id} '+
        'ORDER BY position ASC LIMIT 1',data);
      }
      else {
        return db.one('SELECT player_id FROM participants_info WHERE game_id=${game_id} ' +
        'AND position > (SELECT position FROM participants_info WHERE player_id=${player_id}) ' +
        'ORDER BY position ASC LIMIT 1',data);
      }
    });
  }
};
