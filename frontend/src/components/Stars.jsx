import React, { useState } from 'react';

export const Stars = ({ v }) => {
  if (v == null) return <span className="muted">Not rated</span>;
  const n = Math.round(v);
  return <span className="stars" aria-label={`${v} out of 5`}>{'★'.repeat(n)}{'☆'.repeat(5 - n)}<b>{v}</b></span>;
};

export function StarInput({ value, onChange }) {
  const [h, setH] = useState(0);
  return (
    <span className="sinput" onMouseLeave={() => setH(0)}>
      {[1, 2, 3, 4, 5].map(n => (
        <button type="button" key={n} aria-label={`${n} star`} className={n <= (h || value) ? 'on' : ''}
          onMouseEnter={() => setH(n)} onClick={() => onChange(n)}>★</button>))}
    </span>
  );
}
