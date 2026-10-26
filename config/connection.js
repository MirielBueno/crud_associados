import mysql from 'mysql2/promise'

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'clube',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

export default async function connect() {
    try {
        const connection = await pool.getConnection()
        connection.release()
        return pool
    } catch (e) {
        console.error('Erro ao conectar ao banco:', e)
        throw e
    }
}