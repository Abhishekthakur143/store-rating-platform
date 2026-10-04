import React from 'react';
import PageHead from '../components/PageHead.jsx';
import Table from '../components/Table.jsx';
import { Stars } from '../components/Stars.jsx';
import { useApi } from '../api.js';

export default function OwnerDashboard() {
  const [d] = useApi('/owner/dashboard', { average: null, raters: [] });
  return (
    <>
      <PageHead title="Dashboard" sub="How users rate your store." />
      <div className="statgrid">
        <div className="stat"><span className="chip c3">★</span><b>{d.average ?? '—'}</b><span>Average rating (out of 5)</span></div>
        <div className="stat"><span className="chip c2">☺</span><b>{d.raters.length}</b><span>Total ratings</span></div>
      </div>
      <div className="card"><h3>Users who rated your store</h3>
        <Table rows={d.raters} cols={[{ k: 'name', h: 'Name' }, { k: 'email', h: 'Email' }, { k: 'store', h: 'Store' }, { k: 'rating', h: 'Rating', r: r => <Stars v={r.rating} /> }]} /></div>
    </>
  );
}
