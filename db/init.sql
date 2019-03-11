create table users(
    user_id serial primary key,
    auth0_id varchar not null,
    email varchar not null,
    profile_name text not null,
    picture text not null
);

create table presets (
    preset_id serial primary key,
    user_id integer references users(user_id),
    preset_json text not null,
    preset_shape text not null,
    preset_name text not null
)