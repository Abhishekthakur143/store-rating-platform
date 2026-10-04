import React from 'react';
import AuthLayout from '../components/AuthLayout.jsx';
import Form, { F } from '../components/Form.jsx';
import { api } from '../api.js';

export default function Login({ onLogin, go }) {
  return (
    <AuthLayout title="Welcome back" sub="Log in to continue." altText="New here?" altLabel="Create an account" onAlt={() => go('signup')}>
      <Form label="Log in" noCheck fields={[F.email, F.password]} onSubmit={async v => onLogin(await api('/auth/login', 'POST', v))} />
    </AuthLayout>
  );
}
