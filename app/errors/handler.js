const ValidationError = require('./ValidationError')

function errorHandler(res, error) {
  console.error(error)
  if (error instanceof ValidationError) {
    return res.status(400).send({
      error: 'Invalid Request',
      payload: {
        message: error.message,
      },
    })
  }
  return res.status(500).send({
    error: 'Internal Server Error',
    payload: error,
  })
}

module.exports = errorHandler
