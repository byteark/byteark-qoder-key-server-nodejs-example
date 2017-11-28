function responseEncryptionKey(response, encryptionKey) {
  if (!encryptionKey) {
    return response.status(404).send(encryptionKey)
  }

  return response.status(200)
    .set('Content-Type', 'application/octet-stream')
    .set('Cache-Control', 'private, no-cache, no-store')
    .send(encryptionKey)
}

module.exports = responseEncryptionKey
