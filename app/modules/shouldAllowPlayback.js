const ForbiddenError = require('../errors/ForbiddenError')

function shouldAllowPlayback(request, shouldAllowPlayback) {
  // You may check and reject, if user should be able to play here
  if (false) {
    return Promise.reject(new ForbiddenError('You may not watch this content'))
  }

  return Promise.resolve(shouldAllowPlayback)
}

module.exports = shouldAllowPlayback
