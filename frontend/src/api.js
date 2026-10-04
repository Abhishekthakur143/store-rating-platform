import { useState, useEffect } from 'react';

const API = import.meta.env.VITE_API || 'http://localhost:5000/api';

export async function api(path, method = 'GET', body) {
  const r = await fetch(API + path, {
    method, body: body && JSON.stringify(body),
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + (localStorage.token || '') },
  });
  const d = await r.json().catch(() => ({}));
  if (r.status === 401 && localStorage.token) { localStorage.clear(); location.reload(); }
  if (!r.ok) throw new Error(d.error || 'Request failed');
  return d;
}

export function useApi(path, init) {
  const [d, setD] = useState(init);
  const load = () => api(path).then(setD).catch(() => {});
  useEffect(() => { load(); }, [path]);
  return [d, load];
}

// same rules hai backend
export function check(v) {
  if (v.name !== undefined && (v.name.length < 20 || v.name.length > 60)) return 'Name must be 20-60 characters';
  if (v.address && v.address.length > 400) return 'Address max 400 characters';
  if (v.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) return 'Invalid email';
  if (v.password !== undefined && !/^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,16}$/.test(v.password))
    return 'Password: 8-16 chars, one uppercase letter, one special character';
}
