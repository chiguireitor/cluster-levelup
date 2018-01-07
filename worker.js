'use strict'

const cluster = require('cluster')
const EventEmitter = require('events')

var pbx = new EventEmitter()
var msgNum = 0

cluster.worker.on('message', (msg) => {
  if ((typeof(msg.from) !== 'undefined') && (msg.from === 'db')) {
    pbx.emit(msg.id, msg)
  }
})

function backendCall(method, params, cb) {
  pbx.once(msgNum, (msg) => {
    if (msg.error) {
      cb(msg.error)
    } else if (msg.result.length > 0) {
      cb(null, ...msg.result)
    } else {
      cb()
    }
  })

  cluster.worker.send({
    target: 'db',
    method: method,
    params: params,
    id: msgNum++
  })
}

function m(name) {
  return function () {
    let orderedArgs = []
    Object.keys(arguments).sort().forEach(k => {
      orderedArgs.push(arguments[k])
    })

    let cb = orderedArgs.pop()
    backendCall(name, orderedArgs, cb)
  }
}

module.exports = {
  put: m('put'),
  get: m('get'),
  del: m('del')
}
