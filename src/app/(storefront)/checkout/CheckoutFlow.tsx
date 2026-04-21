'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { placeOrder } from '@/app/actions/checkout';

type Props = {
  paymentConfig: any;
  shippingZones: any[];
  taxZones: any[];
}

export default function CheckoutFlow({ paymentConfig, shippingZones, taxZones }: Props) {
  const router = useRouter();
  const { cart, subtotal, totalItems, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    state: '',
    zipCode: '',
    phone: '',
    paymentMethod: 'MANUAL'
  });

  const activeTaxRate = taxZones.find(t => t.region.toLowerCase() === formData.state.toLowerCase())?.rate || 0;
  const activeShipping = shippingZones.find(s => s.regions.toLowerCase().includes(formData.state.toLowerCase()))?.baseRate || 0;

  const taxTotal = (subtotal * activeTaxRate) / 100;
  const total = subtotal + taxTotal + activeShipping;

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    const result = await placeOrder({
      customerName: `${formData.firstName} ${formData.lastName}`,
      customerEmail: formData.email,
      customerPhone: formData.phone,
      address: `${formData.address}, ${formData.state}, ${formData.zipCode}`,
      subtotal,
      taxTotal,
      shippingTotal: activeShipping,
      total,
      paymentMethod: formData.paymentMethod,
      items: cart.map(item => ({
        productId: item.productId,
        variationId: item.variationId,
        productName: item.name,
        quantity: item.quantity,
        price: item.price
      }))
    });

    if (result.success) {
      clearCart();
      router.push('/checkout/order-success');
    } else {
      setError(result.error || 'Failed to place order.');
      setIsLoading(false);
    }
  };

  if (totalItems === 0 && step === 1) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 0' }}>
        <h2 style={{ marginBottom: '24px' }}>Your cart is empty</h2>
        <button className="btn-primary" onClick={() => router.push('/')}>Return to Shop</button>
      </div>
    );
  }

  return (
    <>
      <div style={{ padding: '40px', marginBottom: '32px', backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', opacity: step !== 1 ? 0.6 : 1, transition: 'all 0.3s ease' }}>
        <h2 style={{ marginBottom: '24px', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px', fontSize: '18px', textTransform: 'uppercase', letterSpacing: '1px' }}>
          1. Shipping Information
        </h2>
        <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: '1fr 1fr' }}>
          <input type="text" className="input-base" style={{ borderRadius: '0' }} placeholder="First Name" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
          <input type="text" className="input-base" style={{ borderRadius: '0' }} placeholder="Last Name" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
          <input type="email" className="input-base" placeholder="Email Address" style={{ gridColumn: 'span 2', borderRadius: '0' }} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          <input type="text" className="input-base" placeholder="Phone Number" style={{ gridColumn: 'span 2', borderRadius: '0' }} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
          <input type="text" className="input-base" placeholder="Street Address" style={{ gridColumn: 'span 2', borderRadius: '0' }} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
          <input type="text" className="input-base" placeholder="State/Region (e.g. CA)" style={{ borderRadius: '0' }} value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} />
          <input type="text" className="input-base" placeholder="Zip Code" style={{ borderRadius: '0' }} value={formData.zipCode} onChange={e => setFormData({...formData, zipCode: e.target.value})} />
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
              <span>Items Total ({totalItems})</span>
              <span>Rs. {subtotal.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span>Shipping to {formData.state || 'Region'}</span>
              <span>Rs. {activeShipping.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span>Regional Tax ({activeTaxRate}%)</span>
              <span>Rs. {taxTotal.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', borderTop: '1px solid var(--color-border)', paddingTop: '12px', marginTop: '12px', fontSize: '18px' }}>
              <span>Order Total</span>
              <span>Rs. {total.toLocaleString()}</span>
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
                 <input type="radio" name="payment_method" value="STRIPE" checked={formData.paymentMethod === 'STRIPE'} onChange={() => setFormData({...formData, paymentMethod: 'STRIPE'})} />
                 <div><strong style={{ display: 'block', fontSize: '14px', textTransform: 'uppercase' }}>Stripe</strong></div>
               </label>
            )}
          </div>
          
          {error && (
            <div style={{ padding: '12px', backgroundColor: '#fff5f6', border: '1px solid #EC6B81', color: '#EC6B81', marginTop: '24px', fontSize: '13px' }}>
              ❌ {error}
            </div>
          )}

          <button 
            className="btn-primary" 
            disabled={isLoading}
            onClick={handleSubmit}
            style={{ width: '100%', marginTop: '40px', padding: '18px 0', fontSize: '16px', borderRadius: '0', opacity: isLoading ? 0.7 : 1 }}
          >
            {isLoading ? 'Processing Order...' : 'Complete Secure Payment'}
          </button>
        </div>
      )}
    </>
  );
}
