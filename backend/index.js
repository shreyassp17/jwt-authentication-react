const express = require('express')
const app = express()
const server = require("./server")
const cors = require('cors');
const PORT = 8000

app.use(cors()); // Enables CORS for all routes
app.use(express.json())
app.use(server)

app.listen(PORT, () => {
    console.log(`Listening at port ${PORT}`)
})