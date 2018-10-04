const fs = require('fs')
const path = require('path')

const query = require('./query')

const sql = fs.readFileSync(path.join(__dirname, 'get_post.sql'), {
  encoding: 'utf8'
})

module.exports = id => query(sql, { id })
