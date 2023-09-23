const express = require("express")
const router = express.Router()
const path = require("path")

const ApiController = require("../controllers/Api.controller.js")

router.post('/contract/get-contract-data', ApiController.getContractData)

router.post('/ticket/buy', ApiController.buyTicket)
router.post('/ticket/update', ApiController.updateTicketPrice)
router.post('/ticket/list', ApiController.listTicket)
router.post('/ticket/user', ApiController.getMyTicketList)
router.post('/ticket/cancel-list', ApiController.cancelListTicket)
router.post('/ticket/all-listed', ApiController.getAllListedTicket)
module.exports = router
