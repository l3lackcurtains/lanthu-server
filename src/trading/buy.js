const {
    Fetcher,
    Percent,
    Route,
    Token,
    TokenAmount,
    Trade,
    TradeType,
    WETH,
} = require('@pancakeswap/sdk')

const { ethers } = require('ethers')
const { formatEther } = require('ethers/lib/utils')
const tokenABI = require('../utils/abi/token.json')
const { TradeModal, LogModal, HistoryModal } = require('../utils/db')
const { sendMessage } = require('../utils/notification')

const {
    provider,
    wallet,
    pancakeSwapContract,
    pancakeSwapContractAddress,
    chainID,
    maxAllowance,
    gasLimit,
    slippage,
    GWEI,
    BUSD,
} = require('../utils/wallet')

const buyToken = async (trade, coin, swapAmount, tokenAmount, currentPrice) => {
    try {
        let SWAPTOKEN = null
        if (coin.base === 'BUSD') {
            SWAPTOKEN = BUSD
        } else {
            SWAPTOKEN = WETH[chainID]
        }

        const amountIn = ethers.utils.parseUnits(swapAmount.toString(), 18)

        const to = wallet.address

        const tokenContract = new ethers.Contract(
            SWAPTOKEN.address,
            tokenABI,
            wallet
        )

        const allowance = await tokenContract.allowance(
            to,
            pancakeSwapContractAddress
        )

        if (allowance.lte(amountIn)) {
            const approved = await tokenContract.approve(
                pancakeSwapContractAddress,
                new ethers.BigNumber.from(maxAllowance),
                {
                    gasLimit: gasLimit,
                    gasPrice: 5 * GWEI,
                }
            )

            await provider.once(approved.hash, () => {
                console.log('Approved...')
            })
        }

        const balance = await tokenContract.balanceOf(to)

        if (balance.lte(amountIn)) {
            const msg = `Low balance ${formatEther(balance)} < ${formatEther(
                amountIn
            )} for this trade.`
            await updateErrorStatus(trade, msg)
            return
        }

        const TOKEN = new Token(chainID, coin.address, coin.decimal, coin.name)

        const pair = await Fetcher.fetchPairData(SWAPTOKEN, TOKEN, provider)

        const route = new Route([pair], SWAPTOKEN, TOKEN)

        const tradeData = new Trade(
            route,
            new TokenAmount(SWAPTOKEN, amountIn),
            TradeType.EXACT_INPUT
        )

        const slippageTolerance = new Percent(slippage.toString(), '100')

        const amountOutMin = tradeData.minimumAmountOut(slippageTolerance).raw

        const path = []

        for (let px of route.path) {
            path.push(px.address)
        }

        const deadline = Math.floor(Date.now() / 1000) + 60 * 10

        const value = tradeData.inputAmount.raw

        // const bought = await pancakeSwapContract.swapExactTokensForTokens(
        //     new ethers.BigNumber.from(String(value)),
        //     new ethers.BigNumber.from(String(amountOutMin)),
        //     path,
        //     to,
        //     deadline,
        //     {
        //         gasLimit: gasLimit,
        //         gasPrice: 5 * GWEI,
        //     }
        // )

        // await bought.wait()
        await updateBoughtStatus(trade, coin, tokenAmount, currentPrice)
    } catch (e) {
        const msg = `Error on token buy! ${tokenAmount} ${coin.name} at ${currentPrice} ${coin.name}`
        await updateErrorStatus(trade, msg, e)
    }
}

const updateBoughtStatus = async (trade, coin, tokenAmount, currentPrice) => {
    const tradeInDB = await TradeModal.findOne({ _id: trade._id })
    tradeInDB.status = 'BOUGHT'
    await tradeInDB.save()

    // Save in history
    const history = new HistoryModal({
        tradeId: trade._id,
        bought: currentPrice,
    })
    history.save()

    const msg = `Bought ${tokenAmount} ${coin.name} at ${currentPrice} ${coin.name}`
    await sendMessage('${coin.name} bought', msg)
}

const updateErrorStatus = async (trade, msg, e = '') => {
    const newLog = new LogModal({ message: msg, details: e.toString() })
    newLog.save()
    console.log(msg, e)

    // Update status and send notification
    const tradeInDB = await TradeModal.findOne({ _id: trade._id })
    tradeInDB.status = 'ERROR'
    await tradeInDB.save()
    await sendMessage('Error on buying ${coin.name}', msg)
}

module.exports = { buyToken }
