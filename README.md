# Sample Key Server for Clear Key video encrpytion

## Requirements

* NodeJS 8+

## Installation

Install all dependencies by running:

    npm install

## Running

Running this command to start the server at port 3000:

    npm run start

or run it via docker

    docker run -d -p 3000:3000 -v /path/to/storage/keys:/home/node/storage/keys --name byteark-keyserver byteark/byteark-qoder-key-server-sample

## Testing

You may run the tests with

    npm run test

## Implementation Details

This key server has 2 routes:

For implementation details, you may see [Documentation about encryption intergration](https://docs.byteark.com/article/qoder-clear-key/)
