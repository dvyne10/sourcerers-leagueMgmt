import mongoose from "mongoose";
import SysParmModel from "../models/systemParameter.model.js";

let ObjectId = mongoose.Types.ObjectId;

export const getSysParmById = async function(recordId) {
    if (!mongoose.isValidObjectId(recordId.trim())) {
        return ""
    } else {
        let data = await SysParmModel.findOne({ _id: new ObjectId(recordId)}).exec();
        if (data !== null) {
            return data
        } else {
            return ""
        }
    }
}

export const getSysParmByParmId = async function(parmId) {
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

export const getSportName = async function(recordId) {
    if (!mongoose.isValidObjectId(recordId.trim())) {
        return ""
    }
    let sportsParm = await getSysParmById(recordId)
    if (sportsParm !== "") {
        return sportsParm.sport.sportsName
    } else {
        return ""
    }
}

export const getSportsList = async function() {
    let response = {requestStatus: "", errMsg: "", data: []}
    let sportsParms = await getSysParmList("sport")
    if (sportsParms.requestStatus === 'ACTC') {
        for (let i =0; i < sportsParms.data.length; i++) {
            response.data.push({sportsId : sportsParms.data[i]._id, 
            sportsTypeId : sportsParms.data[i].sport.sportsTypeId,
            sportsName : sportsParms.data[i].sport.sportsName})
        }
        response.requestStatus = 'ACTC'
    } else {
        response.requestStatus = 'RJCT'
        response.errMsg = "Parameter is not found."
    }
    return response
}

export const getNotifParmByNotifId = async function(notifId) {
    let response = {requestStatus: "", errMsg: "", data: {}}
    if (notifId === null || notifId === "") {
        response.requestStatus = 'RJCT'
        response.errMsg = "Notification Id is required."
        return response
    } else {
        response.data = await SysParmModel.findOne({ parameterId: "notification_type", "notification_type.notifId" : notifId}).exec();
        if (response.data !== null) {
            response.requestStatus = 'ACTC'
        } else {
            response.requestStatus = 'RJCT'
            response.errMsg = "Parameter is not found."
        }
        return response
    }
}