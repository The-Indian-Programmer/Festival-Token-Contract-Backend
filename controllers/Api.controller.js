"use strict"

const moment = require("moment");
const ContractModel = require("../models/contract.model");

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