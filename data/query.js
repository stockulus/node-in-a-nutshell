const mysql = require('mysql')

const connectionPool = mysql.createPool({
  connectionLimit: process.env.MYSQL_CONNECTION_LIMIT || 10,
  host: process.env.MYSQL_HOST || '127.0.0.1',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'bF9zhLWryNhsUuYzRXwULDits',
  database: process.env.MYSQL_DATABASE || 'test',
  debug: false
})

module.exports = (stmt, stmtArgs) => {
  return new Promise((resolve, reject) => {
    connectionPool.getConnection((error, connection) => {
      if (error) {
        console.log('MySql connection', { error, stmt, stmtArgs })
        return reject(error)
      }

      // support named parameters
      connection.config.queryFormat = function(query, values) {
        if (!values) return query
        return query.replace(
          /:(\w+)/g,
          function(txt, key) {
            if (values.hasOwnProperty(key)) {
              return this.escape(values[key])
            }
            return txt
          }.bind(this)
        )
      }

      const query = connection.query(stmt, stmtArgs, (error, result) => {
        connection.release()

        if (error) {
          console.log('MySql Query', { error, stmt, stmtArgs })
          return reject(error, query)
        }

        resolve(result, query)
      })
    })
  })
}
