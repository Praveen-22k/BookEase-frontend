import React, { useState, useEffect } from "react";
import API from "../utils/api";
import { useCart } from "../context/CartContext";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addToCart, cart, setCartOpen } = useCart();

  useEffect(() => {
    API.get("/services")
      .then((r) => {
        setServices(r.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load services. Make sure the backend is running.");
        setLoading(false);
      });
  }, []);

  const filtered = services.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description.toLowerCase().includes(search.toLowerCase()),
  );

  const inCart = (id) => cart.some((i) => i._id === id);

  const getServiceIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes("massage")) return "bi-hearts";
    if (n.includes("facial")) return "bi-emoji-smile";
    if (n.includes("hair")) return "bi-scissors";
    if (n.includes("nail") || n.includes("mani") || n.includes("pedi"))
      return "bi-brush";
    if (n.includes("yoga") || n.includes("fitness")) return "bi-activity";
    if (n.includes("spa") || n.includes("aroma")) return "bi-flower1";
    if (n.includes("stone")) return "bi-gem";
    return "bi-star";
  };

  return (
    <div>
      <div className="page-hero">
        <div className="container text-center">
          <h1 className="display-5 fw-bold mb-2">Our Services</h1>
          <p className="lead mb-0">
            Choose from our premium wellness and beauty treatments
          </p>
        </div>
      </div>

      <div className="container pb-5">
        <div className="row justify-content-center mb-4">
          <div className="col-md-6">
            <div className="search-wrapper">
              <i className="bi bi-search search-icon"></i>
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Search services..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {loading && (
          <div className="text-center py-5">
            <div
              className="spinner-border"
              style={{ color: "var(--primary)", width: "3rem", height: "3rem" }}
            ></div>
            <p className="mt-3 text-muted">Loading services...</p>
          </div>
        )}

        {error && (
          <div className="alert alert-danger d-flex align-items-center">
            <i className="bi bi-exclamation-circle me-2"></i>
            {error}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="text-center py-5">
            <i
              className="bi bi-search"
              style={{ fontSize: "3.5rem", color: "var(--border)" }}
            ></i>
            <h4 className="mt-3" style={{ fontFamily: "DM Sans, sans-serif" }}>
              No matching services found
            </h4>
            <p className="text-muted">Try a different search term</p>
            <button
              className="btn btn-primary-custom"
              onClick={() => setSearch("")}
            >
              Clear Search
            </button>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <>
            <p className="text-muted mb-3">
              {search
                ? `Showing ${filtered.length} result${filtered.length !== 1 ? "s" : ""} for "${search}"`
                : `${filtered.length} services available`}
            </p>
            <div className="row g-4">
              {filtered.map((service) => (
                <div key={service._id} className="col-sm-6 col-lg-4">
                  <div className="service-card d-flex flex-column">
                    {service.image ? (
                      <img
                        src={
                          service.image.startsWith("/uploads")
                            ? `http://localhost:5000${service.image}`
                            : service.image
                        }
                        alt={service.name}
                        className="card-img-top"
                      />
                    ) : (
                      <div className="service-img-placeholder">
                        <i className={`bi ${getServiceIcon(service.name)}`}></i>
                      </div>
                    )}
                    <div className="card-body d-flex flex-column p-3">
                      <h5
                        className="card-title mb-1"
                        style={{
                          fontFamily: "Playfair Display, serif",
                          fontSize: "1.1rem",
                        }}
                      >
                        {service.name}
                      </h5>
                      <p className="text-muted small mb-3 flex-grow-1">
                        {service.description}
                      </p>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <span className="price-badge">₹{service.price}</span>
                        <span className="duration-badge">
                          <i className="bi bi-clock me-1"></i>
                          {service.duration} min
                        </span>
                      </div>
                      <button
                        className={`btn w-100 ${inCart(service._id) ? "btn-success" : "btn-primary-custom"}`}
                        onClick={() =>
                          inCart(service._id)
                            ? setCartOpen(true)
                            : addToCart(service)
                        }
                      >
                        {inCart(service._id) ? (
                          <>
                            <i className="bi bi-check-circle me-2"></i>Added to
                            Cart
                          </>
                        ) : (
                          <>
                            <i className="bi bi-cart-plus me-2"></i>Add to Cart
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
