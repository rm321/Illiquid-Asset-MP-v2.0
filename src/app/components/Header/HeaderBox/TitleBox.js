import React from "react";
import './TitleBox.css'

export const TitleBox = (props) => {
    return (
        <div className="col-md-12 no-padding h100" id='headerPane'>
            <div className="col-md-2 logobox">
                <div className="col-md-4">
                     <img src={require("../../../images/logo.png")} alt="LAB logo" />
                </div>
                <span className='col-md-8'>Illiquid Assets</span>
            </div>
            <div className="col-md-10 heading">
                <span>{props.titleName}</span>
            </div>
           
        </div>
    );
}