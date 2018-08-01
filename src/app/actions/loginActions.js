
export function updateInput(event) {
    return dispatch => {
        dispatch({
            type: "LOGIN_UPDATE_INPUT",
            payload: event.target
        })
    }
}

export function setTrue(param) {
    return dispatch => {
        dispatch({
            type: "LOGIN_SET_TRUE",
            payload: param
        })
    }
}

export function setFalse(param) {
    return dispatch => {
        dispatch({
            type: "LOGIN_SET_FALSE",
            payload: param
        })
    }
}

export function setValue(details) {
    return dispatch => {
        dispatch({
            type: "LOGIN_SET_VALUE",
            payload: details
        })
    }
}

export function resetLoginData() {
    return dispatch => {
        dispatch({
            type: "LOGIN_SET_INITIAL_STATE",
            payload: null
        })
    }
}
