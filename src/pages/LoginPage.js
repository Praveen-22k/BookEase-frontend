import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === "admin" ? "/admin" : "/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center"
      style={{ background: "var(--bg)" }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="text-center mb-4">
              <h1
                style={{
                  fontFamily: "Playfair Display, serif",
                  color: "var(--primary)",
                }}
              >
                <i
                  className="bi bi-calendar-check-fill me-2"
                  style={{ color: "var(--accent)" }}
                ></i>
                BookEase
              </h1>
              <p className="text-muted">Login to your account</p>
            </div>
            <div className="card border-0 shadow-sm p-4">
              {error && (
                <div className="alert alert-danger py-2">
                  <i className="bi bi-exclamation-circle me-2"></i>
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label fw-semibold">Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary-custom w-100 py-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Logging in...
                    </>
                  ) : (
                    "Login In"
                  )}
                </button>
              </form>
              <p className="text-center mt-3 mb-0 text-muted small">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-decoration-none fw-semibold"
                  style={{ color: "var(--primary)" }}
                >
                  Sign up
                </Link>
              </p>
              <hr className="my-3" />
              <div
                className="p-2 rounded"
                style={{ background: "var(--bg)", fontSize: "0.8rem" }}
              >
                <p className="mb-1 fw-semibold text-muted">Demo Credentials:</p>
                <p className="mb-0 text-muted">
                  <strong>Admin:</strong> admin@booking.com / admin123
                </p>
                <p className="mb-0 text-muted">
                  <strong>User:</strong> user@booking.com / user123
                </p>
              </div>
            </div>
            <p className="text-center mt-3">
              <Link to="/" className="text-muted text-decoration-none">
                <i className="bi bi-arrow-left me-1"></i>Back to Services
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
