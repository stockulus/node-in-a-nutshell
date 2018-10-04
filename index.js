const express = require('express')
const bodyParser = require('body-parser')

const PORT = process.env.PORT || 5000

const app = express()
app.use(bodyParser.json())

app.get('/', (_, response) => response.send('hello World\n'))

app.get('/healthcheck', (_, response) =>
  response.send({ uptime: process.uptime() })
)

app.listen(PORT, '0.0.0.0', error => {
  if (error) {
    console.error('Servicer init error (listen)', error)
    process.exit(1)
  }

  process.emit('SERVER_STARTED')
  console.log(`Service listening (port: ${PORT})`)
})
