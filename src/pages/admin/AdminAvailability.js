import React, { useEffect, useState } from "react";
import API from "../../utils/api";

const DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function AdminAvailability() {
  const [services, setServices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({
    workingHours: { start: "09:00", end: "18:00" },
    workingDays: [1, 2, 3, 4, 5],
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/services/admin/all").then((r) => {
      setServices(r.data);
      setLoading(false);
    });
  }, []);

  const handleSelect = (service) => {
    setSelected(service);
    setForm({
      workingHours: { ...service.workingHours },
      workingDays: [...service.workingDays],
    });
    setSuccess("");
  };

  const toggleDay = (d) =>
    setForm((p) => ({
      ...p,
      workingDays: p.workingDays.includes(d)
        ? p.workingDays.filter((x) => x !== d)
        : [...p.workingDays, d].sort(),
    }));

  const handleSave = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const { data } = await API.put(`/availability/${selected._id}`, form);
      setServices((prev) => prev.map((s) => (s._id === data._id ? data : s)));
      setSelected(data);
      setSuccess("Availability settings saved successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      alert(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const getTimeSlots = () => {
    if (!form.workingHours.start || !form.workingHours.end || !selected)
      return [];
    const slots = [];
    const [sh, sm] = form.workingHours.start.split(":").map(Number);
    const [eh, em] = form.workingHours.end.split(":").map(Number);
    let cur = sh * 60 + sm;
    const end = eh * 60 + em;
    while (cur + (selected.duration || 60) <= end) {
      const h = Math.floor(cur / 60);
      const m = cur % 60;
      slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
      cur += selected.duration || 60;
    }
    return slots;
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
      <h2 className="section-title mb-1">Availability Settings</h2>
      <p className="text-muted mb-4">
        Configure working hours and working days for each service
      </p>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white py-3">
              <h6 className="mb-0 fw-bold">Select a Service</h6>
            </div>
            <div className="list-group list-group-flush">
              {services.map((s) => (
                <button
                  key={s._id}
                  className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${selected?._id === s._id ? "active" : ""}`}
                  onClick={() => handleSelect(s)}
                  style={
                    selected?._id === s._id
                      ? {
                          background: "var(--primary)",
                          borderColor: "var(--primary)",
                          color: "white",
                        }
                      : {}
                  }
                >
                  <div>
                    <p
                      className="mb-0 fw-semibold"
                      style={{ fontSize: "0.9rem" }}
                    >
                      {s.name}
                    </p>
                    <small style={{ opacity: 0.75 }}>
                      {s.workingHours.start} – {s.workingHours.end}
                    </small>
                  </div>
                  <span
                    className={`badge ${s.isActive ? "bg-success" : "bg-secondary"}`}
                    style={{ fontSize: "0.65rem" }}
                  >
                    {s.isActive ? "Active" : "Off"}
                  </span>
                </button>
              ))}
              {services.length === 0 && (
                <div className="p-3 text-muted text-center">
                  No services found
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-8">
          {!selected ? (
            <div className="card border-0 shadow-sm p-5 text-center">
              <i
                className="bi bi-clock"
                style={{ fontSize: "3rem", color: "var(--border)" }}
              ></i>
              <h5 className="mt-3 text-muted">
                Select a service to configure availability
              </h5>
            </div>
          ) : (
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                <h6 className="mb-0 fw-bold">{selected.name}</h6>
                <span className="text-muted small">
                  {selected.duration} min/session
                </span>
              </div>
              <div className="card-body p-4">
                {success && (
                  <div className="alert alert-success py-2 mb-3">
                    <i className="bi bi-check-circle me-2"></i>
                    {success}
                  </div>
                )}

                <h6
                  className="fw-bold mb-3"
                  style={{ color: "var(--primary)" }}
                >
                  <i className="bi bi-clock me-2"></i>Working Hours
                </h6>
                <div className="row g-3 mb-4">
                  <div className="col-sm-6">
                    <label className="form-label fw-semibold small">
                      Opens At
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
                    <label className="form-label fw-semibold small">
                      Closes At
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
                </div>

                <h6
                  className="fw-bold mb-3"
                  style={{ color: "var(--primary)" }}
                >
                  <i className="bi bi-calendar3 me-2"></i>Working Days
                </h6>
                <div className="d-flex gap-2 flex-wrap mb-4">
                  {DAYS.map((d, i) => (
                    <div
                      key={i}
                      className={`day-chip ${form.workingDays.includes(i) ? "selected" : ""}`}
                      onClick={() => toggleDay(i)}
                      title={d}
                    >
                      {DAY_SHORT[i]}
                    </div>
                  ))}
                </div>
                <p className="text-muted small mb-4">
                  <i className="bi bi-info-circle me-1"></i>
                  Active days:{" "}
                  {form.workingDays.length > 0
                    ? form.workingDays.map((d) => DAYS[d]).join(", ")
                    : "None selected"}
                </p>

                <div
                  className="p-3 rounded mb-4"
                  style={{
                    background: "var(--bg)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <p
                    className="fw-semibold mb-2 small text-muted text-uppercase"
                    style={{ letterSpacing: "0.05em" }}
                  >
                    <i className="bi bi-grid me-1"></i>Available Time Slots
                    Preview ({selected.duration} min each)
                  </p>
                  {getTimeSlots().length === 0 ? (
                    <p className="text-muted mb-0 small">
                      No slots — check working hours and service duration
                    </p>
                  ) : (
                    <div className="d-flex flex-wrap gap-2">
                      {getTimeSlots().map((t) => (
                        <span
                          key={t}
                          className="badge"
                          style={{
                            background: "var(--primary)",
                            color: "white",
                            fontSize: "0.75rem",
                            padding: "0.35rem 0.6rem",
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  className="btn btn-primary-custom w-100"
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
                      <i className="bi bi-check-lg me-2"></i>Save Availability
                      Settings
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
