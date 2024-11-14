const express = require('express')
const path = require('path')
const fs = require('fs')
const useragent = require('useragent')

const app = express()
const PORT = 3000

// Middleware for parsing form data
app.use(express.urlencoded({extended: true}))

// Static files
app.use(express.static(path.join(__dirname)))

// Function to return HTML
const toReturn = (req, res) => {
    const filePath = path.join(__dirname, 'test.html')
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error')
        }

        // Generate random text
        const randomText = Math.random().toString(36).substring(2, 12)

        // Parse User-Agent
        const serverName = parseUserAgent(req)

        // Update HTML
        const updatedHtml = data
            .replace(/IFRAME_NAME_PLACEHOLDER/g, randomText)
            .replace(/SERVER_NAME_PLACEHOLDER/g, serverName)

        // Send updated HTML
        return res.send(updatedHtml)
    })
}

// Useragent parser function
const parseUserAgent = (req) => {
    const agent = useragent.parse(req.headers[ 'user-agent' ])
    const browser = `${agent.family} ${agent.major}.${agent.minor}`
    const os = `${agent.os.family}`
    return `${browser} ${os}`
}

// Calculate elapsed time
const calculateElapsedTime = () => {
    const currentTime = new Date()
    const elapsedTime = Math.floor((currentTime - serverStartTime) / 1000)
    const minutes = Math.floor(elapsedTime / 60)
    const seconds = elapsedTime % 60
    return {minutes, seconds}
}

// Get for the main page
app.get('/', toReturn)

// Get for the page
app.get('/test', toReturn)

// Post for the page
app.post('/test', (req, res) => {
    const formData = req.body

    // Parse User-Agent
    const serverName = parseUserAgent(req)

    const elapsedTime = calculateElapsedTime()

    // Log
    console.log(`${elapsedTime.minutes}:${elapsedTime.seconds}`, serverName, formData)

    // Send response
    return toReturn(req, res)
})

// Start server
const serverStartTime = new Date()
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})
