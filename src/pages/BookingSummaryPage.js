import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../utils/api";
import StepsBar from "../components/StepsBar";

export default function BookingSummaryPage() {
  const { ref } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    API.get(`/bookings/ref/${ref}`)
      .then((r) => {
        setBooking(r.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Booking not found");
        setLoading(false);
      });
  }, [ref]);

  if (loading)
    return (
      <div className="text-center py-5">
        <div
          className="spinner-border"
          style={{ color: "var(--primary)", width: "3rem", height: "3rem" }}
        ></div>
        <p className="mt-3 text-muted">Loading your booking...</p>
      </div>
    );

  if (error)
    return (
      <div className="container py-5 text-center">
        <i
          className="bi bi-exclamation-circle"
          style={{ fontSize: "4rem", color: "var(--danger)" }}
        ></i>
        <h3 className="mt-3">{error}</h3>
        <Link to="/" className="btn btn-primary-custom mt-3">
          Back to Services
        </Link>
      </div>
    );

  const statusColor = {
    confirmed: "success",
    pending: "warning",
    cancelled: "danger",
  };

  return (
    <div>
      <StepsBar current={3} />
      <div className="container py-4" style={{ maxWidth: 700 }}>
        <div className="booking-summary-card">
          <div className="booking-summary-header">
            <div className="success-icon">
              <i className="bi bi-check-lg"></i>
            </div>
            <h2 className="mb-1" style={{ color: "white" }}>
              Booking Confirmed!
            </h2>
            <p className="mb-2" style={{ color: "rgba(255,255,255,0.8)" }}>
              Thank you, {booking.customer.name}
            </p>
            <div className="booking-ref">{booking.bookingReference}</div>
            <p
              className="mt-2 mb-0"
              style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.7)" }}
            >
              Your Booking Reference
            </p>
          </div>

          <div className="p-4">
            <div
              className="d-flex justify-content-between align-items-center mb-4 p-3 rounded"
              style={{ background: "var(--bg)" }}
            >
              <span className="fw-semibold">Status</span>
              <span className={`badge bg-${statusColor[booking.status]} fs-6`}>
                {booking.status.charAt(0).toUpperCase() +
                  booking.status.slice(1)}
              </span>
            </div>

            <h6
              className="fw-bold mb-3 text-uppercase"
              style={{
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
                color: "var(--text-muted)",
              }}
            >
              Customer Details
            </h6>
            <div className="row g-2 mb-4">
              <div className="col-sm-4">
                <div className="d-flex align-items-center gap-2">
                  <i
                    className="bi bi-person-circle"
                    style={{ color: "var(--primary)" }}
                  ></i>
                  <div>
                    <p
                      className="mb-0 text-muted"
                      style={{ fontSize: "0.75rem" }}
                    >
                      Name
                    </p>
                    <p className="mb-0 fw-semibold">{booking.customer.name}</p>
                  </div>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="d-flex align-items-center gap-2">
                  <i
                    className="bi bi-envelope"
                    style={{ color: "var(--primary)" }}
                  ></i>
                  <div>
                    <p
                      className="mb-0 text-muted"
                      style={{ fontSize: "0.75rem" }}
                    >
                      Email
                    </p>
                    <p className="mb-0 fw-semibold">{booking.customer.email}</p>
                  </div>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="d-flex align-items-center gap-2">
                  <i
                    className="bi bi-telephone"
                    style={{ color: "var(--primary)" }}
                  ></i>
                  <div>
                    <p
                      className="mb-0 text-muted"
                      style={{ fontSize: "0.75rem" }}
                    >
                      Phone
                    </p>
                    <p className="mb-0 fw-semibold">{booking.customer.phone}</p>
                  </div>
                </div>
              </div>
            </div>

            <h6
              className="fw-bold mb-3 text-uppercase"
              style={{
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
                color: "var(--text-muted)",
              }}
            >
              Booked Services
            </h6>
            <div className="d-flex flex-column gap-2 mb-4">
              {booking.items.map((item, idx) => (
                <div
                  key={idx}
                  className="d-flex justify-content-between align-items-center p-3 rounded border"
                >
                  <div>
                    <p className="mb-0 fw-semibold">{item.serviceName}</p>
                    <small className="text-muted">
                      <i className="bi bi-calendar3 me-1"></i>
                      {item.date}
                      <span className="mx-2">&bull;</span>
                      <i className="bi bi-clock me-1"></i>
                      {item.time}
                      {item.quantity > 1 && (
                        <span className="ms-2">× {item.quantity}</span>
                      )}
                    </small>
                  </div>
                  <span className="fw-bold" style={{ color: "var(--primary)" }}>
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div
              className="d-flex justify-content-between align-items-center p-3 rounded mb-4"
              style={{ background: "var(--primary)", color: "white" }}
            >
              <span className="fw-bold fs-5">Total Amount</span>
              <span className="fw-bold fs-4" style={{ color: "var(--accent)" }}>
                ₹{booking.totalAmount.toFixed(2)}
              </span>
            </div>

            <div className="d-flex gap-3">
              <Link to="/" className="btn btn-primary-custom flex-grow-1">
                <i className="bi bi-plus-circle me-2"></i>Book More Services
              </Link>
              <button
                className="btn btn-outline-secondary"
                onClick={() => window.print()}
              >
                <i className="bi bi-printer me-1"></i>Print
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
