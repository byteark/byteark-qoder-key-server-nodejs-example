const fs = require('fs')
const jwt = require('jsonwebtoken')
const ForbiddenError = require('../errors/ForbiddenError')
const ValidationError = require('../errors/ValidationError')

function validateRequestPayload(requestPayload) {
  if (!requestPayload.content_id) {
    throw new ValidationError('content_id field is missing')
  }
  if (!requestPayload.tech) {
    throw new ValidationError('tech field is missing')
  }
  if (!requestPayload.definition) {
    throw new ValidationError('definition field is missing')
  }
  return requestPayload
}

function decodeAndValidateRequestToken(token, tokenSecret) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, tokenSecret, (error, requestPayload) => {
      error ? reject(new ForbiddenError(error.message)) : resolve(requestPayload)
    })
  })
}

function validateRequest(token, tokenSecret) {
  if (!token) {
    return Promise.reject(new ValidationError('token is required'))
  }

  return decodeAndValidateRequestToken(token, tokenSecret)
    .then((requestPayload) => validateRequestPayload(requestPayload))
}

module.exports = validateRequest
