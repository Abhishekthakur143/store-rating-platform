import React from 'react';
import AuthLayout from '../components/AuthLayout.jsx';
import Form, { F } from '../components/Form.jsx';
import { api } from '../api.js';

export default function Signup({ onLogin, go }) {
  return (
    <AuthLayout title="Create your account" sub="Takes less than a minute." altText="Already have an account?" altLabel="Log in" onAlt={() => go('login')}>
      <Form label="Sign up" fields={[F.name, F.email, F.address, F.password]}
        onSubmit={async v => { await api('/auth/signup', 'POST', v); onLogin(await api('/auth/login', 'POST', v)); }} />
    </AuthLayout>
  );
}
