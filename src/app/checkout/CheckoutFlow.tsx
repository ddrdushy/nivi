'use client';

import { useState } from 'react';

type Props = {
  paymentConfig: any;
  shippingZones: any[];
  taxZones: any[];
}

export default function CheckoutFlow({ paymentConfig, shippingZones, taxZones }: Props) {
  const [step, setStep] = useState(1);
  const [state, setState] = useState('');
  
  const activeTax = taxZones.find(t => t.region.toLowerCase() === state.toLowerCase())?.rate || 0;
  const activeShipping = shippingZones.find(s => s.regions.toLowerCase().includes(state.toLowerCase()))?.baseRate || 0;

  return (
    <>
      <div style={{ padding: '40px', marginBottom: '32px', backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', opacity: step !== 1 ? 0.6 : 1, transition: 'all 0.3s ease' }}>
        <h2 style={{ marginBottom: '24px', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px', fontSize: '18px', textTransform: 'uppercase', letterSpacing: '1px' }}>
          1. Shipping Information
        </h2>
        <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: '1fr 1fr' }}>
          <input type="text" className="input-base" style={{ borderRadius: '0' }} placeholder="First Name" />
          <input type="text" className="input-base" style={{ borderRadius: '0' }} placeholder="Last Name" />
          <input type="email" className="input-base" placeholder="Email Address" style={{ gridColumn: 'span 2', borderRadius: '0' }} />
          <input type="text" className="input-base" placeholder="Address" style={{ gridColumn: 'span 2', borderRadius: '0' }} />
          <input type="text" className="input-base" placeholder="State/Region (e.g. CA)" style={{ borderRadius: '0' }} onChange={(e) => setState(e.target.value)} />
          <input type="text" className="input-base" placeholder="Zip Code" style={{ borderRadius: '0' }} />
        </div>
        {step === 1 && (
          <button className="btn-primary" onClick={() => setStep(2)} style={{ marginTop: '24px', borderRadius: '0', padding: '12px 32px' }}>Calculate Shipping</button>
        )}
      </div>

      {step >= 2 && (
        <div style={{ padding: '40px', marginBottom: '32px', backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', opacity: step !== 2 ? 0.6 : 1, transition: 'all 0.3s ease' }}>
          <h2 style={{ marginBottom: '24px', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px', fontSize: '18px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            2. Order Summary & Discounts
          </h2>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
            <input type="text" className="input-base" placeholder="Enter Promo Code (e.g. SUMMER10)" style={{ borderRadius: '0', textTransform: 'uppercase' }} />
            <button className="btn-outline" style={{ padding: '0 24px', borderRadius: '0' }}>Apply</button>
          </div>
          
          <div style={{ backgroundColor: '#f9f9f9', padding: '16px', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span>Shipping to {state || 'Region'}</span>
              <span>Rs. {activeShipping}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span>Regional Tax ({activeTax}%)</span>
              <span>Calculated on Subtotal</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', borderTop: '1px solid var(--color-border)', paddingTop: '12px', marginTop: '12px' }}>
              <span>Estimated Added Value</span>
              <span>Rs. {activeShipping} + Tax</span>
            </div>
          </div>
          {step === 2 && (
             <button className="btn-primary" onClick={() => setStep(3)} style={{ marginTop: '24px', borderRadius: '0', padding: '12px 32px' }}>Proceed to Payment</button>
          )}
        </div>
      )}

      {step >= 3 && (
        <div style={{ padding: '40px', backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)' }}>
          <h2 style={{ marginBottom: '24px', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px', fontSize: '18px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            3. Payment Method
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {paymentConfig.manual && (
              <label style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', border: '1px solid var(--color-border)', cursor: 'pointer' }}>
                <input type="radio" name="payment_method" value="MANUAL" defaultChecked />
                <div>
                  <strong style={{ display: 'block', fontSize: '14px', textTransform: 'uppercase' }}>Cash on Delivery</strong>
                  <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Pay with cash upon delivery</span>
                </div>
              </label>
            )}
            {paymentConfig.stripe && (
               <label style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', border: '1px solid var(--color-border)', cursor: 'pointer' }}>
                 <input type="radio" name="payment_method" value="STRIPE" />
                 <div><strong style={{ display: 'block', fontSize: '14px', textTransform: 'uppercase' }}>Stripe</strong></div>
               </label>
            )}
          </div>
          <button className="btn-primary" style={{ width: '100%', marginTop: '40px', padding: '18px 0', fontSize: '16px', borderRadius: '0' }}>
            Complete Secure Payment
          </button>
        </div>
      )}
    </>
  );
}
