import React from 'react';

const ROLE = { admin: 'Admin', owner: 'Store owner', user: 'Member' };

export default function Navbar({ user, page, go, onLogout, onAccount }) {
  return (
    <nav className="bar">
      <button className="brand" onClick={() => go && go('home')}><span className="logo">★</span>Store Ratings</button>
      <span className="sp" />
      {user ? (
        <>
          <span className="who">{user.name}</span><span className={'pill ' + user.role}>{ROLE[user.role]}</span>
          <button className="ghost" onClick={onAccount}>Account</button>
          <button onClick={onLogout}>Log out</button>
        </>
      ) : (
        <>
          {[['home', 'Home'], ['about', 'How it works'], ['login', 'Log in']].map(([k, t]) => (
            <button key={k} className={'link' + (page === k ? ' cur' : '')} onClick={() => go(k)}>{t}</button>))}
          <button onClick={() => go('signup')}>Sign up</button>
        </>
      )}
    </nav>
  );
}
