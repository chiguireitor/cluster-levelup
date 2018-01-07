const levelup = require('./index.js')
const cluster = require('cluster')

if (cluster.isMaster) {
  levelup(require('memdown')(), {}, (err, db) => {
    if (err) {
      throw err
    } else {
      db.put('test', 'value', (err) => {
        if (err) {
          throw err
        } else {
          console.log('Forking')
          cluster.fork()
        }
      })
    }
  })
} else {
  levelup.get('test', (err, data) => {
    if (err) {
      throw err
    } else {
      console.log('test', '=', data)
    }
  })
}
