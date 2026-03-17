import React, { useEffect, useState } from 'react';
import API from '../../utils/api';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ date: '', customer: '', service: '', status: '' });
  const [selected, setSelected] = useState(null);

  const fetchBookings = () => {
    const params = new URLSearchParams();
    if (filters.date) params.append('date', filters.date);
    if (filters.customer) params.append('customer', filters.customer);
    if (filters.service) params.append('service', filters.service);
    if (filters.status) params.append('status', filters.status);
    API.get(`/bookings?${params}`).then(r => { setBookings(r.data); setLoading(false); });
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleFilter = e => {
    e.preventDefault();
    setLoading(true);
    fetchBookings();
  };

  const clearFilters = () => {
    setFilters({ date: '', customer: '', service: '', status: '' });
    setLoading(true);
    API.get('/bookings').then(r => { setBookings(r.data); setLoading(false); });
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      await API.put(`/bookings/${id}/cancel`);
      fetchBookings();
      setSelected(null);
    } catch (err) {
      alert('Failed to cancel booking');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Permanently delete this booking?')) return;
    try {
      await API.delete(`/bookings/${id}`);
      fetchBookings();
      setSelected(null);
    } catch (err) {
      alert('Failed to delete booking');
    }
  };

  const statusBadge = s => {
    const c = { confirmed: 'success', pending: 'warning', cancelled: 'danger' };
    return <span className={`badge bg-${c[s] || 'secondary'}`}>{s}</span>;
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="section-title mb-1">Bookings</h2>
          <p className="text-muted mb-0">{bookings.length} bookings found</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card border-0 shadow-sm p-3 mb-4">
        <form onSubmit={handleFilter}>
          <div className="row g-2 align-items-end">
            <div className="col-sm-3">
              <label className="form-label small fw-semibold">Date</label>
              <input type="date" className="form-control form-control-sm" value={filters.date} onChange={e => setFilters(p => ({ ...p, date: e.target.value }))} />
            </div>
            <div className="col-sm-3">
              <label className="form-label small fw-semibold">Customer</label>
              <input type="text" className="form-control form-control-sm" placeholder="Search name..." value={filters.customer} onChange={e => setFilters(p => ({ ...p, customer: e.target.value }))} />
            </div>
            <div className="col-sm-2">
              <label className="form-label small fw-semibold">Service</label>
              <input type="text" className="form-control form-control-sm" placeholder="Service name..." value={filters.service} onChange={e => setFilters(p => ({ ...p, service: e.target.value }))} />
            </div>
            <div className="col-sm-2">
              <label className="form-label small fw-semibold">Status</label>
              <select className="form-select form-select-sm" value={filters.status} onChange={e => setFilters(p => ({ ...p, status: e.target.value }))}>
                <option value="">All</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="col-sm-2 d-flex gap-1">
              <button type="submit" className="btn btn-sm btn-primary-custom flex-grow-1"><i className="bi bi-search"></i></button>
              <button type="button" className="btn btn-sm btn-outline-secondary" onClick={clearFilters}><i className="bi bi-x-lg"></i></button>
            </div>
          </div>
        </form>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border" style={{ color: 'var(--primary)' }}></div></div>
      ) : (
        <div className="card border-0 shadow-sm">
          <div className="table-responsive">
            <table className="table table-custom mb-0">
              <thead>
                <tr><th>Reference</th><th>Customer</th><th>Services</th><th>Date(s)</th><th>Amount</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b._id} style={{ cursor: 'pointer' }} onClick={() => setSelected(b)}>
                    <td><code style={{ color: 'var(--primary)' }}>{b.bookingReference}</code></td>
                    <td>
                      <p className="mb-0 fw-semibold" style={{ fontSize: '0.85rem' }}>{b.customer.name}</p>
                      <small className="text-muted">{b.customer.phone}</small>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{b.items.map(i => i.serviceName).join(', ')}</td>
                    <td style={{ fontSize: '0.85rem' }}>{[...new Set(b.items.map(i => i.date))].join(', ')}</td>
                    <td className="fw-bold" style={{ color: 'var(--primary)' }}>₹{b.totalAmount.toFixed(2)}</td>
                    <td>{statusBadge(b.status)}</td>
                    <td onClick={e => e.stopPropagation()}>
                      <div className="d-flex gap-1">
                        {b.status !== 'cancelled' && (
                          <button className="btn btn-sm btn-outline-warning" onClick={() => handleCancel(b._id)} title="Cancel">
                            <i className="bi bi-x-circle"></i>
                          </button>
                        )}
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(b._id)} title="Delete">
                          <i className="bi bi-trash3"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {bookings.length === 0 && (
                  <tr><td colSpan={7} className="text-center text-muted py-4">No bookings found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div className="modal show d-block" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header" style={{ background: 'var(--primary)', color: 'white' }}>
                <h5 className="modal-title" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                  Booking: <code style={{ color: 'var(--accent)' }}>{selected.bookingReference}</code>
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setSelected(null)}></button>
              </div>
              <div className="modal-body">
                <h6 className="fw-bold text-muted mb-2 text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.08em' }}>Customer</h6>
                <p className="mb-1"><strong>Name:</strong> {selected.customer.name}</p>
                <p className="mb-1"><strong>Email:</strong> {selected.customer.email}</p>
                <p className="mb-3"><strong>Phone:</strong> {selected.customer.phone}</p>
                <h6 className="fw-bold text-muted mb-2 text-uppercase" style={{ fontSize: '0.75rem', letterSpacing: '0.08em' }}>Services Booked</h6>
                {selected.items.map((item, i) => (
                  <div key={i} className="d-flex justify-content-between border rounded p-2 mb-2">
                    <div>
                      <p className="mb-0 fw-semibold" style={{ fontSize: '0.9rem' }}>{item.serviceName}</p>
                      <small className="text-muted">{item.date} at {item.time} &bull; qty {item.quantity}</small>
                    </div>
                    <span className="fw-bold" style={{ color: 'var(--primary)' }}>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="d-flex justify-content-between border-top pt-2 mt-2">
                  <strong>Total</strong>
                  <strong style={{ color: 'var(--primary)' }}>₹{selected.totalAmount.toFixed(2)}</strong>
                </div>
                <div className="mt-3">{statusBadge(selected.status)}</div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setSelected(null)}>Close</button>
                {selected.status !== 'cancelled' && (
                  <button className="btn btn-warning" onClick={() => handleCancel(selected._id)}>
                    <i className="bi bi-x-circle me-1"></i>Cancel Booking
                  </button>
                )}
                <button className="btn btn-danger" onClick={() => handleDelete(selected._id)}>
                  <i className="bi bi-trash3 me-1"></i>Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
