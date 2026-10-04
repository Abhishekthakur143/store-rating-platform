import React from 'react';
import PageHead from '../components/PageHead.jsx';
import Tips from '../components/Tips.jsx';
import Form, { F } from '../components/Form.jsx';
import { api } from '../api.js';

export default function AddStore() {
  return (
    <>
      <PageHead title="Add store" sub="Register a store and optionally link it to its owner." />
      <div className="two">
        <div className="card"><Form label="Add store" fields={[{ k: 'name', label: 'Store name' }, F.email, F.address, { k: 'ownerEmail', label: 'Owner email (optional)', type: 'email', req: false }]} onSubmit={v => api('/admin/stores', 'POST', v)} /></div>
        <Tips title="Tips" items={['Owner email must belong to an existing store owner', 'Store email must be unique', 'Leave owner empty to assign later']} />
      </div>
    </>
  );
}
