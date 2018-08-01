
export function URUpdateInputValue(event) {
    return dispatch => {
        dispatch({
            type: "UR_UPDATE_INPUT",
            payload: event.target
        })
    }
}
export function URSelectedAssetData(selectedData) {
    return dispatch => {
        dispatch({
            type: "UR_OPEN_ASSET_REGD_MODAL",
            payload: selectedData
        })
    }
}
export function URSetTrue(param) {
    return dispatch => {
        dispatch({
            type: "UR_SET_TRUE",
            payload: param
        })
    }
}
export function URSetFalse(param) {
    return dispatch => {
        dispatch({
            type: "UR_SET_FALSE",
            payload: param
        })
    }
}

export function URSetValue(details) {
    return dispatch => {
        dispatch({
            type: "UR_SET_VALUE",
            payload: details
        })
    }
}

export function URAlterBoolean(name) {
    return dispatch => {
        dispatch({
            type: "UR_ALTER_BOOLEAN",
            payload: name
        })
    }
}

export function resetURData() {
    return dispatch => {
        dispatch({
            type: "UR_SET_INITIAL_STATE",
            payload: null
        })
    }
}