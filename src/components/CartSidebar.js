import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartSidebar() {
  const { cart, removeFromCart, updateQty, totalPrice, cartOpen, setCartOpen } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    setCartOpen(false);
    navigate('/slot-selection');
  };

  return (
    <>
      {cartOpen && <div className="cart-backdrop" onClick={() => setCartOpen(false)} />}
      <div className={`cart-sidebar ${cartOpen ? 'open' : ''}`}>
        <div className="cart-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold" style={{ fontFamily: 'DM Sans, sans-serif' }}>
            <i className="bi bi-cart3 me-2"></i>Your Cart
            {cart.length > 0 && (
              <span className="badge ms-2" style={{ background: 'var(--accent)', color: 'var(--primary)' }}>
                {cart.length}
              </span>
            )}
          </h5>
          <button className="btn btn-sm btn-light" onClick={() => setCartOpen(false)}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <div className="cart-body">
          {cart.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-cart-x" style={{ fontSize: '3.5rem', color: 'var(--border)' }}></i>
              <p className="mt-3 text-muted">Your cart is empty</p>
              <p className="text-muted small">Browse services and add them here</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item._id} className="cart-item">
                <div className="d-flex justify-content-between align-items-start">
                  <div className="flex-grow-1 me-2">
                    <p className="mb-1 fw-semibold" style={{ fontSize: '0.9rem' }}>{item.name}</p>
                    <p className="mb-1 text-muted" style={{ fontSize: '0.8rem' }}>
                      <i className="bi bi-clock me-1"></i>{item.duration} min
                    </p>
                    <span className="text-muted small">₹{item.price} × {item.quantity} = </span>
                    <span className="fw-bold" style={{ color: 'var(--primary)' }}>
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => removeFromCart(item._id)}>
                    <i className="bi bi-trash3"></i>
                  </button>
                </div>
                <div className="d-flex align-items-center gap-2 mt-2">
                  <span className="text-muted small">Qty:</span>
                  <div className="input-group input-group-sm" style={{ width: '100px' }}>
                    <button className="btn btn-outline-secondary" onClick={() => updateQty(item._id, item.quantity - 1)}>-</button>
                    <span className="input-group-text bg-white">{item.quantity}</span>
                    <button className="btn btn-outline-secondary" onClick={() => updateQty(item._id, item.quantity + 1)}>+</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="d-flex justify-content-between mb-3">
              <span className="fw-semibold">Total</span>
              <span className="fw-bold fs-5" style={{ color: 'var(--primary)' }}>₹{totalPrice.toFixed(2)}</span>
            </div>
            <button className="btn btn-primary-custom w-100 py-2" onClick={handleCheckout}>
              <i className="bi bi-calendar-check me-2"></i>Book Now
            </button>
          </div>
        )}
      </div>
    </>
  );
}
