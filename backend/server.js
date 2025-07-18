const express = require('express')
const app = express()
const generateAccessToken = require('./utils/index').generateAccessToken
require('dotenv').config()
const jwt = require('jsonwebtoken')

const refreshTokens = []

app.post('/login', (req, res) => {
    try {
        const { username, password } = req.body

        // authenticate user
        if (!username || !password) return res.status(401).json({ error: "Username and password cannot be empty" })

        const user = { username, password }

        const accessToken = generateAccessToken(user)
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
        refreshTokens.push(refreshToken)

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
            secure: true, // Ensures cookie is only sent over HTTPS
        });

        res.json({ accessToken, refreshToken })
    }
    catch (error) {
        res.status(500).error(error)
    }
})

app.get('/access-token', (req, res) => {
    try {
        const refreshToken = req.body

        if (!refreshToken) throw new Error("Refresh token not found")

        if (!refreshTokens.includes(refreshToken)) throw new Error("Refresh token expired")

        const user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)

        const accessToken = generateAccessToken(user)

        res.json({ accessToken })

    }
    catch (error) {
        res.status(500).error(error)
    }
})

module.exports = app