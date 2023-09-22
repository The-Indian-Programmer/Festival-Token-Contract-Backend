const express = require("express")
const router = express.Router()
const path = require("path")

const ApiController = require("../controllers/Api.controller.js")

router.post('/contract/get-contract-data', ApiController.getContractData)

router.post('/ticket/buy', ApiController.buyTicket)
router.post('/ticket/user', ApiController.getMyTicketList)
module.exports = router
