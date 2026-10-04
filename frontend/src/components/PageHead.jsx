import React from 'react';
export default ({ title, sub }) => <div className="ph"><h2>{title}</h2>{sub && <p>{sub}</p>}</div>;
