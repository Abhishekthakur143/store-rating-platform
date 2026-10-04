import React from 'react';
import PageHead from '../components/PageHead.jsx';
import Tips from '../components/Tips.jsx';
import Form, { F } from '../components/Form.jsx';
import { api } from '../api.js';

export default function AddUser() {
  return (
    <>
      <PageHead title="Add user" sub="Create a normal user, a store owner or another admin." />
      <div className="two">
        <div className="card"><Form label="Add user" fields={[F.name, F.email, F.address, F.password, { k: 'role', label: 'Role', opts: ['user', 'admin', 'owner'] }]} onSubmit={v => api('/admin/users', 'POST', { role: 'user', ...v })} /></div>
        <Tips title="Rules" items={['Name: 20 to 60 characters', 'Address: up to 400 characters', 'Password: 8 to 16 characters, one uppercase letter, one special character', 'Create a store owner here first, then assign them a store']} />
      </div>
    </>
  );
}
