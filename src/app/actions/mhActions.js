import { UserCon, AssetRegisterCon, AssetTokenCon, REAssetsCon, web3 } from '../constants'

export function mhUpdateInputValue(event, changeAssetType, walletAddress) {
    return dispatch => {
        dispatch({
            type: "MH_UPDATE_INPUT",
            payload: event.target
        })
        if (changeAssetType) {
            var data = []
            if (event.target.value === 'Real Estate') {
                var REAssetData = REAssetsCon.getREAssetIdsByAddress(walletAddress);
                for (var i = 0; i < REAssetData.length; i++) {
                    var assetDetailsData = REAssetsCon.getREAssetsDetailsForHoldings(REAssetData[i]);
                    if ((REAssetsCon.getREAssetOwner(REAssetData[i])) === walletAddress) {
                        data.push({
                            securityID: web3.toAscii(REAssetData[i]),
                            assetSubType: web3.toAscii(assetDetailsData[0]),
                            assetAddress: web3.toAscii(assetDetailsData[1]),
                            lat: web3.toAscii(assetDetailsData[2]),
                            long: web3.toAscii(assetDetailsData[3]),
                            acqPrice: assetDetailsData[4].c[0],
                            ofrPrice: assetDetailsData[5].c[0],
                            visibility: assetDetailsData[6]
                        })
                    }
                }
            }
            else {
                var assetHoldingData = AssetTokenCon.getAssetHoldingsOfUser(walletAddress);
                for (var i = 0; i < assetHoldingData[0].length; i++) {
                    var assetDetailsData = AssetRegisterCon.getAssetDetailsByAssetID(assetHoldingData[0][i], walletAddress);
                    data.push({
                        securityID: web3.toAscii(assetHoldingData[0][i]),
                        assetType: web3.toAscii(assetDetailsData[1]),
                        assetSubType: web3.toAscii(assetDetailsData[2]),
                        acqPrice: assetHoldingData[1][i].c[0],
                        ofrPrice: assetHoldingData[3][i].c[0],
                        assetQty: assetHoldingData[2][i].c[0],
                        visibility: assetDetailsData[5][i]
                    })
                }
            }
            dispatch(mhSetValue({ id: 'myHoldingsList', val: data }));
        }
    }
}

export function mhSetValue(details) {
    return dispatch => {
        dispatch({
            type: "MH_SET_VALUE",
            payload: details
        })
    }
}


export function mhSelectedAssetData(selectedData) {
    return dispatch => {
        dispatch({
            type: "MH_OPEN_ASSET_REGD_MODAL",
            payload: selectedData
        })
    }
}
export function mhSetTrue(param) {
    return dispatch => {
        dispatch({
            type: "MH_SET_TRUE",
            payload: param
        })
    }
}
export function mhSetFalse(param) {
    return dispatch => {
        dispatch({
            type: "MH_SET_FALSE",
            payload: param
        })
    }
}