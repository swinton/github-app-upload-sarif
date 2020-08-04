const { promisify } = require('util');

const { createGzip } = require('zlib');
const { pipeline } = require('stream');
const pipe = promisify(pipeline);

const { Base64Encode } = require('base64-stream');

async function encode(opts) {
  const { input = process.stdin, output = process.stdout } = opts;

  // Pipe input through Gzip, Base-64 streams
  await pipe(
    input,
    createGzip(),
    new Base64Encode(),
    output
  );

  return output;
}

module.exports = { encode };

if (require.main === module) {
  (async () => {
    await encode({ output: process.stdout });
  })();
}
