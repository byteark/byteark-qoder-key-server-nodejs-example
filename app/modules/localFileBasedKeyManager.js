const crypto = require('crypto')
const fs = require('fs')
const mkdirp = require('mkdirp')
const path = require('path')

const keyDirectory = './storage/keys'

function getKeyPath(content) {
  const q = content
  const firstSubDirectory = q.content_id.substr(-4, 2)
  const secondSubDirectory = q.content_id.substr(-2, 2)

  return path.resolve(`${keyDirectory}/${firstSubDirectory}/${secondSubDirectory}/${q.content_id}/${q.tech}/${q.definition}/key`)
}

function findKey(content) {
  return new Promise((resolve, reject) => {
    const keyPath = getKeyPath(content)

    fs.exists(keyPath, (exists) => {
      exists
        ? fs.readFile(keyPath, (error, data) => {
          error ? reject(error) : resolve(data)
        })
        : resolve(null)
    })
  })
}

function createKey(content) {
  return new Promise(function(resolve, reject) {
    const keyPath = getKeyPath(content)
    const keyBuffer = crypto.randomBytes(16)

    mkdirp(path.dirname(keyPath), (error) => {
      error
        ? reject(error)
        : fs.writeFile(keyPath, keyBuffer, { encoding: 'buffer' }, (error) => {
          error ? reject(error) : resolve(keyBuffer)
        })
    })
  })
}

function findOrCreateKey(content) {
  return findKey(content).then((key) => {
    return key ? key : createKey(content)
  })
}

module.exports = {
  findKey: findKey,
  createKey: createKey,
  findOrCreateKey: findOrCreateKey
}
