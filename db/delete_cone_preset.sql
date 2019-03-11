delete from presets 
where preset_id = $1;
select * from presets
where preset_shape = 'cone'
order by preset_id desc;