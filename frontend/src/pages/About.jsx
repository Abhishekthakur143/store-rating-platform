import React from 'react';
import PageHead from '../components/PageHead.jsx';

export default function About() {
  const rules = [['Name', '20 to 60 characters'], ['Address', 'Up to 400 characters'], ['Password', '8 to 16 characters, one uppercase letter, one special character'], ['Email', 'Standard email format'], ['Rating', 'Whole number from 1 to 5']];
  return (
    <>
      <PageHead title="How it works" sub="Everything about the platform in one place." />
      <div className="grid3">
        <div className="card"><h3>One login</h3><p>Every role uses the same login page. After login you see the screens for your role.</p></div>
        <div className="card"><h3>Roles</h3><p>Admin, normal user and store owner. Owners and extra admins are created by an admin. Public sign up always creates a normal user.</p></div>
        <div className="card"><h3>Tech stack</h3><p>React (Vite), Express REST API, PostgreSQL, JWT authentication, bcrypt password hashing.</p></div>
      </div>
      <div className="card"><h3>Form rules</h3>
        <div className="tw"><table><tbody>{rules.map(([a, b]) => <tr key={a}><th>{a}</th><td>{b}</td></tr>)}</tbody></table></div></div>
    </>
  );
}
