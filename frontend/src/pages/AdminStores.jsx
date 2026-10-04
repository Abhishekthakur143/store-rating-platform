import React from 'react';
import PageHead from '../components/PageHead.jsx';
import Filtered from '../components/Filtered.jsx';
import { Stars } from '../components/Stars.jsx';

export default function AdminStores() {
  return (
    <>
      <PageHead title="Stores" sub="All registered stores with their average rating." />
      <Filtered path="/admin/stores" cols={[
        { k: 'name', h: 'Name' }, { k: 'email', h: 'Email' }, { k: 'address', h: 'Address' },
        { k: 'rating', h: 'Rating', r: r => <Stars v={r.rating} /> }]} />
    </>
  );
}
