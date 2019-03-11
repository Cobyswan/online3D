update presets
set preset_name = $1, preset_json = $2
where preset_id = $3;