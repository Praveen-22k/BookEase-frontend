import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../utils/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    services: 0,
    bookings: 0,
    confirmed: 0,
    cancelled: 0,
    revenue: 0,
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([API.get("/services/admin/all"), API.get("/bookings")])
      .then(([svcRes, bkRes]) => {
        const bookings = bkRes.data;
        const confirmed = bookings.filter((b) => b.status === "confirmed");
        const cancelled = bookings.filter((b) => b.status === "cancelled");
        const revenue = confirmed.reduce((s, b) => s + b.totalAmount, 0);
        setStats({
          services: svcRes.data.length,
          bookings: bookings.length,
          confirmed: confirmed.length,
          cancelled: cancelled.length,
          revenue,
        });
        setRecentBookings(bookings.slice(0, 5));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const statCards = [
    {
      label: "Total Services",
      value: stats.services,
      icon: "bi-grid-3x3-gap",
      color: "#1a3c5e",
      bg: "#e8f0f9",
    },
    {
      label: "Total Bookings",
      value: stats.bookings,
      icon: "bi-calendar-check",
      color: "#6f42c1",
      bg: "#f3eeff",
    },
    {
      label: "Confirmed",
      value: stats.confirmed,
      icon: "bi-check-circle",
      color: "#198754",
      bg: "#e8f5ee",
    },
    {
      label: "Revenue",
      value: `₹${stats.revenue.toFixed(0)}`,
      icon: "bi-currency-dollar",
      color: "#c9a84c",
      bg: "#fdf8ec",
    },
  ];

  const statusBadge = (s) => {
    const c = { confirmed: "success", pending: "warning", cancelled: "danger" };
    return <span className={`badge bg-${c[s]}`}>{s}</span>;
  };

  if (loading)
    return (
      <div className="text-center py-5">
        <div
          className="spinner-border"
          style={{ color: "var(--primary)" }}
        ></div>
      </div>
    );

  return (
    <div>
      <h2 className="section-title mb-1">Dashboard</h2>
      <p className="text-muted mb-4">Overview of your booking system</p>

      <div className="row g-3 mb-4">
        {statCards.map((card, i) => (
          <div key={i} className="col-sm-6 col-xl-3">
            <div className="stat-card d-flex align-items-center gap-3">
              <div
                className="stat-icon"
                style={{ background: card.bg, color: card.color }}
              >
                <i className={`bi ${card.icon}`}></i>
              </div>
              <div>
                <p className="mb-0 text-muted small">{card.label}</p>
                <h3
                  className="mb-0 fw-bold"
                  style={{
                    color: card.color,
                    fontFamily: "DM Sans, sans-serif",
                  }}
                >
                  {card.value}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
          <h6 className="mb-0 fw-bold">Recent Bookings</h6>
          <Link to="/admin/bookings" className="btn btn-sm btn-outline-primary">
            View All
          </Link>
        </div>
        <div className="card-body p-0">
          {recentBookings.length === 0 ? (
            <p className="text-center text-muted py-4">No bookings yet</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-custom mb-0">
                <thead>
                  <tr>
                    <th>Reference</th>
                    <th>Customer</th>
                    <th>Services</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((b, i) => (
                    <tr key={b._id}>
                      <td>
                        <code>{b.bookingReference}</code>
                      </td>
                      <td>
                        <p
                          className="mb-0 fw-semibold"
                          style={{ fontSize: "0.9rem" }}
                        >
                          {b.customer.name}
                        </p>
                        <small className="text-muted">{b.customer.email}</small>
                      </td>
                      <td>{b.items.map((i) => i.serviceName).join(", ")}</td>
                      <td
                        className="fw-bold"
                        style={{ color: "var(--primary)" }}
                      >
                        ₹{b.totalAmount.toFixed(2)}
                      </td>
                      <td>{statusBadge(b.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
