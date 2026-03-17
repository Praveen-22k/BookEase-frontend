import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { to: "/admin", label: "Dashboard", icon: "bi-speedometer2", end: true },
    { to: "/admin/services", label: "Services", icon: "bi-grid-3x3-gap" },
    { to: "/admin/bookings", label: "Bookings", icon: "bi-calendar-check" },
    { to: "/admin/availability", label: "Availability", icon: "bi-clock" },
  ];

  return (
    <div className="d-flex">
      <div
        className="admin-sidebar d-flex flex-column"
        style={{ paddingTop: "0" }}
      >
        <div
          className="p-4 border-bottom"
          style={{ borderColor: "rgba(255,255,255,0.1) !important" }}
        >
          <h5
            className="mb-0"
            style={{
              fontFamily: "Playfair Display, serif",
              color: "var(--accent)",
            }}
          >
            <i className="bi bi-calendar-check-fill me-2"></i>BookEase
          </h5>
          <p
            className="mb-0 mt-1"
            style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)" }}
          >
            Admin Panel
          </p>
        </div>
        <nav className="flex-grow-1 py-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `nav-link d-flex align-items-center gap-2 ${isActive ? "active" : ""}`
              }
            >
              <i className={`bi ${link.icon}`}></i>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div
          className="p-3 border-top"
          style={{ borderColor: "rgba(255,255,255,0.1)" }}
        >
          <div className="d-flex align-items-center gap-2 mb-2">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center"
              style={{
                width: 36,
                height: 36,
                background: "var(--accent)",
                color: "var(--primary)",
                fontWeight: 700,
              }}
            >
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <p
                className="mb-0"
                style={{ fontSize: "0.85rem", color: "white", fontWeight: 600 }}
              >
                {user?.name}
              </p>
              <p
                className="mb-0"
                style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.5)" }}
              >
                Administrator
              </p>
            </div>
          </div>
          <button
            className="btn btn-sm btn-outline-light w-100"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right me-2"></i>Logout
          </button>
        </div>
      </div>

      <div className="admin-content flex-grow-1">
        <div className="admin-topbar d-flex justify-content-between align-items-center">
          <div>
            <span className="text-muted small">Welcome back,</span>
            <span className="fw-semibold ms-1">{user?.name}</span>
          </div>
          <NavLink to="/" className="btn btn-sm btn-outline-secondary">
            <i className="bi bi-shop me-1"></i>View Site
          </NavLink>
        </div>
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
