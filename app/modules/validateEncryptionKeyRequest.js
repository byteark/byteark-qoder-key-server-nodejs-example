const fs = require('fs')
const jwt = require('jsonwebtoken')
const ValidationError = require('../errors/ValidationError')

const cert = fs.readFileSync('./resources/keys/byteark-qoder-encryption-key-exchanger-public.pem');

function validateWithGeneralRules(request) {
  if (!request.query.video_key) {
    throw new ValidationError('video_key field is missing')
  }
  if (request.query.video_key.length < 6) {
    throw new ValidationError('video_key field is too short')
  }
  if (!request.query.tech) {
    throw new ValidationError('tech field is missing')
  }
  if (!request.query.definition) {
    throw new ValidationError('definition field is missing')
  }
}

function makeExpectedJwtClaims(request) {
  return {
    video_key: request.query.video_key,
    tech: request.query.tech,
    definition: request.query.definition,
  }
}

function validateWithJwt(request) {
  return new Promise((resolve, reject) => {
    jwt.verify(request.query.signature, cert, makeExpectedJwtClaims(request), (error, decoded) => {
      error ? reject(new ValidationError(error.message)) : resolve(decoded)
    })
  })
}

function validateRequest(request, options = {}) {
  options = options || {
    validateJwt: false
  };

  validateWithGeneralRules(request)

  if (options.validateJwt) {
    return validateWithJwt(request)
  } else {
    return Promise.resolve(request)
  }
}

module.exports = validateRequest
