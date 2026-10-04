import React from 'react';

export default function AuthLayout({ title, sub, children, altText, altLabel, onAlt }) {
  return (
    <div className="authwrap">
      <section className="authside">
        <h2>Rate the places you shop at.</h2>
        <p>One login for members, store owners and admins. Your rating helps others choose better.</p>
        <ul><li>Rate any store from 1 to 5</li><li>Change your rating any time</li><li>Owners see their average live</li></ul>
      </section>
      <section className="authform card">
        <h2>{title}</h2><p className="muted">{sub}</p>
        {children}
        <p className="alt">{altText} <button className="link" onClick={onAlt}>{altLabel}</button></p>
      </section>
    </div>
  );
}
