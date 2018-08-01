import { AssetRegisterCon, REAssetsCon, web3 } from '../constants'
import axios from 'axios'

export function updateInputValue(event, changeAssetType) {
    return dispatch => {
        dispatch({
            type: "ADMN_UPDATE_INPUT",
            payload: event.target
        });
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

export function setValue(details) {
    return dispatch => {
        dispatch({
            type: "ADMN_SET_VALUE",
            payload: details
        })
    }
}

export function setTrue(param) {
    return dispatch => {
        dispatch({
            type: "ADMN_SET_TRUE",
            payload: param
        })
    }
}
export function setFalse(param) {
    return dispatch => {
        dispatch({
            type: "ADMN_SET_FALSE",
            payload: param
        })
    }
}

export function getBlockData(pageNumber) {
    return dispatch => {
        dispatch({
            type: "GET_BLOCK_DATA",
            payload: new Promise((resolve, reject) => {
                resolve(axios.get('http://cil-blockchain1.uksouth.cloudapp.azure.com:4200/blockchain/' + pageNumber));
            })

        })
    }

}
export function getBlockCount() {
    return dispatch => {
        dispatch({
            type: "GET_BLOCK_COUNT",
            payload: new Promise((resolve, reject) => {
                resolve(axios.get('http://cil-blockchain1.uksouth.cloudapp.azure.com:4200/blockchain/count'));
            })
        })
    }
}