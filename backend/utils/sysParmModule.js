import mongoose from "mongoose";
import SysParmModel from "../models/systemParameter.model.js";

export const getSysParm = async function(parmId) {
    let response = {requestStatus: "", errMsg: "", data: {}}
    if (parmId === null || parmId === "") {
        response.requestStatus = 'RJCT'
        response.errMsg = "Type of parameter is required."
        return response
    } else {
        response.data = await SysParmModel.findOne({ parameterId: parmId}).exec();
        if (response.data !== null) {
            response.requestStatus = 'ACTC'
        } else {
            response.requestStatus = 'RJCT'
            response.errMsg = "Parameter is not found."
        }
        return response
    }
}

export const getSysParmList = async function(parmId) {
    let response = {requestStatus: "", errMsg: "", data: []}
    if (parmId === null || parmId === "") {
        response.requestStatus = 'RJCT'
        response.errMsg = "Type of parameter is required."
        return response
    } else {
        response.data = await SysParmModel.find({ parameterId: parmId}).exec();
        if (response.data.length !== 0) {
            response.requestStatus = 'ACTC'
        } else {
            response.requestStatus = 'RJCT'
            response.errMsg = "Parameter is not found."
        }
        return response
    }
}