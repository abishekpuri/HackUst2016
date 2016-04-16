// This is where the player database functions are held

var pgp = require("pg-promise")();
var db = pgp(process.env.DATABASE_URL);

module.exports = {
  createPlayer: function(data) {
    console.log('create Player model function');
    return db.one('WITH nickname_exists AS (' +
              'SELECT nickname,player_id FROM player_info ' +
              'WHERE nickname=${nickname}),' +
              'nickname_insert AS (INSERT INTO player_info(nickname) ' +
              'SELECT ${nickname} ' +
              'WHERE NOT EXISTS(SELECT 1 FROM nickname_exists) ' +
              'RETURNING player_id) ' +
              'SELECT player_id FROM nickname_exists UNION ' +
              'SELECT player_id FROM nickname_insert',data.body);
  }
};
