const titleReducer = (state = { name: '' },  action) => {
    switch (action.type) {
        case 'SET_TITLE':
            state = {
                ...state,
                name: action.payload
            };
            break;
    }
    return state;
}
export default titleReducer;