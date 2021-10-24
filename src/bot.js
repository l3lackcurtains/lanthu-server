import { TradeModal, TokenModal, LogModal } from './utils/db'
import { getCurrentPrice } from './utils/helpers'
import { buyToken } from './trading/buy'
import { sellToken } from './trading/sell'

const startTheBot = async () => {
    const trades = await TradeModal.find()

    for (let trade of trades) {
        // Skip success trades..
        if (trade.status === 'SOLD' || trade.status === 'ERROR') continue

        const coin = await TokenModal.findOne({ _id: trade.tokenId })

        const { currentPrice, currentPriceConversion } = await getCurrentPrice(
            coin
        )

        try {
            const tokenAmount = parseFloat(trade.amount)
            const swapAmount = parseFloat(trade.amount * currentPriceConversion)
            if (
                trade.status === 'INIT' &&
                trade.buyLimit > 0 &&
                currentPrice < trade.buyLimit
            ) {
                console.log(
                    `Start buying ${tokenAmount} ${coin.name} (${swapAmount} ${coin.base}) `
                )
                await buyToken(
                    trade,
                    coin,
                    swapAmount,
                    tokenAmount,
                    currentPrice
                )
            } else if (
                trade.status === 'BOUGHT' &&
                ((trade.sellLimit > 0 && currentPrice > trade.sellLimit) ||
                    (trade.stopLossLimit > 0 &&
                        currentPrice < trade.stopLossLimit))
            ) {
                console.log(
                    `Start selling ${tokenAmount} ${coin.name} (${swapAmount} ${coin.base}) `
                )
                await sellToken(
                    trade,
                    coin,
                    swapAmount,
                    tokenAmount,
                    currentPrice
                )
            }
        } catch (e) {
            const errStr = e.toString()
            if (errStr.includes('getReserves()')) {
                const msg = `No token pair found for ${coin.name}.`
                const newLog = new LogModal({
                    message: msg,
                    details: e.toString(),
                })
                newLog.save()

                console.log(e)
                console.log(msg)

                const tradeInDB = await TradeModal.findOne({ id: trade.id })
                tradeInDB.error = true
                tradeInDB.success = false
                await tradeInDB.save()
            }
        }
    }
}

module.exports = { startTheBot }
