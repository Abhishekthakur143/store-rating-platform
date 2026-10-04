require('dotenv').config();
const bcrypt = require('bcrypt'), { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
(async () => {
  await pool.query(
    `INSERT INTO users(name,email,address,password_hash,role) VALUES($1,$2,$3,$4,'admin') ON CONFLICT (email) DO NOTHING`,
    ['System Administrator Account', 'admin@example.com', 'Head Office', await bcrypt.hash('Admin@123', 10)]);
  console.log('Admin ready -> admin@example.com / Admin@123');
  await pool.end();
})();
