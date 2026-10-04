import React from 'react';
import PageHead from '../components/PageHead.jsx';
import Tips from '../components/Tips.jsx';
import Form, { F } from '../components/Form.jsx';
import { api } from '../api.js';

export default function Account() {
  return (
    <>
      <PageHead title="Account" sub="Update your password." />
      <div className="two">
        <div className="card"><Form label="Update password" fields={[{ k: 'current', label: 'Current password', type: 'password' }, { ...F.password, label: 'New password' }]} onSubmit={v => api('/auth/password', 'PUT', v)} /></div>
        <Tips title="Password rules" items={['8 to 16 characters', 'At least one uppercase letter', 'At least one special character']} />
      </div>
    </>
  );
}
