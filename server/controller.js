module.exports = {
    getCubePresets: (req, res) => {
        const db = req.app.get('db')
        let {user_id} = req.params
        if(user_id !== 0){
            db.get_cube_presets_by_id(user_id).then(presets => {
                res.status(200).json(presets)
            })
        }
        else {
            db.get_cube_presets().then(presets => {
                res.status(200).json(presets)
            })
        }
    },
    getSpherePresets: (req, res) => {
        const db = req.app.get('db')
        let {user_id} = req.params
        if(user_id !== 0){
            db.get_sphere_presets_by_id(user_id).then(presets => {
                res.status(200).json(presets)
            })
        }
        else{
            db.get_sphere_presets(user_id).then(presets => {
                res.status(200).json(presets)
            })
        }
    },
    getConePresets: (req, res) => {
        const db = req.app.get('db')
        let {user_id} = req.params
        if(user_id !== 0){
            db.get_cone_presets_by_id(user_id).then(presets => {
                res.status(200).json(presets)
            })
        }
        else {
            db.get_cone_presets().then(presets => {
                res.status(200).json(presets)
            })
        }
    },
    createPreset: (req, res) => {
        const db = req.app.get('db')

        let { user_id } = req.session.user
        let { preset_json, preset_shape, preset_name } = req.body
        db.create_new_preset([user_id, preset_json, preset_shape, preset_name]).then(preset => {
            res.status(200).json(preset)
        })
    },
    deleteCubePreset: (req, res) => {
        const db = req.app.get('db')
        let {id, user_id} = req.params
        db.delete_cube_preset([id, user_id]).then(presets => {

            res.status(200).json(presets)
        })
    },
    deleteSpherePreset: (req, res) => {
        const db = req.app.get('db')
        let {id, user_id} = req.params
        db.delete_sphere_preset([id, user_id]).then(presets => {
            res.status(200).json(presets)
        })
    },
    deleteConePreset: (req, res) => {
        const db = req.app.get('db')
        let {id, user_id} = req.params
        db.delete_cone_preset([id, user_id]).then(presets => {
            res.status(200).json(presets)
        })
    },
    getPresetJson: (req, res) => {
        const db = req.app.get('db')
        const {preset_name} = req.params
        db.get_preset_json(preset_name).then(preset_json => {
            res.status(200).json(preset_json)
        })
    },
    updatePreset: (req, res) => {
        const db = req.app.get('db')
        let { preset, preset_json } = req.body
        let {preset_id} = req.params
        db.update_preset([preset , preset_json, preset_id]).then(preset => {
            res.status(200).json(preset)
        })
    }
}