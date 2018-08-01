export function setTitle(name) {
    return dispatch =>{
                dispatch({
                    type:"SET_TITLE",
                    payload:name
                })  
    }
}