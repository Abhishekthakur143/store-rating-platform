import React from 'react';
import PageHead from '../components/PageHead.jsx';
import { useApi } from '../api.js';

export default function AdminDashboard({ go }) {
  const [st] = useApi('/admin/stats', { users: 0, stores: 0, ratings: 0 });
  return (
    <>
      <PageHead title="Dashboard" sub="Totals across the platform." />
      <div className="statgrid">
        <div className="stat"><span className="chip">☺</span><b>{st.users}</b><span>Total users</span></div>
        <div className="stat"><span className="chip c2">⌂</span><b>{st.stores}</b><span>Total stores</span></div>
        <div className="stat"><span className="chip c3">★</span><b>{st.ratings}</b><span>Total ratings</span></div>
      </div>
      <div className="card"><h3>Quick actions</h3>
        <div className="actions"><button onClick={() => go('addUser')}>Add user</button><button onClick={() => go('addStore')}>Add store</button>
          <button className="ghost" onClick={() => go('users')}>View users</button><button className="ghost" onClick={() => go('stores')}>View stores</button></div></div>
    </>
  );
}
