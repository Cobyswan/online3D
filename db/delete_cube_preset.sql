delete from presets 
where preset_id = $1;
select * from presets
where preset_shape = 'cube'
order by preset_id desc;