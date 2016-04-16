create table player_info(player_id serial primary key,nickname text not null,is_ai boolean default false,report_counter integer default 0);

create table game_info(game_id serial primary key,topic text not null,mode text not null,host integer references player_info(player_id),time_limit integer,word_limit integer,password text);

create table move_info(move_id serial primary key,game_id integer references game_info(game_id),player_id integer references player_info(player_id),word text not null);

create table participants_info(game_id integer references game_info(game_id),player_id integer references player_info(player_id),primary key (game_id,player_id));