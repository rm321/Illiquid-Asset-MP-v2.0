import { filterList, assetTypeList, assetsList, subTypesList, regdAssetTypeList, mpAssetList } from '../constants.js'

const initialState = {
    filterList: filterList,
    mpAssetList: [],
    assetTypeList: assetTypeList,
    subTypesList: subTypesList,
    assetType: "Real Estate",
    openAssetReqt: false,
    selectedData: {},
    openMrktModal: false,
    openREAssetModal: false,
    openBidConfirm:false,
    //MP registration fields
    mpAsstRegdReqtSecName: '',
    mpRegdAssetType: '--Select Type--',
    mpRegdAssetSubType: '--Select Type--',
    mpCustomAssetType: '',
    mpRegdLatitude: '',
    mpRegdLongitude: '',
    mpRegdAddress: '',
    mpAsstRegdReqtCmpName: '',
    //sellers Data
    sellersList: [],
    //Bid request fields
    purchaseQuantity: 0,
    bidPrice: 0,
    //Real Estate Bid request fields
    REbidPrice: 0
}

const MarketPlaceReducer = (state = initialState, action) => {

    switch (action.type) {

        case 'MP_UPDATE_INPUT':
            state = {
                ...state,
                [action.payload.name]: action.payload.value
            };
            break;
        case 'MP_OPEN_ASSET_REGD_MODAL':
            state = {
                ...state,
                OpenModal: true,
                selectedData: action.payload
            };
            break;
        case 'MP_SET_TRUE':
            state = {
                ...state,
                [action.payload]: true,
            };
            break;
        case 'MP_SET_FALSE':
            state = {
                ...state,
                [action.payload]: false,
            };
            break;
        case 'MP_SET_VALUE':
            state = {
                ...state,
                [action.payload.id]: action.payload.val
            };
            break;

        case 'MP_SET_INITIAL_STATE':
            state = initialState;
            break;

    }
    return state;
}
export default MarketPlaceReducer;
