const ethers = require('ethers');
const festivalTicketAddress  = require('../contract-info/constants/contractAddress/festivalTIcketAddresses.json');
const festivalTIcketMarketPlaceAddresses  = require('../contract-info/constants/contractAddress/festivalTIcketMarketPlaceAddresses.json');

const abi = require('../contract-info/constants/contractAbi/festivalTicketMarketPlace.json');
require("dotenv").config(); 

const chainId = process.env.CHAIN_ID;
let contractAddress = festivalTIcketMarketPlaceAddresses[chainId][festivalTIcketMarketPlaceAddresses[chainId].length - 1];


const WEB3_PROVIDER_URL = process.env.WEB3_PROVIDER_URL;
const WEBSOCKET_PROVIDER_URL = process.env.WEBSOCKET_PROVIDER_URL;
const provider = new ethers.JsonRpcProvider(WEB3_PROVIDER_URL);
const contract = new ethers.Contract(contractAddress, abi, provider);

const webSocketProvider = new ethers.WebSocketProvider(WEBSOCKET_PROVIDER_URL);

const webSocketContract = new ethers.Contract(contractAddress, abi, webSocketProvider);


const TicketController = require('../controllers/Ticket.controller.js');

const contractFunction = contract.interface;


/* Ticket Price */
async function getPrice() {
    try {
      const price = await contract['getTicketPrice']()
      if (!helper.isEmpty(price)) {
        let newPrice = ethers.formatUnits(price, 18);
        return newPrice;
      }
    } catch (error) {
      console.error('Error calling getPrice:', error);
      return null;
    }
}

/* soldTickets */
async function getSoldTickets() {
    try {
      const soldTickets = await contract.getTotalSoldTickets();
        return soldTickets;
    } catch (error) {
      console.error('Error calling getSoldTickets:', error);
      return null;
    }
}

/* maxTickets */
async function getMaxTickets() {
    try {
      const maxTickets = await contract.getTotalTickets();
      if (!helper.isEmpty(maxTickets)) {
        return maxTickets
      }
    } catch (error) {
      console.error('Error calling getMaxTickets:', error);
      return null
    }
}

/* ticketName */
async function getTicketName() {
    try {
      const ticketName = await contract.getFestivalTicketNFTName();
      if (!helper.isEmpty(ticketName)) {
        return ticketName;
      }
    } catch (error) {
      console.error('Error calling getTicketName:', error);
      return null;
    }
}

/* ticketSymbol */
async function getTicketSymbol() {
    try {
      const ticketSymbol = await contract.getFestivalTicketNFTSymbol();
      if (!helper.isEmpty(ticketSymbol)) {
        return ticketSymbol
      }
    } catch (error) {
      console.error('Error calling getTicketSymbol:', error);
      return null;
    }
}


/*contractOwner */
async function getContractOwner() {
    try {
      const contractOwner = await contract.getOwner();
      if (!helper.isEmpty(contractOwner)) {
        return contractOwner;
      }
    } catch (error) {
      console.error('Error calling getContractOwner:', error);
      return null;
    }
}


const getData = async () => {
    const price = await getPrice();
    const soldTickets = await getSoldTickets();
    const maxTickets =await getMaxTickets();
    const ticketName = await getTicketName();
    const ticketSymbol = await getTicketSymbol();
    const contractOwner = await getContractOwner();
    
    let item =  { price, soldTickets, maxTickets, ticketName, ticketSymbol, contractOwner, contractAddress };
    TicketController.updateContractData(item);
}


getData();

module.exports = contract;


