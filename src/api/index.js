require('dotenv').config()
const express = require('express')

const { TokenModal, DeviceModal, LogModal } = require('../utils/db')

const router = express.Router()

router.post('/devices', async (req, res) => {
    const token = req.body.token
    try {
        const deviceInDB = await DeviceModal.findOne({ token })
        if (deviceInDB === null) {
            const newDevice = new DeviceModal({ token })
            newDevice.save()
            res.json({ success: true, message: `Device added` })
        }
    } catch (e) {
        res.json({ success: false, message: `Error on device add.` })
    }
})

router.get('/devices/:token', async (req, res) => {
    const token = req.params.token
    try {
        const device = await DeviceModal.findOne({ token })
        res.json({ success: true, message: device })
    } catch (e) {
        res.json({ success: false, message: `Error on device fetch.` })
    }
})

router.get('/tokeninfo/:name', async (req, res) => {
    const name = req.params.name.toUpperCase()

    try {
        const token = await TokenModal.findOne({ name })

        if (token !== null) {
            const { balance, price, bnbBalance, bnbPrice, busdBalance } =
                await getTokenPriceAndBalance(token)

            const data = {
                token: token.name,
                address: token.address,
                balance,
                bnbBalance,
                busdBalance,
                price,
                bnbPrice,
            }

            res.json({ success: true, message: data })
        } else {
            res.json({ success: false, message: 'No token.' })
        }
    } catch (e) {
        console.log(e)
        res.json({ success: false, message: `Error on token fetch.` })
    }
})

router.delete('/logs/:id', async (req, res) => {
    const id = req.params.id.toString()
    try {
        const logInDB = await LogModal.findOne({ _id: id })
        if (logInDB !== null) {
            await LogModal.deleteOne({ _id: id })
            res.json({ success: true, message: `Log removed` })
        }
    } catch (e) {
        res.json({ success: false, message: `Error on token remove.` })
    }
})

router.get('/logs', async (req, res) => {
    try {
        const logs = await LogModal.find().sort({ updatedAt: -1 })
        res.json({ success: true, message: logs })
    } catch (e) {
        res.json({ success: false, message: `Error on logs fetch.` })
    }
})

module.exports = { router }
