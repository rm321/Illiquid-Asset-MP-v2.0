
const initialState = {
    openViewReceiveReqts: false,
    BidRequests: [],
    BidData: [],
    openBidApprovalPage: false,
    //History page variables
    searchAstID: '',
    selectedAstDetails: {},
    isWrngSrch: false,
    isIDValid: false,
    assetHistoryList: [],
    TradedData: [],
    searchTradeLen: 0,
    timeFormat: 'Hours',
    noTransactions: false,
    showMaps: true
}

const userReqtReducer = (state = initialState, action) => {
    switch (action.type) {

        case 'UR_UPDATE_INPUT':
            state = {
                ...state,
                [action.payload.name]: action.payload.value
            };
            break;
        case 'UR_OPEN_ASSET_REGD_MODAL':
            state = {
                ...state,
                OpenModal: true,
                selectedData: action.payload
            };
            break;
        case 'UR_SET_TRUE':
            state = {
                ...state,
                [action.payload]: true,
            };
            break;
        case 'UR_SET_FALSE':
            state = {
                ...state,
                [action.payload]: false,
            };
            break;
        case 'UR_SET_VALUE':
            state = {
                ...state,
                [action.payload.id]: action.payload.val
            };
            break;
        case 'UR_ALTER_BOOLEAN':
            state = {
                ...state,
                [action.payload]: !state.showMaps
            };
            break;
        case 'UR_SET_INITIAL_STATE':
            state = initialState;
            break;

    }
    return state;
}
export default userReqtReducer;