import { UserCon, AssetRegisterCon, AssetTokenCon, REAssetsCon, web3 } from '../constants'

export function updateInputValue(event, changeAssetType) {
    return dispatch => {
        dispatch({
            type: "MP_UPDATE_INPUT",
            payload: event.target
        })
        if (changeAssetType) {
            var data = [], assetData = [];
            if (event.target.value !== "Real Estate") {
                (assetData = AssetRegisterCon.getAssetDetailsByType(event.target.value));
                for (var i = 0; i < assetData[0].length; i++) {
                    var qnty = AssetTokenCon.checkAssetQuantity(assetData[0][i]);
                    if (qnty.c[0] > 0) {
                        var ofrPrc = AssetTokenCon.getHighAndLowOfferPrice(assetData[0][i]);
                        data.push({
                            securityID: web3.toAscii(assetData[0][i]),
                            securityName: web3.toAscii(assetData[1][i]),
                            securityType: web3.toAscii(assetData[2][i]),
                            companyName: web3.toAscii(assetData[3][i]),
                            description: web3.toAscii(assetData[4][i]),
                            min: ofrPrc[1].c[0],
                            max: ofrPrc[0].c[0]
                        });
                    }
                }
            }
            else {
                assetData = REAssetsCon.getAllApproavedREAssetDetails();
                for (var i = 0; i < assetData[0].length; i++) {
                    if (assetData[1][i] !== "0x0000000000000000000000000000000000000000000000000000000000000000") {
                        var id = web3.toAscii(assetData[0][i]);
                        var pr = REAssetsCon.getREAssetPrices(id);
                        var owner = REAssetsCon.getREAssetOwner(assetData[0][i]);
                        console.log(owner, "  df ", UserCon.getUserIDByAddress(owner));
                        if (REAssetsCon.getREAssetMPVisibility(assetData[0][i])) {
                            data.push({
                                sellerID: web3.toAscii(UserCon.getUserIDByAddress(owner)),
                                securityID: web3.toAscii(assetData[0][i]),
                                address: web3.toAscii(assetData[1][i]),
                                securityType: web3.toAscii(assetData[2][i]),
                                securityName: web3.toAscii(assetData[3][i]),
                                latitude: web3.toAscii(assetData[4][i]),
                                longitude: web3.toAscii(assetData[5][i]),
                                description: web3.toAscii(REAssetsCon.getREAssetDescription(assetData[0][i])),
                                acqPrice: pr[0].c[0],
                                ofrPrice: pr[1].c[0]
                            });
                        }
                    }
                }
            }
            dispatch(setValue({ id: 'mpAssetList', val: data }));
        }
    }
}

export function setValue(details) {
    return dispatch => {
        dispatch({
            type: "MP_SET_VALUE",
            payload: details
        })
    }
}


export function selectedAssetData(selectedData) {
    return dispatch => {
        dispatch({
            type: "MP_OPEN_ASSET_REGD_MODAL",
            payload: selectedData
        })
    }
}
export function setTrue(param) {
    return dispatch => {
        dispatch({
            type: "MP_SET_TRUE",
            payload: param
        })
    }
}
export function setFalse(param) {
    return dispatch => {
        dispatch({
            type: "MP_SET_FALSE",
            payload: param
        })
    }
}

export function resetMPData() {
    return dispatch => {
        dispatch({
            type: "MP_SET_INITIAL_STATE",
            payload: null
        })
    }
}