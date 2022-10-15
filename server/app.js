require('dotenv').config()
const express = require('express')
const ws = require('ws')
const https = require('https')

const app = express()
const port = 3000

// Quizzes route
app.get('/quizzes/:quiz', (req, res) => {
  console.log(req.params)
  const quiz = req.params.quiz.toLowerCase().replace(' assessment', '').replace(/\s/g, '-')
  const quizURL = `${process.env.QUIZ_URL_PART_1}/${quiz}/${quiz}-${process.env.QUIZ_URL_PART_2}`
  console.log(quiz, quizURL)

  // Find quiz, html response
  https.get(quizURL, (resp) => {
    let data = ''
    resp.on('data', (chunk) => {
      data += chunk
    })

    resp.on('end', () => {
      res.send(data)
    })

  }).on("error", (err) => {
    console.log("Error: " + err.message)
  })
})

// Questions route
app.get('/questions/:question', (req, res) => {
  res.send('Question')
})

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