"use strict"
const moment = require("moment");
const UserTicket = require("../models/ticket.model");
const ContractModel = require("../models/contract.model");

module.exports.buyTicket = async (data) => {
    let {buyer, ticketId, amount, contractAddress} = data;
    

    try {
        const currentTime = moment().format("YYYY-MM-DD HH:mm:ss");

    const ticketData = {
        userAddress: buyer,
        ticketId: ticketId,
        contractAddress: contractAddress,
        ticketBaughtFrom: "token",
        createdAt: currentTime,
        updatedAt: currentTime,
    }
    const insertTicket = await UserTicket.create(ticketData);
    console.log(insertTicket);
    if (insertTicket.dataValues) {
        return {err: null, data: insertTicket.dataValues.id};
    }
    return {err: msgHelper.msg('MSG002'), data: null};
    } catch (error) {
        return {err: error, data: null};
    }
    

}


module.exports.updateContractData = async (data) => {
    let {price, soldTickets, maxTickets, ticketName, ticketSymbol, contractOwner, contractAddress} = data;
    try {
        let info = {}
        info.where = {contractAddress: contractAddress};
        let getContractData = await ContractModel.findOne({where: {contractAddress: contractAddress}});

        
        if (!helper.isEmpty(getContractData)) {
            /* Update */
            const currentTime = moment().format("YYYY-MM-DD HH:mm:ss");
            const contractData = {
                price: price,
                soldTickets: soldTickets,
                maxTickets: maxTickets,
                ticketName: ticketName,
                ticketSymbol: ticketSymbol,
                updatedAt: currentTime,
            }
            const updateContract = await ContractModel.update(contractData, info);
            if (updateContract) {
                return {err: null, data: getContractData.dataValues.id};
            } else {
                return {err: msgHelper.msg('MSG002'), data: null};
            }
        } else {
            /* Insert */
            const currentTime = moment().format("YYYY-MM-DD HH:mm:ss");
            const contractData = {
                contractAddress: contractAddress,
                contractOwner: contractOwner,
                price: price,
                soldTickets: soldTickets,
                maxTickets: maxTickets,
                ticketName: ticketName,
                ticketSymbol: ticketSymbol,
                createdAt: currentTime,
                updatedAt: currentTime,
            }

            const insertContract = await ContractModel.create(contractData);
            if (insertContract.dataValues) {
                return {err: null, data: insertContract.dataValues.id};
            } else {
                return {err: msgHelper.msg('MSG002'), data: null};
            }
        }
    } catch (error) {
        return {err: error, data: null};
    }
}