
const myProfileReducer = (state = { showPassBook: false }, action) => {
    switch (action.type) {
        case 'MY_PROF_SET_TRUE':
            state = {
                ...state,
                [action.payload]: true,
            };
            break;

        case 'MY_PROF_SET_FALSE':
            state = {
                ...state,
                [action.payload]: false,
            };
            break;
    }
    return state;
}
export default myProfileReducer;