delete from presets 
where preset_id = $1;
select * from presets
where preset_shape = 'cube'
and user_id = $2
order by preset_id desc;