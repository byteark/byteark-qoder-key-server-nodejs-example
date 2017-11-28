const crypto = require('crypto')
const fs = require('fs')
const mkdirp = require('mkdirp')
const path = require('path')

const keyDirectory = './storage/keys'

function getKeyPath(requestPayload) {
  const firstSubDirectory = requestPayload.content_id.substr(-4, 2)
  const secondSubDirectory = requestPayload.content_id.substr(-2, 2)

  return path.resolve(`${keyDirectory}/${firstSubDirectory}/${secondSubDirectory}/${requestPayload.content_id}/${requestPayload.tech}/${requestPayload.definition}/key`)
}

function findKey(requestPayload) {
  return new Promise((resolve, reject) => {
    const keyPath = getKeyPath(requestPayload)

    fs.exists(keyPath, (exists) => {
      exists
        ? fs.readFile(keyPath, (error, data) => {
          error ? reject(error) : resolve(data)
        })
        : resolve(null)
    })
  })
}

function createKey(requestPayload) {
  return new Promise(function(resolve, reject) {
    const keyPath = getKeyPath(requestPayload)
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

function findOrCreateKey(requestPayload) {
  return findKey(requestPayload).then((key) => key ? key : createKey(requestPayload))
}

module.exports = {
  findKey: findKey,
  createKey: createKey,
  findOrCreateKey: findOrCreateKey
}
