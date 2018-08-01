import { AssetRegisterCon, REAssetsCon, web3 } from '../constants'

export function updateInputValue(event, changeAssetType) {
    return dispatch => {
        dispatch({
            type: "SM_UPDATE_INPUT",
            payload: event.target
        })
        if (changeAssetType) {
            var data = [], assetData = [];
            if (event.target.value !== "Real Estate") {
                (assetData = AssetRegisterCon.getAssetDetailsByType(event.target.value));
                for (var i = 0; i < assetData[0].length; i++) {
                    data.push({
                        id: web3.toAscii(assetData[0][i]),
                        secName: web3.toAscii(assetData[1][i]),
                        subType: web3.toAscii(assetData[2][i]),
                        cmpnyName: web3.toAscii(assetData[3][i]),
                        desc: web3.toAscii(assetData[4][i])
                    });
                }
            }
            else {
                assetData = REAssetsCon.getAllREAssetDetails();
                for (var i = 0; i < assetData[0].length; i++) {
                    console.log(REAssetsCon.getREAssetSMVisibility(assetData[0][i]));
                    if (assetData[1][i] !== "0x0000000000000000000000000000000000000000000000000000000000000000") {
                       if (REAssetsCon.getREAssetSMVisibility(assetData[0][i])) {
                            data.push({
                                id: web3.toAscii(assetData[0][i]),
                                addr: web3.toAscii(assetData[1][i]),
                                subType: web3.toAscii(assetData[2][i]),
                                secName: web3.toAscii(assetData[4][i]),
                                lat: web3.toAscii(assetData[5][i]),
                                long: web3.toAscii(assetData[6][i]),
                                desc: web3.toAscii(REAssetsCon.getREAssetDescription(assetData[0][i]))
                            });
                       }
                    }
                }
            }
            dispatch(setValue({ id: 'assetsList', val: data }));
        }

    }
}
export function selectedAssetData(selectedData) {
    return dispatch => {
        dispatch({
            type: "SM_OPEN_ASSET_REGD_MODAL",
            payload: selectedData
        })
    }
}
export function setTrue(param) {
    return dispatch => {
        dispatch({
            type: "SM_SET_TRUE",
            payload: param
        })
    }
}
export function setFalse(param) {
    return dispatch => {
        dispatch({
            type: "SM_SET_FALSE",
            payload: param
        })
    }
}

export function setValue(details) {
    return dispatch => {
        dispatch({
            type: "SM_SET_VALUE",
            payload: details
        })
    }
}
export function resetSMData() {
    return dispatch => {
        dispatch({
            type: "SM_SET_INITIAL_STATE",
            payload: null
        })
    }
}