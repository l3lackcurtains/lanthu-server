require('dotenv').config()
const { formatEther, formatUnits } = require('@ethersproject/units')
const { Route, Token, Fetcher, WETH } = require('@pancakeswap/sdk')
const { ethers } = require('ethers')

const tokenABI = require('./abi/token.json')
const { wallet, chainID, provider, BUSD } = require('./wallet')

const getTokenPriceAndBalance = async (token) => {
    const tokenContract = new ethers.Contract(token.address, tokenABI, wallet)

    const bnbContract = new ethers.Contract(
        WETH[chainID].address,
        tokenABI,
        wallet
    )
    const bnbBalance = await bnbContract.balanceOf(wallet.address)

    const busdContract = new ethers.Contract(BUSD.address, tokenABI, wallet)
    const busdBalance = await busdContract.balanceOf(wallet.address)

    const balance = await tokenContract.balanceOf(wallet.address)
    const pairBUSD = await Fetcher.fetchPairData(BUSD, WETH[chainID], provider)
    const routeBUSD = new Route([pairBUSD], WETH[chainID])
    const bnbInUsd = routeBUSD.midPrice.toSignificant(6)

    let price = 0
    if (token.name !== 'BNB') {
        const TOKEN = new Token(
            chainID,
            token.address,
            token.decimal,
            token.name
        )

        const pairBNB = await Fetcher.fetchPairData(
            WETH[chainID],
            TOKEN,
            provider
        )
        const routeBNB = new Route([pairBNB], TOKEN)
        const currentPrice = routeBNB.midPrice.toSignificant(6)
        price = currentPrice * bnbInUsd
    } else {
        price = bnbInUsd
    }
    return {
        balance: parseFloat(formatUnits(balance, token.decimal)),
        price: parseFloat(price),
        bnbPrice: parseFloat(bnbInUsd),
        bnbBalance: parseFloat(formatEther(bnbBalance)),
        busdBalance: parseFloat(formatEther(busdBalance)),
    }
}

export { getTokenPriceAndBalance }
