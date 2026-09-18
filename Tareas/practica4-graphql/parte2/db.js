const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sistema_pedidos',
  connectionLimit: 10,
});

let contador = 0;
async function q(sql, params = []) {
  contador++;
  console.log(`[SQL ${contador}] ${sql.replace(/\s+/g, ' ').trim()}`);
  const [rows] = await pool.query(sql, params);
  return rows;
}

module.exports = { q };