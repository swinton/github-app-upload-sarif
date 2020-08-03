const { promisify } = require('util');

const { createGzip } = require('zlib');
const { pipeline } = require('stream');
const pipe = promisify(pipeline);

const {Base64Encode} = require('base64-stream');
const streams = require('memory-streams');

async function encode(input) {
  const output = new streams.WritableStream();

  // Pipe input through Gzip, Base-64 streams
  await pipe(
    input,
    createGzip(),
    new Base64Encode(),
    output
  );

  return output.toString();
}

module.exports = { encode };

if (require.main === module) {
  (async () => {
    const output = await encode(process.stdin);
    console.log(output);
  })();
}
