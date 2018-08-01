import { filterList } from '../constants'

const initialState = {
    mhAssetType: 'Real Estate',
    myHoldingsList: [],
    tradeLedgerList: [],
    mrktPlcVisibility: false,
    openConfirmationModal: false,
    chngeVisAstID: '',
    openGetOfrPrcModal: false,
    newOfrPrc: '',
    //Modal variables
    openSelectedTrade: false,
    selectedTrade: {},
    //Modal Tx details
    showTxReceipt: false,
    showCurReceipt: false
}
const mhReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'MH_UPDATE_INPUT':
            state = {
                ...state,
                [action.payload.name]: action.payload.value
            };
            break;

        case 'MH_SET_TRUE':
            state = {
                ...state,
                [action.payload]: true,
            };
            break;

        case 'MH_SET_FALSE':
            state = {
                ...state,
                [action.payload]: false,
            };
            break;

        case 'MH_SET_VALUE':
            state = {
                ...state,
                [action.payload.id]: action.payload.val,
            };
            break;

        case 'MH_SET_INITIAL_STATE':
            state = initialState;
            break;
    }
    return state;
}
export default mhReducer;
