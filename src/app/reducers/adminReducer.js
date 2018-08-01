import { assetTypeList, subTypesList, RequestsList, filterList } from '../constants.js'

const AdminInitialState = {
    fstName: '',
    lstName: '',
    Adminpwd: '',
    AdmCnfrmPassword: '',
    RequestsList: RequestsList,
    AdmMobNo: '',
    AdmEmail:'',
    assetTypeList: assetTypeList,
    subTypesList: subTypesList,
    AdminExplorerList: [],
    countOfBlocks: 0,
    openBlockExpModal: false,
    openEditUser:false,
    selectedBlock: {},
    openBlockDetails: false,
    //user registration page
    usersList: [],
    //asset registration page
    AstRegdName: '',
    AstRegdType: '--Select Type--',
    AstRegdSubType: '--Select Type--',
    AdmnCustomAssetType: '',
    AdmnRegdLatitude: '',
    AdmnRegdLongitude: '',
    AdmnRegdAddress: '',
    AdmnRegdCmpnyName: '',
    AstRegdClientID: '',
    AstRegdClientAqPrc: '',
    AdmnRegdQty: 0,

    //Security Master page
    filterList: filterList,
    assetsList: [],
    ASMassetType: "Real Estate",
    selectedUser: ''
}

const AdminReducer = (state = AdminInitialState, action) => {
    switch (action.type) {

        case 'ADMN_UPDATE_INPUT':
            state = {
                ...state,
                [action.payload.name]: action.payload.value
            };
            break;
        case 'ADMN_SET_TRUE':
            state = {
                ...state,
                [action.payload]: true
            };
            break;
        case 'ADMN_SET_FALSE':
            state = {
                ...state,
                [action.payload]: false
            };
            break;
        case 'ADMN_SET_VALUE':
            state = {
                ...state,
                [action.payload.id]: action.payload.val
            };
        case 'GET_BLOCK_DATA_FULFILLED':
            state = {
                ...state,
                AdminExplorerList: action.payload.data
            };
            break;
        case 'GET_BLOCK_COUNT_FULFILLED':
            state = {
                ...state,
                countOfBlocks: action.payload.data
            };
            break;

    }
    return state;
}
export default AdminReducer;