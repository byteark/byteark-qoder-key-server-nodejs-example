const ForbiddenError = require('./ForbiddenError')
const ValidationError = require('./ValidationError')

function errorHandler(res, error) {
  if (error instanceof ValidationError) {
    return res.status(400).send({
      error: 'Invalid Request',
      payload: {
        message: error.message,
      },
    })
  } else if (error instanceof ForbiddenError) {
    return res.status(403).send({
      error: 'Forbidden Request',
      payload: {
        message: error.message,
      },
    })
  }

  console.error(error)
  return res.status(500).send({
    error: 'Internal Server Error',
    payload: error,
  })
}

module.exports = errorHandler
