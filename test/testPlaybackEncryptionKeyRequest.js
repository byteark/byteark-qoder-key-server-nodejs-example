let chai = require('chai')
let chaiHttp = require('chai-http')
let expect = chai.expect

let app = require('../app/index')

chai.use(chaiHttp)

describe('Playback encryption key request API', () => {
  before((done) => app.on('appStarted', done()))
  after(() => app.close())

  it('it should return 200 with key content, if request with valid token and the encryption key exists', (done) => {
    chai.request(app)
      .get('/integrations/byteark/drm/playback/key')
      .query({
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb250ZW50X2lkIjoiMSIsInRlY2giOiJobHMiLCJkZWZpbml0aW9uIjoiMjQwcCJ9.-7gEOKCAfsG-rdPYSy6tLoYraf2jn_bV2EEkROftXmQ'
      })
      .end((error, response) => {
        expect(response).to.have.status(200)
        expect(response).to.have.header('content-type', 'application/octet-stream')
        expect(response).to.have.header('content-length', 16)
        expect(response).to.have.header('cache-control', /private/)
        expect(response).to.have.header('cache-control', /no-cache/)
        expect(response).to.have.header('cache-control', /no-store/)
        done()
      })
  })

  it('it should return 403, if request with invalid request token', (done) => {
    chai.request(app)
      .get('/integrations/byteark/drm/playback/key')
      .query({
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb250ZW50X2lkIjoiMSIsInRlY2giOiJobHMiLCJkZWZpbml0aW9uIjoiMjQwcCJ9.-7gEOKCAfsG-rdPYSy6tLoYraf2jn_bV2EEkROftXmZ'
      })
      .end((error, response) => {
        expect(response).to.have.status(403)
        done()
      })
  })

  it('it should return 404, if request with valid token but the encryption key not exists', (done) => {
    chai.request(app)
      .get('/integrations/byteark/drm/playback/key')
      .query({
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb250ZW50X2lkIjoiMiIsInRlY2giOiJobHMiLCJkZWZpbml0aW9uIjoiMjQwcCJ9.vrRunfGDlrqgHEYCP-_Kg-BTzQJHwcHyBaiFkkY85pE'
      })
      .end((error, response) => {
        expect(response).to.have.status(404)
        done()
      })
  })
})
