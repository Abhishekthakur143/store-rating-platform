import React from 'react';
import PageHead from '../components/PageHead.jsx';
import Filtered from '../components/Filtered.jsx';
import { Stars } from '../components/Stars.jsx';

export default function AdminUsers() {
  return (
    <>
      <PageHead title="Users" sub="Filter by name, email, address or role. Click a column to sort and a row for details." />
      <Filtered role path="/admin/users" cols={[
        { k: 'name', h: 'Name' }, { k: 'email', h: 'Email' }, { k: 'address', h: 'Address' },
        { k: 'role', h: 'Role', r: r => <span className={'pill ' + r.role}>{r.role}</span> },
        { k: 'rating', h: 'Rating (owners)', r: r => r.rating == null ? '—' : <Stars v={r.rating} /> }]} />
    </>
  );
}
