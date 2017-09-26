const express = require('express')
const localFileBasedKeyManager = require('./modules/localFileBasedKeyManager')
const validateEncryptionKeyRequest = require('./modules/validateEncryptionKeyRequest')
const validatePlaybackKeyRequest = require('./modules/validatePlaybackKeyRequest')
const errorHandler = require('./errors/handler')

const app = express()
const appPort = 3000
const validateJwt = false

app.get('/integrations/byteark/drm/encryption/key', function (request, response) {
  validateEncryptionKeyRequest(request, { validateJwt: validateJwt })
    .then(() => localFileBasedKeyManager.findOrCreateKey(request.query))
    .then((key) => response.send(key))
    .catch((error) => errorHandler(response, error))
})

app.get('/integrations/byteark/drm/playback/key', function (request, response) {
  validatePlaybackKeyRequest(request)
    .then(() => localFileBasedKeyManager.findKey(request.query))
    .then((key) => response.status(key ? 200 : 404).send(key))
    .catch((error) => errorHandler(response, error))
})

app.listen(appPort, '0.0.0.0', function () {
  console.log(`Key server is listening on port ${appPort}!`)
})
