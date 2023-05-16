import http from 'node:http'
import { Writable } from "stream"
import { Database } from './database';
import { buildRoutePath } from './utils/build-route-path'
const database = new Database();
type Route = {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    path: RegExp,
    handler: (req: http.IncomingMessage & { [key: string]: any; }, res: http.ServerResponse<http.IncomingMessage> & {
        req: http.IncomingMessage
    }) => Promise<Writable | void>
}
export const routes: Route[] = [
    {
        method: 'GET',
        path: buildRoutePath('/users'),
        handler: async (req, res) => {
            const users = database.select('users')
            return res.end(JSON.stringify(users));
        }
    },
    {
        method: 'POST',
        path: buildRoutePath('/users'),
        handler: async (req, res) => {
            const buffers: Buffer[] = []

            for await (const chunk of req) {
                buffers.push(chunk)
            }
            const fullStreamContent = Buffer.concat(buffers).toString()
            let body
            if (fullStreamContent != '') {
                body = JSON.parse(fullStreamContent);
            } else {
                body = {}
            }
            const { name, email } = body;
            database.insert('users', {
                name,
                email
            })
            return res.writeHead(201).end()
        },

    },
    {
        method: 'DELETE',
        path: buildRoutePath('/users/:id'),
        handler: async (req, res) => {
            const { id } = req.params
            database.delete('users', id)
            return res.writeHead(204).end('delete')
        }
    }

]