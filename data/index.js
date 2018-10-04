const fs = require('fs')
const path = require('path')

const query = require('./query')

const sql = ['create_table', 'get_post'].reduce((result, fileName) => {
  result[fileName] = fs.readFileSync(path.join(__dirname, `${fileName}.sql`), {
    encoding: 'utf8'
  })

  return result
}, {})

module.exports.init = () => {
  return new Promise((resolve, reject) => {
    query(sql.create_table, null)
      .then(() => {
        console.log('Table Created')
        resolve()
      })
      .catch(error => {
        if (error.code === 'ER_TABLE_EXISTS_ERROR') {
          console.log('Table already exists')
          return resolve()
        }

        reject(error)
      })
  })
}

module.exports.get = id => query(sql.get_post, { id })
