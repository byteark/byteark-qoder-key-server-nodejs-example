# Sample Key Server for Clear Key video encrpytion

## Requirements

* NodeJS 8+

## Installation

Install all dependencies by running:

    npm install

## Running

Running this command to start the server at port 3000:

    npm run start

## Implementation Details

### Encryption key endpoint

This endpoint will be used for ByteArk Qoder to response the key to encrypt your content.

You also have to store the responsed key somewhere, so you can response the same key for playback later
when the player request with the same `content_id` and `tech` and `definition`.

In this example, the keys will be stored locally as files in the `storage/keys` directory
(see `app/modules/localFileBasedKeyManager.js` for implementation details).
You may change this to store into your database or somewhere you want.

Endpoint:

    GET /integrations/byteark/drm/encryption/key

Query string parameters:

Endpoint:

* `content_id`: Video key from ByteArk Qoder
* `tech`: will be `hls`
* `definition`: Definition of the video (such as `480p`, `720p`)
* `signature`: The [JWT](https://jwt.io/) token that you may verify to ensure that the request are actually from ByteArk Qoder

### Playback key endpoint

This endpoint will be used for your video player to response the matched key to your viewers.

You may also checking for permission of the viewer and decide to not response the key if they have not.
In this example, the key will always be responsed
(see `app/modules/validatePlaybackKeyRequest.js` for implementation details).

Endpoint:

    GET /integrations/byteark/drm/playback/key

Query string parameters:

* `content_id`: Video key from ByteArk Qoder
* `tech`: will be `hls`
* `definition`: Definition of the video (such as 480p, 720p)

### Expected JWT Claims

The JWT token from ByteArk Qoder are expected to have valid JWT token (not expired)
and contains these extra claims that matched with the values in the query string

```
{
    "content_id": "your_content_id",
    "tech": "hls",
    "definition": "720p"
}
```

See `app/modules/validateEncryptionKeyRequest.js` for implementation details.
