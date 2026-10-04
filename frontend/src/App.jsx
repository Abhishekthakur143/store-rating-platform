import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import './App.css';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

function StarRating({ value, onChange }) {
  return (
    <div className="stars" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`star ${star <= value ? 'active' : ''}`}
          onClick={() => onChange(star)}
          aria-label={`Rate ${star} star`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function App() {
  const [authMode, setAuthMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [auth, setAuth] = useState({
    token: localStorage.getItem('token') || '',
    userName: localStorage.getItem('userName') || '',
  });
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [drafts, setDrafts] = useState({});

  const isLoggedIn = useMemo(() => Boolean(auth.token), [auth.token]);

  const fetchStores = async () => {
    try {
      const { data } = await api.get('/stores', { params: { search } });
      setStores(data);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to load stores');
    }
  };

  useEffect(() => {
    fetchStores();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const onAuthSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    try {
      if (authMode === 'register') {
        await api.post('/auth/register', form);
        setMessage('Registration successful. Please login.');
        setAuthMode('login');
        return;
      }

      const { data } = await api.post('/auth/login', {
        email: form.email,
        password: form.password,
      });

      localStorage.setItem('token', data.token);
      localStorage.setItem('userName', data.user.name);
      setAuth({ token: data.token, userName: data.user.name });
      setMessage(`Welcome ${data.user.name}`);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Authentication failed');
    }
  };

  const submitRating = async (storeId) => {
    const draft = drafts[storeId] || { rating: 0, review: '' };

    if (!draft.rating) {
      setMessage('Please choose a star rating before submitting.');
      return;
    }

    try {
      await api.post(
        '/ratings',
        {
          storeId,
          rating: draft.rating,
          review: draft.review,
        },
        {
          headers: {
            Authorization: 'Bearer ' + auth.token,
          },
        }
      );
      setMessage('Rating submitted successfully');
      fetchStores();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to submit rating');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setAuth({ token: '', userName: '' });
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <h1>Store Rating Platform</h1>
        {isLoggedIn ? (
          <div className="user-badge">
            <span>{auth.userName}</span>
            <button type="button" onClick={logout}>
              Logout
            </button>
          </div>
        ) : (
          <span className="muted">Login to submit ratings</span>
        )}
      </header>

      <main className="layout">
        <section className="panel auth-panel">
          <h2>{authMode === 'login' ? 'Login' : 'Create account'}</h2>
          <form onSubmit={onAuthSubmit}>
            {authMode === 'register' && (
              <input
                placeholder="Name"
                value={form.name}
                onChange={(e) => setForm((old) => ({ ...old, name: e.target.value }))}
                required
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm((old) => ({ ...old, email: e.target.value }))}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm((old) => ({ ...old, password: e.target.value }))}
              required
            />
            <button type="submit">{authMode === 'login' ? 'Login' : 'Register'}</button>
          </form>
          <button
            className="link-btn"
            type="button"
            onClick={() => setAuthMode((old) => (old === 'login' ? 'register' : 'login'))}
          >
            {authMode === 'login' ? 'Need an account?' : 'Already have an account?'}
          </button>
        </section>

        <section className="panel content-panel">
          <div className="search-row">
            <input
              placeholder="Search stores by name or address"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="store-grid">
            {stores.map((store) => (
              <article key={store.id} className="store-card">
                <h3>{store.name}</h3>
                <p>{store.address}</p>
                {store.description && <p className="muted">{store.description}</p>}
                <p>
                  Average Rating:{' '}
                  <strong>
                    {store.averageRating ? Number(store.averageRating).toFixed(1) : 'No ratings'}
                  </strong>
                </p>

                {isLoggedIn && (
                  <div className="rating-box">
                    <StarRating
                      value={drafts[store.id]?.rating || 0}
                      onChange={(rating) =>
                        setDrafts((old) => ({
                          ...old,
                          [store.id]: { ...old[store.id], rating },
                        }))
                      }
                    />
                    <textarea
                      placeholder="Write a review (optional)"
                      value={drafts[store.id]?.review || ''}
                      onChange={(e) =>
                        setDrafts((old) => ({
                          ...old,
                          [store.id]: {
                            ...old[store.id],
                            rating: old[store.id]?.rating || 0,
                            review: e.target.value,
                          },
                        }))
                      }
                    />
                    <button type="button" onClick={() => submitRating(store.id)}>
                      Submit Review
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        </section>
      </main>

      {message && <div className="toast">{message}</div>}
    </div>
  );
}

export default App;
