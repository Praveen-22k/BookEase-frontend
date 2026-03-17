import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems, setCartOpen } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="navbar navbar-expand-lg navbar-custom sticky-top">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <i className="bi bi-calendar-check-fill me-2" style={{ color: 'var(--accent)' }}></i>
          BookEase
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navContent">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navContent">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link fw-500" to="/">Services</Link>
            </li>
            {user?.role === 'admin' && (
              <li className="nav-item">
                <Link className="nav-link fw-500" to="/admin">
                  <i className="bi bi-shield-lock me-1"></i>Admin
                </Link>
              </li>
            )}
          </ul>
          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-outline-secondary position-relative me-2"
              onClick={() => setCartOpen(true)}
            >
              <i className="bi bi-cart3"></i>
              {totalItems > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill"
                  style={{ background: 'var(--accent)', color: 'var(--primary)', fontSize: '0.65rem' }}>
                  {totalItems}
                </span>
              )}
            </button>
            {user ? (
              <div className="dropdown">
                <button className="btn btn-primary-custom dropdown-toggle" data-bs-toggle="dropdown">
                  <i className="bi bi-person-circle me-1"></i>{user.name}
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  {user.role === 'admin' && (
                    <li><Link className="dropdown-item" to="/admin"><i className="bi bi-shield-lock me-2"></i>Admin Panel</Link></li>
                  )}
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item text-danger" onClick={handleLogout}><i className="bi bi-box-arrow-right me-2"></i>Logout</button></li>
                </ul>
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-primary">Login</Link>
                <Link to="/register" className="btn btn-primary-custom">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
