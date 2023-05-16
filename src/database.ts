import fs from "fs/promises";
import path from "path";
import { randomUUID } from 'crypto'
type User = {
    id?: string,
    name: string,
    email: string
}
type TDatabase = {
    users: User[] | undefined
}
const dbPath = path.join(__dirname, '..', 'db.json')

export class Database {
    private database: TDatabase = {
        users: []
    }
    constructor() {
        fs.readFile(dbPath, 'utf-8').then(data => {
            this.database = JSON.parse(data);
        }).catch(() => {
            this.persist();
        })
    }
    private persist() {
        fs.writeFile(dbPath, JSON.stringify(this.database));
    }
    select(table: string) {
        if (table.toUpperCase() === 'users'.toUpperCase()) {
            return this.database['users']
        }
        return []
    }
    insert(table: string, data: User) {
        if (table.toUpperCase() === 'users'.toUpperCase()) {
            this.database.users?.push({
                id: randomUUID(),
                ...data
            })
        }
        this.persist();
        return data
    }
    delete(table: string, id: string | number) {
        if (table === 'users') {
            const rowIndex = this.database['users']?.findIndex(row => row.id === id)
            if (Number(rowIndex) > -1) {
                console.log(this.database)
                this.database[table]?.splice(Number(rowIndex), 1);
                console.log(this.database)

            }
            console.log(`Removendo index ${id} na tabela ${table} | linha: ${rowIndex}`)
        }
        this.persist()
    }
}