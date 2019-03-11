select * from presets
where preset_shape = 'cone'
and user_id = $1
order by preset_id desc;