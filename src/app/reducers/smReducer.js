import { filterList, assetTypeList, assetsList, subTypesList, regdAssetTypeList } from '../constants.js'

const initialState = {
    filterList: filterList,
    assetTypeList: assetTypeList,
    subTypesList: subTypesList,
    assetType: 'Equity',
    assetsList: [],
    openAssetReqt: false,
    selectedData: {},
    //Registration Request page initial values
    regdAssetType: '--Select Type--',
    regdAssetSubType: '--Select Type--',
    customAssetType: '',
    asstRegdReqtSecName: '',
    asstRegdReqtCmpName: '',
    regdAddress: ''
}


const SecurityMasterReducer = (state = initialState, action) => {
    switch (action.type) {

        case 'SM_UPDATE_INPUT':
            state = {
                ...state,
                [action.payload.name]: action.payload.value
            };
            break;
        case 'SM_OPEN_ASSET_REGD_MODAL':
            state = {
                ...state,
                OpenModal: true,
                selectedData: action.payload
            };
            break;
        case 'SM_SET_TRUE':
            state = {
                ...state,
                [action.payload]: true,
            };
            break;
        case 'SM_SET_FALSE':
            state = {
                ...state,
                [action.payload]: false,
            };
            break;
        case 'SM_SET_VALUE':
            state = {
                ...state,
                [action.payload.id]: action.payload.val
            };
            break;
        case 'SM_SET_INITIAL_STATE':
            state = initialState;
            break;
    }
    return state;
}
export default SecurityMasterReducer;