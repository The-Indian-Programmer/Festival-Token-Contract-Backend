const express = require("express")
const router = express.Router()
const path = require("path")

const ApiController = require("../controllers/Api.controller.js")

router.post('/contract/get-contract-data', ApiController.getContractData)
module.exports = router
