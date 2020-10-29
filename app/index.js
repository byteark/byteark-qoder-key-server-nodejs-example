const _ = require('lodash')
const dotenv = require('dotenv')
const express = require('express')
const localFileBasedKeyManager = require('./modules/localFileBasedKeyManager')
const responseEncryptionKey = require('./modules/responseEncryptionKey')
const shouldAllowPlayback = require('./modules/shouldAllowPlayback')
const validateEncryptionKeyRequest = require('./modules/validateEncryptionKeyRequest')
const errorHandler = require('./errors/handler')

// Reading config
const config = _.defaults(dotenv.config().parsed, {
  SERVER_ADDRESS: '0.0.0.0',
  SERVER_PORT: 3000,
  STORAGE_KEY_DIRECTORY: './storage/keys',
  ENCODER_SECRET: 'secret',
  ENCRYPTION_KEY_REQUEST_TOKEN_SECRET: 'secret',
});

const app = express()

app.post('/integrations/byteark/drm/encryption/key', function (request, response) {
  if (request.headers['x-byteark-qoder-secret'] != config.ENCODER_SECRET) {
    return response.status(403).send({
      error: 'Forbidden Request'
    })
  }

  validateEncryptionKeyRequest(request.query.token, config.ENCRYPTION_KEY_REQUEST_TOKEN_SECRET)
    .then((requestPayload) => localFileBasedKeyManager.findOrCreateKey(requestPayload))
    .then((encryptionKey) => responseEncryptionKey(response, encryptionKey))
    .catch((error) => errorHandler(response, error))
})

app.get('/integrations/byteark/drm/playback/key', function (request, response) {
  validateEncryptionKeyRequest(request.query.token, config.ENCRYPTION_KEY_REQUEST_TOKEN_SECRET)
    .then((requestPayload) => shouldAllowPlayback(request, requestPayload))
    .then((requestPayload) => localFileBasedKeyManager.findKey(requestPayload))
    .then((encryptionKey) => responseEncryptionKey(response, encryptionKey))
    .catch((error) => errorHandler(response, error))
})

const server = app.listen(config.SERVER_PORT, config.SERVER_ADDRESS, function () {
  console.log(`Key server is listening on ${config.SERVER_ADDRESS}:${config.SERVER_PORT}!`)
})

module.exports = server
