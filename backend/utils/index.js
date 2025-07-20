require('dotenv').config()

const jwt = require('jsonwebtoken')

function generateAccessToken(user) {
    user = {...user, createdAt: Date.now()}
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' })
}

module.exports = { generateAccessToken }