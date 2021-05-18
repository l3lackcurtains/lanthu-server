const { ethers } = require("ethers");
require("dotenv").config();

// const provider = new ethers.providers.JsonRpcProvider(
//   "https://bsc-dataseed.binance.org/",
//   { name: "Smart Chain", chainId: 56 }
// );

const provider = ethers.getDefaultProvider("ropsten");

const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// const pancakeSwapContractAddress = "0x10ED43C718714eb63d5aA57B78B54704E256024E";

const pancakeSwapContractAddress = "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506";

const pancakeSwapContract = new ethers.Contract(
  pancakeSwapContractAddress,
  require("./abi/swap.json"),
  wallet
);

module.exports = {
  provider,
  wallet,
  pancakeSwapContract,
  pancakeSwapContractAddress,
};
