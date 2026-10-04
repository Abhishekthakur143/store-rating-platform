import React, { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Sidebar, { NAV } from './components/Sidebar.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Account from './pages/Account.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminUsers from './pages/AdminUsers.jsx';
import AdminStores from './pages/AdminStores.jsx';
import AddUser from './pages/AddUser.jsx';
import AddStore from './pages/AddStore.jsx';
import UserStores from './pages/UserStores.jsx';
import OwnerDashboard from './pages/OwnerDashboard.jsx';

const PAGES = {
  admin: { dash: AdminDashboard, users: AdminUsers, stores: AdminStores, addUser: AddUser, addStore: AddStore, account: Account },
  owner: { dash: OwnerDashboard, account: Account },
  user: { stores: UserStores, account: Account },
};

export default function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.user || 'null'));
  const [page, setPage] = useState('home');
  const [view, setView] = useState('');
  const login = d => { localStorage.token = d.token; localStorage.user = JSON.stringify(d.user); setView(''); setUser(d.user); };
  const logout = () => { localStorage.clear(); setView(''); setPage('home'); setUser(null); };

  if (!user) {
    const Public = { home: Home, about: About, login: Login, signup: Signup }[page] || Home;
    return (
      <>
        <Navbar page={page} go={setPage} />
        <main className="page"><Public go={setPage} onLogin={login} /></main>
        <Footer />
      </>
    );
  }
  const v = view || NAV[user.role][0][0];
  const View = PAGES[user.role][v] || PAGES[user.role][NAV[user.role][0][0]];
  return (
    <>
      <Navbar user={user} onLogout={logout} onAccount={() => setView('account')} />
      <div className="shell">
        <Sidebar role={user.role} view={v} setView={setView} />
        <main className="main"><View go={setView} /></main>
      </div>
      <Footer />
    </>
  );
}
