import React from 'react';

const steps = [
  { label: 'Services', icon: 'bi-grid-3x3-gap' },
  { label: 'Pick Slots', icon: 'bi-calendar3' },
  { label: 'Your Details', icon: 'bi-person' },
  { label: 'Confirmed', icon: 'bi-check-circle' },
];

export default function StepsBar({ current }) {
  return (
    <div className="steps-bar">
      {steps.map((step, idx) => (
        <React.Fragment key={idx}>
          <div className="step-item">
            <div className={`step-circle ${idx < current ? 'done' : idx === current ? 'active' : ''}`}>
              {idx < current ? <i className="bi bi-check-lg"></i> : idx + 1}
            </div>
            <span className={`step-label ${idx === current ? 'active' : ''}`}>{step.label}</span>
          </div>
          {idx < steps.length - 1 && (
            <div className={`step-line ${idx < current ? 'done' : ''}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
