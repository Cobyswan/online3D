select * from presets
where preset_shape = 'cube'
and user_id = $1
order by preset_id desc;