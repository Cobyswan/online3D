insert into presets(user_id, preset_json, preset_shape, preset_name)
values($1, $2, $3, $4);
select * from presets 
order by preset_id desc;
