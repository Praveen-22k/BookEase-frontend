import React, { useEffect, useState } from "react";
import API from "../../utils/api";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const emptyForm = {
  name: "",
  description: "",
  price: "",
  duration: "",
  workingHours: { start: "09:00", end: "18:00" },
  workingDays: [1, 2, 3, 4, 5],
  image: null,
  isActive: true,
};

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchServices = () => {
    API.get("/services/admin/all").then((r) => {
      setServices(r.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openAdd = () => {
    setForm(emptyForm);
    setEditId(null);
    setError("");
    setShowModal(true);
  };
  const openEdit = (s) => {
    setForm({
      name: s.name,
      description: s.description,
      price: s.price,
      duration: s.duration,
      workingHours: s.workingHours,
      workingDays: s.workingDays,
      image: null,
      isActive: s.isActive,
    });
    setEditId(s._id);
    setError("");
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
    setEditId(null);
    setError("");
  };

  const toggleDay = (d) =>
    setForm((p) => ({
      ...p,
      workingDays: p.workingDays.includes(d)
        ? p.workingDays.filter((x) => x !== d)
        : [...p.workingDays, d].sort(),
    }));

  const handleSave = async () => {
    if (!form.name || !form.description || !form.price || !form.duration) {
      setError("Name, description, price and duration are required");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("description", form.description);
      fd.append("price", form.price);
      fd.append("duration", form.duration);
      fd.append("workingHours", JSON.stringify(form.workingHours));
      fd.append("workingDays", JSON.stringify(form.workingDays));
      fd.append("isActive", form.isActive);
      if (form.image) fd.append("image", form.image);

      if (editId) {
        await API.put(`/services/${editId}`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccess("Service updated successfully");
      } else {
        await API.post("/services", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccess("Service created successfully");
      }
      fetchServices();
      closeModal();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service? This cannot be undone.")) return;
    try {
      await API.delete(`/services/${id}`);
      setSuccess("Service deleted");
      fetchServices();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="section-title mb-1">Services</h2>
          <p className="text-muted mb-0">{services.length} services total</p>
        </div>
        <button className="btn btn-primary-custom" onClick={openAdd}>
          <i className="bi bi-plus-lg me-2"></i>Add Service
        </button>
      </div>

      {success && (
        <div className="alert alert-success py-2">
          <i className="bi bi-check-circle me-2"></i>
          {success}
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div
            className="spinner-border"
            style={{ color: "var(--primary)" }}
          ></div>
        </div>
      ) : (
        <div className="card border-0 shadow-sm">
          <div className="table-responsive">
            <table className="table table-custom mb-0">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Price</th>
                  <th>Duration</th>
                  <th>Working Days</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((s) => (
                  <tr key={s._id}>
                    <td>
                      <p className="mb-0 fw-semibold">{s.name}</p>
                      <small className="text-muted">
                        {s.description.substring(0, 60)}...
                      </small>
                    </td>
                    <td className="fw-bold" style={{ color: "var(--primary)" }}>
                      ₹{s.price}
                    </td>
                    <td>{s.duration} min</td>
                    <td>
                      <div className="d-flex gap-1 flex-wrap">
                        {DAYS.map((d, i) => (
                          <span
                            key={i}
                            className={`badge ${s.workingDays.includes(i) ? "bg-primary" : "bg-light text-muted"}`}
                            style={{ fontSize: "0.65rem" }}
                          >
                            {d}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`badge ${s.isActive ? "bg-success" : "bg-secondary"}`}
                      >
                        {s.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => openEdit(s)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(s._id)}
                        >
                          <i className="bi bi-trash3"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {services.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center text-muted py-4">
                      No services yet. Add your first service!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div
          className="modal show d-block"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className="modal-content">
              <div
                className="modal-header"
                style={{ background: "var(--primary)", color: "white" }}
              >
                <h5
                  className="modal-title"
                  style={{ fontFamily: "DM Sans, sans-serif" }}
                >
                  <i
                    className={`bi ${editId ? "bi-pencil" : "bi-plus-circle"} me-2`}
                  ></i>
                  {editId ? "Edit Service" : "Add New Service"}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                {error && (
                  <div className="alert alert-danger py-2">{error}</div>
                )}
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label fw-semibold">
                      Service Name *
                    </label>
                    <input
                      className="form-control"
                      value={form.name}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, name: e.target.value }))
                      }
                      placeholder="e.g. Deep Tissue Massage"
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">
                      Description *
                    </label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={form.description}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, description: e.target.value }))
                      }
                      placeholder="Describe the service..."
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label fw-semibold">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      min={0}
                      value={form.price}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, price: e.target.value }))
                      }
                      placeholder="e.g. 80"
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label fw-semibold">
                      Duration (minutes) *
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      min={15}
                      step={15}
                      value={form.duration}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, duration: e.target.value }))
                      }
                      placeholder="e.g. 60"
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label fw-semibold">
                      Working Hours Start
                    </label>
                    <input
                      type="time"
                      className="form-control"
                      value={form.workingHours.start}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          workingHours: {
                            ...p.workingHours,
                            start: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label fw-semibold">
                      Working Hours End
                    </label>
                    <input
                      type="time"
                      className="form-control"
                      value={form.workingHours.end}
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          workingHours: {
                            ...p.workingHours,
                            end: e.target.value,
                          },
                        }))
                      }
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">
                      Working Days
                    </label>
                    <div className="d-flex gap-2 flex-wrap">
                      {DAYS.map((d, i) => (
                        <div
                          key={i}
                          className={`day-chip ${form.workingDays.includes(i) ? "selected" : ""}`}
                          onClick={() => toggleDay(i)}
                        >
                          {d}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="col-12">
                    <label className="form-label fw-semibold">
                      Image (optional)
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={(e) =>
                        setForm((p) => ({
                          ...p,
                          image: e.target.files[0] || null,
                        }))
                      }
                    />
                    <small className="text-muted">
                      Max 5MB. JPG, PNG, GIF, WebP
                    </small>
                  </div>
                  <div className="col-12">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={form.isActive}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, isActive: e.target.checked }))
                        }
                        id="activeSwitch"
                      />
                      <label
                        className="form-check-label fw-semibold"
                        htmlFor="activeSwitch"
                      >
                        Active (visible to customers)
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button
                  className="btn btn-primary-custom"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-lg me-2"></i>Save Service
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
