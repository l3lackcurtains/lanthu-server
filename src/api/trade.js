require('dotenv').config()
const express = require('express')

const { TokenModal, TradeModal } = require('../utils/db')

const router = express.Router()

router.post('/trades', async (req, res) => {
    const token = req.body.token.toString().toUpperCase()
    const amount = parseFloat(req.body.amount)
    const buyLimit = parseFloat(req.body.buyLimit)
    const sellLimit = parseFloat(req.body.sellLimit)
    const stopLossLimit = parseFloat(req.body.stopLossLimit)
    const status = req.body.status

    try {
        const tokenDb = await TokenModal.findOne({ name: token })
        if (tokenDb !== null) {
            const newTrade = TradeModal({
                id: Math.floor(Math.random() * 99999),
                type: type,
                address: tokenDb.address,
                token: token,
                amount: amount,
                limit: limit,
                success: success,
                error: error,
            })
            newTrade.save()
            res.json({ success: true, message: `${type}: trade added.` })
        } else {
            res.json({ success: false, message: 'Set the coin first.' })
        }
    } catch (e) {
        res.json({ success: false, message: '`Error on token buy.' })
    }
})

router.put('/trades/:id', async (req, res) => {
    const id = req.params.id
    const token = req.body.token.toString().toUpperCase()
    const limit = parseFloat(req.body.limit)
    const amount = parseFloat(req.body.amount)
    const type = req.body.type
    const success = req.body.success
    const error = req.body.error

    try {
        const tokenDb = await TokenModal.findOne({ name: token })
        if (tokenDb !== null) {
            await TradeModal.updateOne(
                { id },
                {
                    token: token,
                    limit: limit,
                    amount: amount,
                    type: type,
                    success: success,
                    error: error,
                }
            )

            res.json({ success: true, message: `${type}: trade added.` })
        } else {
            res.json({ success: false, message: 'Set the coin first.' })
        }
    } catch (e) {
        console.log(e)
        res.json({ success: false, message: '`Error on token buy.' })
    }
})

router.get('/trades', async (req, res) => {
    try {
        const trades = await TradeModal.find().sort({ updatedAt: -1 })
        res.json({ success: true, message: trades })
    } catch (e) {
        res.json({ success: false, message: `Error on trades fetch.` })
    }
})

router.delete('/trades/:id', async (req, res) => {
    const id = req.params.id
    console.log(id)
    try {
        const tradeInDB = await TradeModal.findOne({ id })
        if (tradeInDB !== null) {
            await TradeModal.deleteOne({ id })
            res.json({ success: true, message: `trade removed` })
        }
    } catch (e) {
        res.json({ success: false, message: `Error on trade remove.` })
    }
})

module.exports = { router }
