import React from 'react';
export default ({ title, items }) => <div className="card tips"><h3>{title}</h3><ul>{items.map(i => <li key={i}>{i}</li>)}</ul></div>;
