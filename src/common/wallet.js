const { ChainId } = require("@pancakeswap/sdk");
const { ethers } = require("ethers");
require("dotenv").config();

// BINANCE SMART CHAIN
const provider = new ethers.providers.JsonRpcProvider(
  "https://bsc-dataseed.binance.org/",
  { name: "Smart Chain", chainId: 56 }
);

const pancakeSwapContractAddress = "0x10ED43C718714eb63d5aA57B78B54704E256024E";

// ROPSTEN NETWORK
// const provider = ethers.getDefaultProvider(
//   "ropsten",
//   "GHG4E1DKJUKICUYJWQSYRM3385MDYRRDP1"
// );
// const pancakeSwapContractAddress = "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506";

const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const pancakeSwapContract = new ethers.Contract(
  pancakeSwapContractAddress,
  require("../abi/swap.json"),
  wallet
);

const chainID = ChainId.MAINNET;

const slippage = 3;

const maxAllowance = "1000000000000000000000000";

const gasLimit = 6700000;

const GWEI = 1000 * 1000 * 1000;

module.exports = {
  provider,
  wallet,
  pancakeSwapContract,
  pancakeSwapContractAddress,
  chainID,
  maxAllowance,
  gasLimit,
  slippage,
  GWEI,
};