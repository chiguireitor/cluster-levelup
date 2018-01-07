# cluster-levelup

An opinionated isomorphic wrapper around levelup for cluster compatibility.

Doesn't includes backend, you can use leveldown, memdown or your own.

Master is always considered the database "opener", workers communicate with the database via RPC calls.

## Example

Just use as if you were using levelup on the workers.

```javascript
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
```

## License
Copyright 2018 John "Chiguireitor" Villar

cluster-levelup is licensed under the ISC license. All rights not explicitly granted in the ISC license are reserved. See the included LICENSE.md file for more details.
