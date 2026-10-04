require('dotenv').config();
const express = require('express'), cors = require('cors'), bcrypt = require('bcrypt'), jwt = require('jsonwebtoken'), { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const q = (t, p) => pool.query(t, p);
const SECRET = process.env.JWT_SECRET || 'dev-secret';
const app = express();
app.use(cors(), express.json());

const wrap = f => (req, res, next) => f(req, res, next).catch(next);
const like = v => `%${v || ''}%`;
const AVG = 'ROUND(AVG(r.rating),1)::float';

// ---- validation (matches the spec) ----
function validate({ name, email, address, password }) {
  const e = [];
  if (name !== undefined && (name.length < 20 || name.length > 60)) e.push('Name must be 20-60 characters');
  if (address !== undefined && address.length > 400) e.push('Address max 400 characters');
  if (email !== undefined && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.push('Invalid email');
  if (password !== undefined && !/^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/.test(password))
    e.push('Password must be 8-16 chars with one uppercase letter and one special character');
  return e;
}
const bad = (res, msg) => res.status(400).json({ error: msg });

// ---- auth middleware ----
const auth = (...roles) => (req, res, next) => {
  try {
    const u = jwt.verify((req.headers.authorization || '').slice(7), SECRET);
    if (roles.length && !roles.includes(u.role)) return res.status(403).json({ error: 'Forbidden' });
    req.user = u; next();
  } catch { res.status(401).json({ error: 'Unauthorized' }); }
};

async function createUser(b, role) {
  if (!b.name || !b.email || !b.password) return { e: 'Name, email and password are required' };
  const e = validate(b);
  if (e.length) return { e: e.join('; ') };
  try {
    const r = await q(
      'INSERT INTO users(name,email,address,password_hash,role) VALUES($1,$2,$3,$4,$5) RETURNING id,name,email,address,role',
      [b.name, b.email.toLowerCase(), b.address || '', await bcrypt.hash(b.password, 10), role]);
    return { u: r.rows[0] };
  } catch (x) { if (x.code === '23505') return { e: 'Email already exists' }; throw x; }
}

// ---- auth routes (single login for all roles) ----
app.post('/api/auth/signup', wrap(async (req, res) => {
  const { u, e } = await createUser(req.body, 'user');
  if (e) return bad(res, e);
  res.status(201).json(u);
}));
app.post('/api/auth/login', wrap(async (req, res) => {
  const { email = '', password = '' } = req.body;
  const r = await q('SELECT * FROM users WHERE email=$1', [email.toLowerCase()]);
  const u = r.rows[0];
  if (!u || !(await bcrypt.compare(password, u.password_hash))) return res.status(401).json({ error: 'Invalid email or password' });
  const user = { id: u.id, name: u.name, email: u.email, role: u.role };
  res.json({ token: jwt.sign(user, SECRET, { expiresIn: '8h' }), user });
}));
app.put('/api/auth/password', auth(), wrap(async (req, res) => {
  const { current, password } = req.body;
  const e = validate({ password });
  if (e.length) return bad(res, e.join('; '));
  const r = await q('SELECT password_hash FROM users WHERE id=$1', [req.user.id]);
  if (!(await bcrypt.compare(current || '', r.rows[0].password_hash))) return bad(res, 'Current password is wrong');
  await q('UPDATE users SET password_hash=$1 WHERE id=$2', [await bcrypt.hash(password, 10), req.user.id]);
  res.json({ ok: true });
}));

// ---- system administrator ----
const admin = auth('admin');
app.get('/api/admin/stats', admin, wrap(async (_, res) => {
  const r = await q('SELECT (SELECT COUNT(*) FROM users)::int users,(SELECT COUNT(*) FROM stores)::int stores,(SELECT COUNT(*) FROM ratings)::int ratings');
  res.json(r.rows[0]);
}));
app.post('/api/admin/users', admin, wrap(async (req, res) => {
  const role = ['admin', 'user', 'owner'].includes(req.body.role) ? req.body.role : 'user';
  const { u, e } = await createUser(req.body, role);
  if (e) return bad(res, e);
  res.status(201).json(u);
}));
app.post('/api/admin/stores', admin, wrap(async (req, res) => {
  const { name, email, address = '', ownerEmail } = req.body;
  if (!name || !email) return bad(res, 'Store name and email are required');
  const e = validate({ email, address });
  if (name.length < 20 || name.length > 60) e.push('Store name must be between 20 and 60 characters');
  if (e.length) return bad(res, e.join('; '));
  let ownerId = null;
  if (ownerEmail) {
    const o = await q("SELECT id FROM users WHERE email=$1 AND role='owner'", [ownerEmail.toLowerCase()]);
    if (!o.rows[0]) return bad(res, 'No store owner found with that email');
    ownerId = o.rows[0].id;
  }
  try {
    const r = await q('INSERT INTO stores(name,email,address,owner_id) VALUES($1,$2,$3,$4) RETURNING id,name,email,address',
      [name, email.toLowerCase(), address, ownerId]);
    res.status(201).json(r.rows[0]);
  } catch (x) { if (x.code === '23505') return bad(res, 'Store email already exists'); throw x; }
}));
app.get('/api/admin/users', admin, wrap(async (req, res) => {
  const { name, email, address, role = '' } = req.query;
  const r = await q(
    `SELECT u.id,u.name,u.email,u.address,u.role,
       CASE WHEN u.role='owner' THEN (SELECT ${AVG} FROM ratings r JOIN stores s ON s.id=r.store_id WHERE s.owner_id=u.id) END AS rating
     FROM users u WHERE u.name ILIKE $1 AND u.email ILIKE $2 AND u.address ILIKE $3 AND ($4='' OR u.role=$4) ORDER BY u.name`,
    [like(name), like(email), like(address), role]);
  res.json(r.rows);
}));
app.get('/api/admin/stores', admin, wrap(async (req, res) => {
  const { name, email, address } = req.query;
  const r = await q(
    `SELECT s.id,s.name,s.email,s.address,${AVG} AS rating FROM stores s LEFT JOIN ratings r ON r.store_id=s.id
     WHERE s.name ILIKE $1 AND s.email ILIKE $2 AND s.address ILIKE $3 GROUP BY s.id ORDER BY s.name`,
    [like(name), like(email), like(address)]);
  res.json(r.rows);
}));

// ---- normal user ----
app.get('/api/stores', auth('user'), wrap(async (req, res) => {
  const r = await q(
    `SELECT s.id,s.name,s.address,${AVG} AS rating, MAX(CASE WHEN r.user_id=$1 THEN r.rating END) AS my_rating
     FROM stores s LEFT JOIN ratings r ON r.store_id=s.id
     WHERE s.name ILIKE $2 OR s.address ILIKE $2 GROUP BY s.id ORDER BY s.name`,
    [req.user.id, like(req.query.search)]);
  res.json(r.rows);
}));
app.put('/api/stores/:id/rating', auth('user'), wrap(async (req, res) => {
  const rating = Number(req.body.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return bad(res, 'Rating must be between 1 and 5');
  try {
    await q(`INSERT INTO ratings(user_id,store_id,rating) VALUES($1,$2,$3)
             ON CONFLICT (user_id,store_id) DO UPDATE SET rating=EXCLUDED.rating, updated_at=now()`,
      [req.user.id, req.params.id, rating]);
  } catch (x) { if (x.code === '23503') return res.status(404).json({ error: 'Store not found' }); throw x; }
  res.json({ ok: true });
}));

// ---- store owner ----
app.get('/api/owner/dashboard', auth('owner'), wrap(async (req, res) => {
  const avg = await q(`SELECT ${AVG} AS average FROM ratings r JOIN stores s ON s.id=r.store_id WHERE s.owner_id=$1`, [req.user.id]);
  const raters = await q(
    `SELECT r.id,u.name,u.email,s.name AS store,r.rating,r.updated_at FROM ratings r
     JOIN users u ON u.id=r.user_id JOIN stores s ON s.id=r.store_id WHERE s.owner_id=$1`, [req.user.id]);
  res.json({ average: avg.rows[0].average, raters: raters.rows });
}));

app.use((err, _req, res, _next) => { console.error(err); res.status(500).json({ error: 'Server error' }); });
app.listen(process.env.PORT || 5000, () => console.log('API running'));
