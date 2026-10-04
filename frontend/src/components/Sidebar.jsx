import React from 'react';

export const NAV = {
  admin: [['dash', 'Dashboard', '▦'], ['users', 'Users', '☺'], ['stores', 'Stores', '⌂'], ['addUser', 'Add user', '＋'], ['addStore', 'Add store', '＋'], ['account', 'Account', '⚙']],
  owner: [['dash', 'Dashboard', '▦'], ['account', 'Account', '⚙']],
  user: [['stores', 'Stores', '⌂'], ['account', 'Account', '⚙']],
};

export default function Sidebar({ role, view, setView }) {
  return (
    <aside className="side">
      {NAV[role].map(([k, t, i]) => (
        <button key={k} className={'nav' + (view === k ? ' on' : '')} onClick={() => setView(k)}><span className="ic">{i}</span>{t}</button>))}
    </aside>
  );
}
