export function setTrue(param) {
    return dispatch => {
        dispatch({
            type: "MY_PROF_SET_TRUE",
            payload: param
        })
    }
}
export function setFalse(param) {
    return dispatch => {
        dispatch({
            type: "MY_PROF_SET_FALSE",
            payload: param
        })
    }
}