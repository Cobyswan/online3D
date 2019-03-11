delete from presets 
where preset_id = $1;
select * from presets
where preset_shape = 'sphere'
order by preset_id desc;