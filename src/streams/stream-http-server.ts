import http from "node:http";
import { Transform, TransformCallback } from "node:stream";

class InverseSignNumberStream extends Transform {
  _transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback) {
    const transformed = String(Number(chunk.toString()) * -1);
    console.log(transformed);
    callback(null, Buffer.from(transformed));
  }
}
const server = http.createServer(async (req, res) => {
  const buffers: Buffer[] = []

  for await (const chunk of req) {
    buffers.push(chunk)
  }
  const fullStreamContent = Buffer.concat(buffers).toString()
  console.log(fullStreamContent)
  return res.end(fullStreamContent)
  // return req.pipe(new InverseSignNumberStream()).pipe(res)
})

server.listen(3334)