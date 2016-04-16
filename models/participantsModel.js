// This is where the participants database functions are held

var pgp = require("pg-promise")();
var db = pgp(process.env.DATABASE_URL);

var nextPlayerRequests = new Map();

module.exports = {
  joinGame: function(data) {
    console.log('joinGame model function entered');
    return db.none('INSERT INTO participants_info(game_id,player_id) ' +
    'VALUES(${game_id},${player_id}) WHERE EXISTS(SELECT 1 FROM game_info ' +
    'WHERE game_id=${game_id} AND current_players < player_limit)',data.body)
    .then(function(data2){
     return db.any('UPDATE game_info SET current_players = ' +
     'current_players + 1 WHERE game_id=${game_id} RETURNING ' +
     '(SELECT player_id FROM participants_info ' +
     'WHERE game_id=${game_id} AND current_players < player_limit)',data.body)
   });
 },
 nextPlayerRequests: nextPlayerRequests,
 getNicknamesByGame: function(data) {
   console.log('getNicknamesByName model function entered');
   return db.any('SELECT nickname,player_id FROM participants_info ' +
   'NATURAL JOIN player_info WHERE participants_info.game_id=${game_id}',
   {'game_id': data}).then(function(ids) {
     var nicknames = [];
     for(var i in ids) {
       nicknames.push(ids[i].nickname);
     }
     console.log('Nicknames : ',nicknames);
     console.log('ids in game right now: ',ids);
     for(var j in ids) {
       var requestObject = nextPlayerRequests.get(ids[j].player_id);
       if(requestObject !== undefined) {
         console.log('request Object:',requestObject);
         requestObject.handler(nicknames);
       }
     }
   },function(error) {
     console.log(error);
   });
 }
};
