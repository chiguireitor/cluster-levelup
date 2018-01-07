'use strict'

const cluster = require('cluster')
const levelup = require('levelup')

module.exports = (dbn, options, callback) => {
  levelup(dbn, options, (err, db) => {
    if (err) {
      callback(err)
    } else {
      callback(null, db)

      cluster.on('message', (worker, message, handle) => {
        if (message.target === 'db') {
          db[message.method](...message.params, function(err) {
            if (err) {
              worker.send({
                from: 'db',
                error: err,
                id: message.id
              })
            } else {
              let orderedArgs = []
              Object.keys(arguments).sort().forEach(k => {
                orderedArgs.push(arguments[k])
              })
              worker.send({
                from: 'db',
                result: orderedArgs.slice(1),
                id: message.id
              })
            }
          })
        }
      })
    }
  })
}
