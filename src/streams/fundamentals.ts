// process.stdin
//   .pipe(process.stdout)

import { Readable, Writable, Transform, TransformCallback } from 'node:stream'

class OneToHundredStream extends Readable {
  index = 1;
  _read() {
    const i = this.index++;

    setTimeout(() => {
      if (i > 100) {
        this.push(null);
      } else {
        this.push(Buffer.from(String(i)));
      }
    }, 1000);
  }
}

class InverseSignNumberStream extends Transform {
  _transform(chunk: any, encoding: BufferEncoding, callback: TransformCallback) {
    const transformed = String(Number(chunk.toString()) * -1);
    callback(null, Buffer.from(transformed));
  }
}
class MultiplyByTenStream extends Writable {
  _write(chunk: any, encoding: BufferEncoding, callback: (error?: Error | null) => void) {
    console.log(Number(chunk.toString()) * 10);
    callback();
  }
}

new OneToHundredStream()
  .pipe(new InverseSignNumberStream())
  .pipe(new MultiplyByTenStream());