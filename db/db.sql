drop table if exists player_info cascade;
drop table if exists game_info cascade;
drop table if exists move_info cascade;
drop table if exists participants_info cascade;
drop type if exists status cascade;
drop function player_joined_trigger();

create type status as enum (
  'waiting',
  'started',
  'ended'
);

create table player_info (
  player_id serial primary key,
  nickname text not null,
  is_ai boolean default false,
  report_counter integer default 0
);

create table game_info (
  game_id serial primary key,
  topic text not null,
  mode text not null,
  host integer references player_info(player_id),
  time_limit integer,
  word_limit integer,
  player_limit integer not null check (player_limit > 0),
  current_players integer,
  turn_limit integer,
  password text,
  current_status status,
  constraint termination_condition
    check (time_limit is not null or word_limit is not null)
);

create table move_info (
  move_id serial primary key,
  game_id integer references game_info(game_id),
  player_id integer references player_info(player_id),
  word text not null
);

create table participants_info (
  position serial primary key,
  game_id integer references game_info(game_id),
  player_id integer references player_info(player_id),
  unique(game_id,player_id)
);

create function player_joined_trigger() returns trigger as $$
  begin
    perform pg_notify('game_waiting',new.game_id::text);
    return new;
  end;
$$ language plpgsql;

create trigger player_joined_trigger
  after insert on participants_info
    for each row execute procedure player_joined_trigger();
