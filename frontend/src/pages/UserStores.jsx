import React, { useState, useMemo } from 'react';
import PageHead from '../components/PageHead.jsx';
import RateBox from '../components/RateBox.jsx';
import { Stars } from '../components/Stars.jsx';
import { useApi } from '../api.js';

const hue = n => [...n].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;

export default function UserStores() {
  const [search, setSearch] = useState(''); const [sort, setSort] = useState('name');
  const [rows, reload] = useApi('/stores?search=' + encodeURIComponent(search), []);
  const list = useMemo(() => [...rows].sort((a, b) =>
    sort === 'name' ? a.name.localeCompare(b.name) : sort === 'nameDesc' ? b.name.localeCompare(a.name)
    : sort === 'high' ? (b.rating ?? 0) - (a.rating ?? 0) : (a.rating ?? 6) - (b.rating ?? 6)), [rows, sort]);
  return (
    <>
      <PageHead title="Stores" sub="Search for a store and rate it from 1 to 5. You can change your rating any time." />
      <div className="toolbar card">
        <input placeholder="Search by store name or address" value={search} onChange={e => setSearch(e.target.value)} />
        <select value={sort} onChange={e => setSort(e.target.value)}>
          <option value="name">Name A to Z</option><option value="nameDesc">Name Z to A</option>
          <option value="high">Highest rated</option><option value="low">Lowest rated</option>
        </select>
      </div>
      {!list.length ? <div className="card empty">No stores found. Try a different search.</div> : (
        <div className="cards">{list.map(s => (
          <div className="store card" key={s.id}>
            <div className="avatar" style={{ background: `hsl(${hue(s.name)} 55% 90%)`, color: `hsl(${hue(s.name)} 60% 30%)` }}>{s.name[0]}</div>
            <h3>{s.name}</h3><p className="muted">{s.address || 'No address'}</p>
            <div className="rows"><span>Overall</span><Stars v={s.rating} /></div>
            <div className="rows"><span>Your rating</span><Stars v={s.my_rating} /></div>
            <RateBox key={s.id + '-' + s.my_rating} s={s} reload={reload} />
          </div>))}
        </div>)}
    </>
  );
}
