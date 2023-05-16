import { Readable } from "stream";

class OneToHundredStream extends Readable {
  [x: string]: any;
  index = 1;
  _read() {
    const i = this.index++;

    setTimeout(() => {
      if (i > 5) {
        this.push(null);
      } else {
        this.push(Buffer.from(String(i)));
      }
    }, 1000);
  }
}
const oneToHundred = new OneToHundredStream();
const stream = Readable.from(oneToHundred);

fetch('http://localhost:3334', {
  method: 'POST',
  body: stream as unknown as BodyInit,
  headers: {
    'Content-Type': 'text/plain'
  }

}).then(response => {
  return response.text()
}).then(data => {
  console.log('Retornou:', data)
})
