const express = require('express')
const ws = require('ws')

const app = express()
const port = 3000

// Questions route
app.get('/questions/:question', (req, res) => {
  res.send('Question')
})
// Example call: http://localhost:3000/questions/Which%20XML%20attribute%20should%20be%20used%20to%20make%20an%20Image%20View%20accessible%3F

// Websocket server
const wsServer = new ws.Server({ noServer: true })
wsServer.on('connection', socket => {
  socket.on('message', message => {
    // console.log(message)
  })
})

// Express server
const server = app.listen(port)
server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, socket => {
    wsServer.emit('connection', socket, request)
  })
})