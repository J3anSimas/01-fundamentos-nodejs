import http, { IncomingMessage } from 'node:http'
import { Database } from './database';
import { routes } from './routes';

const database = new Database();
let id = 0;
const server = http.createServer(async (req, res) => {
    const { method, url } = req

    if (!url)
        return res.writeHead(404).end()


    const route = routes.find(route => {
        return route.method === method && route.path.test(url)
    })
    if (!route)
        return res.writeHead(404).end()
    const newReq: IncomingMessage & { [key: string]: any; } = req;
    const routeParams = url.match(route.path)
    newReq.params = { ...routeParams?.groups }

    return route.handler(newReq, res)
})

server.listen(3333)
