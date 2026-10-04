import React, { useState, useMemo } from 'react';

export default function Table({ cols, rows, onRow }) {
  const [s, setS] = useState({ k: cols[0].k, asc: true });
  const sorted = useMemo(() => [...rows].sort((a, b) => {
    const x = a[s.k] ?? '', y = b[s.k] ?? '';
    const c = typeof x === 'number' && typeof y === 'number' ? x - y : String(x).localeCompare(String(y));
    return s.asc ? c : -c;
  }), [rows, s]);
  if (!rows.length) return <p className="empty">No records found.</p>;
  return (
    <div className="tw"><table>
      <thead><tr>{cols.map(c => (
        <th key={c.k} tabIndex={0} onClick={() => setS({ k: c.k, asc: s.k === c.k ? !s.asc : true })}>
          {c.h}{s.k === c.k ? (s.asc ? ' ▲' : ' ▼') : ''}</th>))}</tr></thead>
      <tbody>{sorted.map(r => (
        <tr key={r.id} onClick={() => onRow && onRow(r)}>{cols.map(c => <td key={c.k}>{c.r ? c.r(r) : r[c.k] ?? '—'}</td>)}</tr>))}</tbody>
    </table></div>
  );
}
