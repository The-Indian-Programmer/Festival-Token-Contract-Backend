"use strict"

const moment = require("moment");
const ContractModel = require("../models/contract.model");
const TicketModel = require("../models/ticket.model");
const NftListing = require("../models/nftlist.model");

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

        info.where = { contractAddress: contractAddress };
        let getContractData = await ContractModel.findOne({ where: { contractAddress: contractAddress }, attributes: info.columns });
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
        contractInfo.where = { contractAddress: contractAddress };

        let getContractData = await ContractModel.findOne({ where: { contractAddress: contractAddress }, attributes: ['id'] });
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
                let updateContract = await ContractModel.update({ soldTickets: sequelize.literal('soldTickets + 1') }, { where: { contractAddress: contractAddress } });

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

        let currentDateTime = moment().format('YYYY-MM-DD HH:mm:ss');
        let ticketId = formData.ticketId;
        let seller = formData.seller;
        let price = formData.price;
        let chainId = formData.chainId;
        let contractAddress = formData.contractAddress;

        let contractInfo = {}
        contractInfo.where = { contractAddress: contractAddress };

        let getContractData = await ContractModel.findOne({ where: { contractAddress: contractAddress }, attributes: ['id'] });
        if (helper.isEmpty(getContractData)) return res.status(200).json({ status: false, message: msgHelper.msg('MSG014'), data: null });

        let info = {}
        info.data = {
            userAddress: seller,
            contractId: getContractData.dataValues.id,
            ticketId: (ticketId),
            sellerAddress: seller,
            price: Number(price),
            createdAt: currentDateTime,
            updatedAt: currentDateTime,
        }
        info.where = { contractId: getContractData.dataValues.id, ticketId: ticketId };

        // check if ticket is already listed
        let checkTicket = await NftListing.findOne({ where: info.where });

        if (!helper.isEmpty(checkTicket)) {
            // update ticket price
            let updateTicket = await NftListing.update({ price: Number(price) }, { where: { contractId: getContractData.dataValues.id, ticketId: ticketId } });

            if (!helper.isEmpty(updateTicket)) return res.status(200).json({ status: true, message: msgHelper.msg('MSG017'), data: updateTicket.dataValues });

            return res.status(200).json({ status: false, message: msgHelper.msg('MSG014'), data: null });
        } else {
            let createTicket = await NftListing.create(info.data);
            // console.log(createTicket);
            if (!helper.isEmpty(createTicket)) {
                // update ticket status
                let updateTicket = await TicketModel.update({ isListed: 1 }, { where: { contractId: getContractData.dataValues.id, ticketId: ticketId } });
                if (updateTicket) {
                    return res.status(200).json({ status: true, message: msgHelper.msg('MSG017'), data: createTicket.dataValues });
                } else {
                    return res.status(200).json({ status: false, message: msgHelper.msg('MSG014'), data: null });
                }
            }
        }
    });
}

module.exports.cancelListTicket = (req, res) => {
    let formData = req.body;
    let schema = {
        ticketId: 'required',
        seller: 'required',
        chainId: 'required',
        contractAddress: 'required',
    }

    const validateData = new node_validator.Validator(formData, schema);
    validateData.check().then(async (matched) => {
        if (!matched) return res.status(422).json({ status: false, message: msgHelper.msg('MSG002'), error: validateData.errors });

        let ticketId = formData.ticketId;
        let seller = formData.seller;
        let chainId = formData.chainId;
        let contractAddress = formData.contractAddress;

        let contractInfo = {}
        contractInfo.where = { contractAddress: contractAddress };

        let getContractData = await ContractModel.findOne({ where: { contractAddress: contractAddress }, attributes: ['id'] });
        if (helper.isEmpty(getContractData)) return res.status(200).json({ status: false, message: msgHelper.msg('MSG014'), data: null });

        let info = {}
        info.data = {
            userAddress: seller,
            contractId: getContractData.dataValues.id,
            ticketId: (ticketId),
            sellerAddress: seller,
        }
        info.where = { contractId: getContractData.dataValues.id, ticketId: ticketId };

        // check if ticket is listed
        let checkTicket = await NftListing.findOne({ where: info.where });

        if (!helper.isEmpty(checkTicket)) {
            let sellerAddress = checkTicket.dataValues.sellerAddress;
            let nftListingID = checkTicket.dataValues.id;

            // check if seller is same
            if (sellerAddress != seller) return res.status(200).json({ status: false, message: msgHelper.msg('MSG014'), data: null });

            // remove from nft listing
            let removeTicket = await NftListing.destroy({ where: { id: nftListingID } });
            if (!helper.isEmpty(removeTicket)) {
                // update ticket status
                let updateTicket = await TicketModel.update({ isListed: 0 }, { where: { contractId: getContractData.dataValues.id, ticketId: ticketId } });
                if (updateTicket) {
                    return res.status(200).json({ status: true, message: msgHelper.msg('MSG017'), data: updateTicket.dataValues });
                } else {
                    return res.status(200).json({ status: false, message: msgHelper.msg('MSG014'), data: null });
                }
            } else {
                return res.status(200).json({ status: false, message: msgHelper.msg('MSG002'), data: null });
            }
        } else {
            return res.status(200).json({ status: false, message: msgHelper.msg('MSG014'), data: null });
        }

    });
}


module.exports.updateTicketPrice = (req, res) => {
    let formData = req.body;
    let schema = {
        ticketId: 'required',
        seller: 'required',
        price: 'required',
        chainId: 'required',
        contractAddress: 'required',
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
        contractInfo.where = { contractAddress: contractAddress };

        let getContractData = await ContractModel.findOne({ where: { contractAddress: contractAddress }, attributes: ['id'] });
        if (helper.isEmpty(getContractData)) return res.status(200).json({ status: false, message: msgHelper.msg('MSG014'), data: null });

        let info = {}
        info.data = {
            userAddress: seller,
            contractId: getContractData.dataValues.id,
            ticketId: (ticketId),
            sellerAddress: seller,
            price: (price),
        }
        info.where = { contractId: getContractData.dataValues.id, ticketId: ticketId };

        // check if ticket is listed
        let checkTicket = await NftListing.findOne({ where: info.where });

        if (!helper.isEmpty(checkTicket)) {
            let sellerAddress = checkTicket.dataValues.sellerAddress;
            let isListed = checkTicket.dataValues.isListed;
            let nftListingID = checkTicket.dataValues.id;

            // check if seller is same
            if (sellerAddress != seller) return res.status(200).json({ status: false, message: msgHelper.msg('MSG014'), data: null });
            if (isListed == 0) return res.status(200).json({ status: false, message: msgHelper.msg('MSG014'), data: null });

            // update ticket price
            let updateTicket = await NftListing.update({ price: Number(price) }, { where: { id: nftListingID } });
            if (!helper.isEmpty(updateTicket)) return res.status(200).json({ status: true, message: msgHelper.msg('MSG017'), data: updateTicket.dataValues });

            return res.status(200).json({ status: false, message: msgHelper.msg('MSG014'), data: null });
        } else {
            return res.status(200).json({ status: false, message: msgHelper.msg('MSG014'), data: null });
        }
    });
}


module.exports.getAllListedTicket = (req, res) => {
    let formData = req.body;
    let schema = {
        contractAddress: 'required',
        chainId: 'required'
    }

    const validateData = new node_validator.Validator(formData, schema);
    validateData.check().then(async (matched) => {
        if (!matched) return res.status(422).json({ status: false, message: msgHelper.msg('MSG002'), error: validateData.errors });

        try {
            let contractAddress = formData.contractAddress;
            let chainId = formData.chainId;

            let contractInfo = {}
            contractInfo.where = { contractAddress: contractAddress };

            let getContractData = await ContractModel.findOne({ where: { contractAddress: contractAddress }, attributes: ['id'] });

            if (helper.isEmpty(getContractData)) return res.status(200).json({ status: false, message: msgHelper.msg('MSG014'), data: null });

            let contractId = getContractData.dataValues.id;

            let allNftTicket = await NftListing.getAllTicketList(contractId);
            if (!helper.isEmpty(allNftTicket.err)) return res.status(200).json({ status: false, message: msgHelper.msg('MSG014'), data: null });
            return res.status(200).json({ status: true, message: msgHelper.msg('MSG017'), data: allNftTicket.data });
        } catch (error) {
            return res.status(200).json({ status: false, message: msgHelper.msg('MSG014'), data: null });
        }
    });
}