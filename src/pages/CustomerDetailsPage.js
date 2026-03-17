import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import StepsBar from "../components/StepsBar";
import API from "../utils/api";

export default function CustomerDetailsPage() {
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const slots = location.state?.slots || [];

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (cart.length === 0) {
    navigate("/");
    return null;
  }

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      e.email = "Valid email required";
    if (!form.phone.trim() || form.phone.length < 7)
      e.phone = "Valid phone number required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setErrors((p) => ({ ...p, [e.target.name]: "" }));
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const items = cart.map((item) => {
        const slot = slots.find((s) => s.serviceId === item._id) || {};
        return {
          service: item._id,
          serviceName: item.name,
          quantity: item.quantity,
          price: item.price,
          date: slot.date || new Date().toISOString().split("T")[0],
          time: slot.time || "09:00",
        };
      });
      const { data } = await API.post("/bookings", {
        customer: form,
        items,
        totalAmount: totalPrice,
      });
      clearCart();
      navigate(`/booking-summary/${data.bookingReference}`);
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <StepsBar current={2} />
      <div className="container py-4">
        <div className="row g-4" style={{ maxWidth: 900, margin: "0 auto" }}>
          <div className="col-md-7">
            <h2 className="section-title mb-1">Your Details</h2>
            <p className="text-muted mb-4">
              We'll send your booking confirmation to these details
            </p>
            <div className="card border-0 shadow-sm p-4">
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Full Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                />
                {errors.name && (
                  <div className="invalid-feedback">{errors.name}</div>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Email Address <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>
              <div className="mb-4">
                <label className="form-label fw-semibold">
                  Phone Number <span className="text-danger">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                  placeholder="+1 234 567 8900"
                  value={form.phone}
                  onChange={handleChange}
                />
                {errors.phone && (
                  <div className="invalid-feedback">{errors.phone}</div>
                )}
              </div>
              <div className="d-flex gap-3">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => navigate("/slot-selection")}
                >
                  <i className="bi bi-arrow-left me-1"></i>Back
                </button>
                <button
                  className="btn btn-primary-custom flex-grow-1"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Confirming...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle me-2"></i>Confirm Booking
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="col-md-5">
            <h5
              className="fw-bold mb-3"
              style={{ fontFamily: "DM Sans, sans-serif" }}
            >
              Order Summary
            </h5>
            <div className="card border-0 shadow-sm">
              <div className="card-body p-0">
                {cart.map((item) => {
                  const slot = slots.find((s) => s.serviceId === item._id);
                  return (
                    <div key={item._id} className="p-3 border-bottom">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <p
                            className="mb-1 fw-semibold"
                            style={{ fontSize: "0.9rem" }}
                          >
                            {item.name}
                          </p>
                          <small className="text-muted">
                            <i className="bi bi-calendar3 me-1"></i>
                            {slot?.date}
                            <span className="mx-1">&bull;</span>
                            <i className="bi bi-clock me-1"></i>
                            {slot?.time}
                          </small>
                        </div>
                        <span
                          className="fw-bold"
                          style={{ color: "var(--primary)" }}
                        >
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}
                <div className="p-3 d-flex justify-content-between align-items-center">
                  <span className="fw-bold fs-5">Total</span>
                  <span
                    className="fw-bold fs-4"
                    style={{ color: "var(--primary)" }}
                  >
                    ₹{totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
