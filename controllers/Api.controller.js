"use strict"

const moment = require("moment");
const ContractModel = require("../models/contract.model");
const TicketModel = require("../models/ticket.model");

module.exports.getContractData = (req, res) => {
    
    let formData = req.body;
    let schema = {
        address: 'required',
    }

    const validateData = new node_validator.Validator(formData, schema);
    validateData.check().then(async (matched) => {
        if (!matched) return res.status(422).json({ status: false, message: msgHelper.msg('MSG002'), error: validateData.errors });

        let contractAddress = formData.address;

        let info = {}
        info.columns = ['contractAddress', 'contractOwner', 'price', 'soldTickets', 'maxTickets', 'ticketName', 'ticketSymbol'];
        
        info.where = {contractAddress: contractAddress};
        let getContractData = await ContractModel.findOne({where: {contractAddress: contractAddress}, attributes: info.columns});
        if (!helper.isEmpty(getContractData)) {
            return res.status(200).json({ status: true, message: msgHelper.msg('MSG017'), data: getContractData.dataValues });
        } else {
            return res.status(200).json({ status: false, message: msgHelper.msg('MSG014'), data: null });
        }
    });

}


module.exports.buyTicket = (req, res) => {
    let formData = req.body;
    let schema = {
        ticketId: 'required',
        seller: 'required',
        price: 'required',
        chainId: 'required',
        contractAddress: 'required'
    }

    const validateData = new node_validator.Validator(formData, schema);
    validateData.check().then(async (matched) => {
        if (!matched) return res.status(422).json({ status: false, message: msgHelper.msg('MSG002'), error: validateData.errors });

        let ticketId = formData.ticketId;
        let seller = formData.seller;
        let price = formData.price;
        let chainId = formData.chainId;
        let contractAddress = formData.contractAddress;

        let contractInfo = {}
        contractInfo.where = {contractAddress: contractAddress};

        let getContractData = await ContractModel.findOne({where: {contractAddress: contractAddress}, attributes: ['id']});
        if (helper.isEmpty(getContractData)) {
            return res.status(200).json({ status: false, message: msgHelper.msg('MSG014'), data: null });
        } else {
            let info = {}
            info.data = {
                userAddress: seller,
                contractId: getContractData.dataValues.id,
                ticketId: ticketId,
                contractAddress: contractAddress,
                isListed: 0, // 0 = not-listed, 1 = listed
                ticketPrice: price,
                ticketBaughtFrom: 'token',
                createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
                updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
            }
            
            let createTicket = await TicketModel.create(info.data);
            // return res.status(200).json({ status: true, message: msgHelper.msg('MSG017'), data: createTicket.dataValues });

            if (!helper.isEmpty(createTicket)) {

                // decrease ticket count
                let updateContract = await ContractModel.update({soldTickets: sequelize.literal('soldTickets + 1')}, {where: {contractAddress: contractAddress}});

                if (updateContract) {
                    return res.status(200).json({ status: true, message: msgHelper.msg('MSG017'), data: createTicket.dataValues });
                } else {
                    return res.status(200).json({ status: false, message: msgHelper.msg('MSG014'), data: null });
                }

            } else {
                return res.status(200).json({ status: false, message: msgHelper.msg('MSG014'), data: null });
            }
        }       
        
    });
}


module.exports.getMyTicketList = (req, res) => {
    let formData = req.body;
    let schema = {
        contractAddress: 'required',
        chainId: 'required',
        userAddress: 'required'
    }

    const validateData = new node_validator.Validator(formData, schema);
    validateData.check().then(async (matched) => {
        if (!matched) return res.status(422).json({ status: false, message: msgHelper.msg('MSG002'), error: validateData.errors });

        let contractAddress = formData.contractAddress;
        let chainId = formData.chainId;
        let userAddress = formData.userAddress;

        let userTicket = await TicketModel.getUserTicketList(contractAddress, userAddress);
        if (!helper.isEmpty(userTicket.err)) return res.status(200).json({ status: false, message: msgHelper.msg('MSG014'), data: null });
        return res.status(200).json({ status: true, message: msgHelper.msg('MSG017'), data: userTicket.data });
        
    });
}

module.exports.listTicket = (req, res) => {
    let formData = req.body;
    let schema = {
        ticketId: 'required',
        seller: 'required',
        price: 'required',
        chainId: 'required',
        contractAddress: 'required'
    }

    const validateData = new node_validator.Validator(formData, schema);
    validateData.check().then(async (matched) => {
        if (!matched) return res.status(422).json({ status: false, message: msgHelper.msg('MSG002'), error: validateData.errors });

        let ticketId = formData.ticketId;
    });
}