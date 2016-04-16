// This is where the participants database functions are held

var pgp = require("pg-promise")();
var db = pgp(process.env.DATABASE_URL);

var nextPlayerRequests = new Map();

module.exports = {
  joinGame: function(data) {
    console.log('joinGame model function entered');
    return db.none('INSERT INTO participants_info(game_id,player_id) ' +
    'VALUES(${game_id},${player_id})',data.body)
    .then(function(data2) {
      return db.any('SELECT player_id FROM participants_info ' +
      'WHERE game_id=${game_id}', data.body);
   });
 },
 getIdsByGame: function(data) {
   console.log('getIdsByName model function entered');
   return db.any('SELECT player_id FROM participants_info ' +
   'WHERE game_id=${game_id}',{'game_id': data}).then(function(ids) {
     console.log('ids in game right now: ',ids);
     for(i in ids) {
       var requestObject = nextPlayerRequests.get(i.player_id);
       if(requestObject != undefined) {
         requestObject.handler(ids);
       }
     }
   })
 }
};
