const initialState = {
    clientID: '',
    password: '',
    openFgtPwd: false,
    fgtClientID: '',
    MobileNumber: '',
    OTP:'',
    role: undefined,
    //login page
    // currentRole: 'Seller',
    //profile page
    userDetails:{}
}
const LoginReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOGIN_UPDATE_INPUT':
            state = {
                ...state,
                [action.payload.name]: action.payload.value
            };
            break;

        case 'LOGIN_SET_TRUE':
            state = {
                ...state,
                [action.payload]: true,
            };
            break;
        case 'LOGIN_SET_FALSE':
            state = {
                ...state,
                [action.payload]: false,
            };
            break;
                case 'LOGIN_SET_VALUE':
            state = {
                ...state,
                [action.payload.id]: action.payload.val,
            };
            break;
            case 'LOGIN_SET_INITIAL_STATE':
            state = initialState;
            break;
    }
    return state;
}
export default LoginReducer;
