import React, { useState } from 'react';
import { useApi } from '../api.js';
import Table from './Table.jsx';

export default function Filtered({ path, cols, role }) {
  const [f, setF] = useState({ name: '', email: '', address: '', role: '' });
  const [sel, setSel] = useState(null);
  const [rows] = useApi(path + '?' + new URLSearchParams(f), []);
  const set = k => e => setF({ ...f, [k]: e.target.value });
  return (
    <>
      <div className="card filters">
        {['name', 'email', 'address'].map(k => <input key={k} placeholder={'Filter by ' + k} value={f[k]} onChange={set(k)} />)}
        {role && <select value={f.role} onChange={set('role')}><option value="">All roles</option><option value="admin">admin</option><option value="user">user</option><option value="owner">owner</option></select>}
      </div>
      <div className="card"><Table rows={rows} cols={cols} onRow={setSel} /></div>
      {sel && <div className="card detail"><h3>Details</h3>{Object.entries(sel).filter(([k]) => k !== 'id').map(([k, v]) => <div key={k}><span className="muted">{k}</span><b>{String(v ?? '—')}</b></div>)}</div>}
    </>
  );
}
