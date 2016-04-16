  # HackUst2016

Route Info :

'/createGame'
  Takes: topic, mode, host, time_limit, word_limit, player_limit, turn_limit, password
  Returns: game_id


'/createPlayer'
  Takes: nickname
  Returns: player_id
  This Has Been Tested

'/addWord'
  Takes: game_id,player_id,word
  Returns: player_id of player whose turn it is now

'/joinGame'
  Takes: game_id,player_id
  Returns: player_id of all players currently waiting for the game
