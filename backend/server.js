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

        res.send({ accessToken, refreshToken })
    }
    catch (error) {
        res.status(500).json(error.message)
    }
})

app.post('/access-token', (req, res) => {
    try {
        const {refreshToken} = req.body
        if (!refreshToken) throw new Error("Refresh token not found")
            console.log("Hello",refreshToken, refreshTokens)

        if (!refreshTokens.includes(refreshToken)) throw new Error("Refresh token expired")

        const user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        const {username, password} = user
        const accessToken = generateAccessToken({username, password})

        res.json(accessToken)

    }
    catch (error) {
        console.log(error.message)
        res.status(500).json(error.message)
    }
})

app.post('/profile-details', (req, res) => {
    const { accessToken } = req.body
    try {
        const user = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
        res.json(user)
    } catch (error) {
        res.status(401).json(error.message)
    }

})

module.exports = app