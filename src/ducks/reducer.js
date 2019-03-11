const INITIAL_STATE = {
    user: null,
    preset: JSON.stringify({
        preset: '',
        closed: false,
        remembered: {
          Default: {
            0: {
              
            }
          }
        },
        folders: {}
    }),
    isPreset: false,
    presetId: "Not id"
}

function reducer(state=INITIAL_STATE, action){
    switch(action.type) {
        case 'GET_USER':
        return Object.assign({}, state, {user: action.payload})

        case 'GET_PRESET':
        return Object.assign({}, state, {preset: action.payload})
       
        case 'IS_PRESET':
        return Object.assign({}, state, {isPreset: action.payload})
        
        case 'GET_PRESET_ID':
        return Object.assign({}, state, {presetId: action.payload})

        default:
        return state
    }
}

export function getUser(user){
    return {
        type: 'GET_USER',
        payload: user
    }
}

export function getPreset(preset){
    return {
        type: 'GET_PRESET',
        payload: preset
    }
}

export function getIsPreset(answer){
    return {
        type: 'IS_PRESET',
        payload: answer
    }
}

export function getPresetId(presetId){
    return {
        type: 'GET_PRESET_ID',
        payload: presetId
    }
}

export default reducer












