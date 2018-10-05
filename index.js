const express = require('express')
const bodyParser = require('body-parser')

const data = require('./data')

const PORT = process.env.PORT || 5000

data.init().then(() => {
  const app = express()
  app.use(bodyParser.json())

  app.get('/', (request, response) => response.send('hello World\n'))
  app.get('/test/:id', (request, response) => {
    data
      .get(request.params.id)
      .then(result => {
        if (result.length === 0) {
          return response.status(404).send({ found: 'not ;)' })
        }
        response.send({
          name: result[0].user,
          comment: result[0].comment
        })
      })
      .catch(error => {
        response.status(500).send(error)
      })
  })

  app.post('/test/', (request, response) => {
    console.log(Object.keys(request.body))

    response.send({ ok: true })
  })

  app.get('/healthcheck', (_, response) =>
    response.send({ uptime: process.uptime() })
  )

  app.listen(PORT, '0.0.0.0', error => {
    if (error) {
      console.error('Servicer init error (listen)', error)
      return process.exit(1)
    }

    process.emit('SERVER_STARTED')
    console.log(`Service listening (port: ${PORT})`)
  })
})

console.log('Hello')
