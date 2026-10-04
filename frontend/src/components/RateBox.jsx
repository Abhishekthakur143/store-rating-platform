import React, { useState } from 'react';
import { api } from '../api.js';
import { StarInput } from './Stars.jsx';

export default function RateBox({ s, reload }) {
  const [v, setV] = useState(s.my_rating || 0); const [err, setErr] = useState('');
  const save = async () => {
    if (!v) return setErr('Pick 1 to 5 stars');
    try { await api(`/stores/${s.id}/rating`, 'PUT', { rating: v }); setErr(''); reload(); } catch (e) { setErr(e.message); }
  };
  return (
    <div className="ratebox">
      <StarInput value={v} onChange={setV} />
      <button onClick={save}>{s.my_rating ? 'Modify rating' : 'Submit rating'}</button>
      {err && <span className="err">{err}</span>}
    </div>
  );
}
