import React from 'react';
import './Home.css';
 
const BARS = [[5, 62], [4, 25], [3, 8], [2, 3], [1, 2]];
const FEATURES = [
  ['⌕', 'Search stores', 'Find a store by name or address in seconds.'],
  ['★', 'Rate and modify', 'Give 1 to 5 stars and change your rating whenever you like.'],
  ['↗', 'Live averages', 'Every rating updates the store average right away.'],
  ['▦', 'Owner dashboard', 'Owners see their average and who rated their store.'],
  ['⚙', 'Admin control', 'Admins add users and stores, filter and sort every list.'],
  ['🔒', 'Secure by design', 'JWT login, bcrypt-hashed passwords, role-checked API.'],
];
const ROLES = [
  ['Members', ['Sign up in a minute', 'Search and sort stores', 'Rate and modify ratings', 'Update password']],
  ['Store owners', ['See average rating', 'See who rated your store', 'Sortable raters list', 'Update password']],
  ['Administrators', ['Dashboard with totals', 'Add users, owners and stores', 'Filter every listing', 'View full user details']],
];
 
export default function Home({ go }) {
  return (
    <>
      <section className="hm-hero">
        <div className="hm-copy">
          <span className="hm-badge">Role-based store ratings</span>
          <h1>Ratings you can trust, for every store you visit.</h1>
          <p>One platform for members, store owners and admins. Search stores, rate them from 1 to 5, and watch the average update live.</p>
          <div className="hm-cta">
            <button className="big accent" onClick={() => go('signup')}>Get started free</button>
            <button className="big glass" onClick={() => go('login')}>Log in</button>
          </div>
          <ul className="hm-trust"><li>One login</li><li>Three roles</li><li>1 to 5 stars</li></ul>
        </div>
        <div className="hm-preview" aria-hidden="true">
          <div className="hm-card">
            <span className="hm-tag">Sample data</span>
            <div className="hm-top"><div className="hm-av">G</div><div><b>Green Basket Grocers</b><span>12 MG Road, Bhopal</span></div></div>
            <div className="hm-score"><strong>4.6</strong><span className="hm-stars">★★★★★</span></div>
            <div className="hm-bars">{BARS.map(([n, p]) => (
              <div key={n}><span>{n}★</span><i><u style={{ width: p + '%' }} /></i><span>{p}%</span></div>))}</div>
            <div className="hm-rate"><span>Your rating</span><span className="hm-stars">★★★★★</span></div>
          </div>
          <div className="hm-float">Rating saved</div>
        </div>
      </section>
 
      <section className="hm-sec">
        <h2>Everything the platform does</h2>
        <p className="hm-sub">Built around three roles and one simple login.</p>
        <div className="hm-feats">{FEATURES.map(([i, t, d]) => (
          <div className="hm-feat" key={t}><span className="hm-ico">{i}</span><h3>{t}</h3><p>{d}</p></div>))}</div>
      </section>
 
      <section className="hm-sec">
        <h2>Made for each role</h2>
        <div className="hm-roles">{ROLES.map(([t, items]) => (
          <div className="hm-role" key={t}><h3>{t}</h3><ul>{items.map(i => <li key={i}>{i}</li>)}</ul></div>))}</div>
      </section>
 
      <section className="hm-sec">
        <h2>How it works</h2>
        <ol className="hm-steps">
          <li><b>Create an account</b><span>Sign up, or log in if an admin created your account.</span></li>
          <li><b>Find a store</b><span>Search by name or address and sort by rating.</span></li>
          <li><b>Rate it</b><span>Pick 1 to 5 stars and submit. Modify it whenever you want.</span></li>
        </ol>
      </section>
 
      <section className="hm-final">
        <h2>Ready to rate your first store?</h2>
        <p>Create your account and start in under a minute.</p>
        <button className="big accent" onClick={() => go('signup')}>Create an account</button>
      </section>
    </>
  );
}