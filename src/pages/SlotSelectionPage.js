import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import StepsBar from '../components/StepsBar';
import API from '../utils/api';

export default function SlotSelectionPage() {
  const { cart } = useCart();
  const navigate = useNavigate();
  const today = new Date().toISOString().split('T')[0];

  const [slots, setSlots] = useState(
    cart.map(item => ({ serviceId: item._id, serviceName: item.name, date: today, time: '09:00' }))
  );
  const [availability, setAvailability] = useState({});
  const [checking, setChecking] = useState(false);
  const [checked, setChecked] = useState(false);

  if (cart.length === 0) {
    navigate('/');
    return null;
  }

  const updateSlot = (idx, field, val) => {
    setSlots(prev => prev.map((s, i) => i === idx ? { ...s, [field]: val } : s));
    setChecked(false);
    setAvailability({});
  };

  const checkAvailability = async () => {
    setChecking(true);
    try {
      const { data } = await API.post('/bookings/check-availability', { items: slots });
      const avMap = {};
      data.results.forEach(r => { avMap[r.serviceId] = r; });
      setAvailability(avMap);
      setChecked(true);
    } catch (err) {
      alert('Error checking availability. Please try again.');
    } finally {
      setChecking(false);
    }
  };

  const allAvailable = checked && slots.every(s => availability[s.serviceId]?.available);

  const handleProceed = () => {
    navigate('/customer-details', { state: { slots } });
  };

  return (
    <div>
      <StepsBar current={1} />
      <div className="container py-4" style={{ maxWidth: 720 }}>
        <h2 className="section-title mb-1">Select Your Slots</h2>
        <p className="text-muted mb-4">Choose a preferred date and time for each service</p>

        <div className="d-flex flex-column gap-3 mb-4">
          {slots.map((slot, idx) => {
            const av = availability[slot.serviceId];
            const isUnavail = checked && av && !av.available;
            return (
              <div key={slot.serviceId} className={`card border-0 shadow-sm p-3 ${isUnavail ? 'slot-unavailable' : ''}`}>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h6 className="mb-0 fw-bold">{slot.serviceName}</h6>
                    {cart.find(c => c._id === slot.serviceId) && (
                      <small className="text-muted">
                        {cart.find(c => c._id === slot.serviceId).duration} min &bull; ₹{cart.find(c => c._id === slot.serviceId).price}
                      </small>
                    )}
                  </div>
                  {checked && (
                    av?.available
                      ? <span className="badge bg-success"><i className="bi bi-check-circle me-1"></i>Available</span>
                      : <span className="badge bg-danger"><i className="bi bi-x-circle me-1"></i>Unavailable</span>
                  )}
                </div>

                {isUnavail && (
                  <div className="alert alert-danger py-2 px-3 mb-3" style={{ fontSize: '0.85rem' }}>
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {av.reason} — please pick a different slot.
                  </div>
                )}

                <div className="row g-3">
                  <div className="col-sm-6">
                    <label className="form-label small fw-semibold text-muted text-uppercase" style={{ letterSpacing: '0.05em' }}>Date</label>
                    <input
                      type="date"
                      className="form-control"
                      min={today}
                      value={slot.date}
                      onChange={e => updateSlot(idx, 'date', e.target.value)}
                    />
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label small fw-semibold text-muted text-uppercase" style={{ letterSpacing: '0.05em' }}>Time</label>
                    <input
                      type="time"
                      className="form-control"
                      value={slot.time}
                      onChange={e => updateSlot(idx, 'time', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="d-flex gap-3">
          <button
            className="btn btn-outline-primary flex-grow-1"
            onClick={checkAvailability}
            disabled={checking}
          >
            {checking ? (
              <><span className="spinner-border spinner-border-sm me-2"></span>Checking...</>
            ) : (
              <><i className="bi bi-search me-2"></i>Check Availability</>
            )}
          </button>
          <button
            className="btn btn-primary-custom flex-grow-1"
            onClick={handleProceed}
            disabled={!allAvailable}
          >
            <i className="bi bi-arrow-right me-2"></i>Continue
          </button>
        </div>

        {checked && !allAvailable && (
          <p className="text-danger text-center mt-3 small">
            <i className="bi bi-exclamation-circle me-1"></i>
            Some slots are unavailable. Please update the highlighted services and check again.
          </p>
        )}

        <button className="btn btn-link text-muted w-100 mt-2" onClick={() => navigate('/')}>
          <i className="bi bi-arrow-left me-1"></i>Back to Services
        </button>
      </div>
    </div>
  );
}
