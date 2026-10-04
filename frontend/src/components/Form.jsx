import React, { useState } from 'react';
import { check } from '../api.js';

export const F = {
  name: { k: 'name', label: 'Full name (20-60 characters)' },
  email: { k: 'email', label: 'Email', type: 'email' },
  address: { k: 'address', label: 'Address (max 400)', req: false },
  password: { k: 'password', label: 'Password', type: 'password' },
};

export default function Form({ fields, onSubmit, label, noCheck }) {
  const [v, setV] = useState({}); const [msg, setMsg] = useState(null);
  const submit = async e => {
    e.preventDefault();
    const m = noCheck ? null : check(v);
    if (m) return setMsg({ err: m });
    try { await onSubmit(v); setV({}); setMsg({ ok: 'Done' }); } catch (x) { setMsg({ err: x.message }); }
  };
  return (
    <form onSubmit={submit}>
      {fields.map(f => (
        <label key={f.k}>{f.label}
          {f.opts
            ? <select value={v[f.k] || f.opts[0]} onChange={e => setV({ ...v, [f.k]: e.target.value })}>{f.opts.map(o => <option key={o}>{o}</option>)}</select>
            : <input type={f.type || 'text'} required={f.req !== false} value={v[f.k] || ''} onChange={e => setV({ ...v, [f.k]: e.target.value })} />}
        </label>
      ))}
      <button>{label}</button>
      {msg && <p className={'msg ' + (msg.err ? 'err' : 'ok')}>{msg.err || msg.ok}</p>}
    </form>
  );
}
