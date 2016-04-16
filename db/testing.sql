
/* Create a Player */

WITH nickname_exists AS (SELECT nickname,player_id FROM player_info WHERE nickname='ABISHEK')
,nickname_insert AS (INSERT INTO player_info(nickname) SELECT 'ABISHEK' WHERE NOT
EXISTS(SELECT 1 FROM nickname_exists) RETURNING player_id) SELECT player_id
FROM nickname_exists UNION SELECT player_id FROM nickname_insert;

/* Test if the same nickname gives same player id */

WITH nickname_exists AS (SELECT nickname,player_id FROM player_info WHERE nickname='ABISHEK'),
nickname_insert AS (INSERT INTO player_info(nickname) SELECT 'ABISHEK' WHERE NOT EXISTS
(SELECT 1 FROM nickname_exists) RETURNING player_id) SELECT player_id FROM nickname_exists
UNION SELECT player_id FROM nickname_insert;

/* Create another player */

WITH nickname_exists AS (SELECT nickname,player_id FROM player_info WHERE nickname='Carrri')
,nickname_insert AS (INSERT INTO player_info(nickname) SELECT 'Carrri' WHERE NOT
EXISTS(SELECT 1 FROM nickname_exists) RETURNING player_id) SELECT player_id
FROM nickname_exists UNION SELECT player_id FROM nickname_insert;

/* create a game */

INSERT INTO game_info (topic, mode, host, time_limit,
        word_limit, player_limit, turn_limit, password) VALUES ('Sports',
        'normal', 1 , 100, 100, 3,
        10,NULL) RETURNING game_id;
