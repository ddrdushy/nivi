'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import { placeOrder, validateCoupon } from '@/app/actions/checkout';

type Props = {
  paymentConfig: any;
  shippingZones: any[];
  taxZones: any[];
  isLoggedIn: boolean;
  customer: { name: string; email: string; phone: string } | null;
}

export default function CheckoutFlow({ paymentConfig, shippingZones, taxZones, isLoggedIn, customer }: Props) {
  const router = useRouter();
  const { cart, subtotal, totalItems, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Coupon State
  const [couponCode, setCouponCode] = useState('');
  const [activeCoupon, setActiveCoupon] = useState<any>(null);
  const [couponError, setCouponError] = useState<string | null>(null);

  // Prefill from logged-in user if available.
  const [firstPrefill, lastPrefill] = (customer?.name ?? '').split(' ');
  const [formData, setFormData] = useState({
    firstName: firstPrefill ?? '',
    lastName: lastPrefill ?? '',
    email: customer?.email ?? '',
    address: '',
    state: '',
    zipCode: '',
    phone: customer?.phone ?? '',
    paymentMethod: 'MANUAL',
    password: '',
    confirmPassword: '',
  });

  const activeTaxRate = taxZones.find(t => t.region.toLowerCase() === formData.state.toLowerCase())?.rate || 0;
  const activeShipping = shippingZones.find(s => s.regions.toLowerCase().includes(formData.state.toLowerCase()))?.baseRate || 0;

  const discountTotal = activeCoupon?.discountAmount || 0;
  const taxTotal = ((subtotal - discountTotal) * activeTaxRate) / 100;
  const total = Math.max(0, subtotal - discountTotal + taxTotal + activeShipping);

  const handleApplyCoupon = async () => {
    setActiveCoupon(null);
    setCouponError(null);
    
    if (!couponCode) return;

    const result = await validateCoupon(couponCode, subtotal);
    if (result.success) {
      setActiveCoupon(result.coupon);
    } else {
      setCouponError(result.error || 'Failed to apply coupon.');
    }
  };

  const validateStep1 = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) return 'Please enter your first and last name.';
    if (!formData.email.trim()) return 'Email is required.';
    if (!formData.phone.trim()) return 'Phone number is required.';
    if (!formData.address.trim() || !formData.state.trim() || !formData.zipCode.trim()) return 'Please complete the shipping address.';
    if (!isLoggedIn) {
      if (formData.password.length < 6) return 'Please choose a password of at least 6 characters to create your account.';
      if (formData.password !== formData.confirmPassword) return 'Passwords do not match.';
    }
    return null;
  };

  const handleProceedFromStep1 = () => {
    const msg = validateStep1();
    if (msg) {
      setError(msg);
      return;
    }
    setError(null);
    setStep(2);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    const result = await placeOrder({
      customerName: `${formData.firstName} ${formData.lastName}`.trim(),
      customerEmail: formData.email.trim(),
      customerPhone: formData.phone.trim(),
      address: `${formData.address}, ${formData.state}, ${formData.zipCode}`,
      subtotal,
      discountTotal,
      couponId: activeCoupon?.id,
      taxTotal,
      shippingTotal: activeShipping,
      total,
      paymentMethod: formData.paymentMethod,
      password: isLoggedIn ? undefined : formData.password,
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
      const params = new URLSearchParams();
      if (result.accountCreated) params.set('account', 'new');
      else if (result.linkedExistingAccount) params.set('account', 'linked');
      router.push(`/checkout/order-success${params.toString() ? `?${params}` : ''}`);
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
          <input type="text" className="input-base" style={{ borderRadius: '0' }} placeholder="First Name *" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
          <input type="text" className="input-base" style={{ borderRadius: '0' }} placeholder="Last Name *" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
          <input type="email" className="input-base" placeholder="Email Address *" style={{ gridColumn: 'span 2', borderRadius: '0' }} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} readOnly={isLoggedIn} />
          <input type="tel" className="input-base" placeholder="Phone Number *" style={{ gridColumn: 'span 2', borderRadius: '0' }} value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
          <input type="text" className="input-base" placeholder="Street Address *" style={{ gridColumn: 'span 2', borderRadius: '0' }} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
          <input type="text" className="input-base" placeholder="State/Region (e.g. CA) *" style={{ borderRadius: '0' }} value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} />
          <input type="text" className="input-base" placeholder="Zip Code *" style={{ borderRadius: '0' }} value={formData.zipCode} onChange={e => setFormData({...formData, zipCode: e.target.value})} />
        </div>

        {!isLoggedIn && (
          <div style={{ marginTop: '32px', padding: '20px', backgroundColor: '#f9f9f9', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
              <strong style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '1px' }}>Create your account</strong>
              <Link href={`/login?callbackUrl=/checkout`} style={{ fontSize: '12px', color: 'var(--color-primary)' }}>
                Already have an account? Log in
              </Link>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '16px' }}>
              We'll set up an account with this email so you can track your order and see your history next time.
            </p>
            <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: '1fr 1fr' }}>
              <input type="password" className="input-base" style={{ borderRadius: '0' }} placeholder="Password * (min 6 chars)" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} autoComplete="new-password" />
              <input type="password" className="input-base" style={{ borderRadius: '0' }} placeholder="Confirm Password *" value={formData.confirmPassword} onChange={e => setFormData({...formData, confirmPassword: e.target.value})} autoComplete="new-password" />
            </div>
          </div>
        )}

        {step === 1 && error && (
          <div style={{ marginTop: '16px', padding: '10px 12px', backgroundColor: '#fff5f6', border: '1px solid #EC6B81', color: '#EC6B81', fontSize: '13px' }}>
            {error}
          </div>
        )}

        {step === 1 && (
          <button className="btn-primary" onClick={handleProceedFromStep1} style={{ marginTop: '24px', borderRadius: '0', padding: '12px 32px' }}>Calculate Shipping</button>
        )}
      </div>

      {step >= 2 && (
        <div style={{ padding: '40px', marginBottom: '32px', backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', opacity: step !== 2 ? 0.6 : 1, transition: 'all 0.3s ease' }}>
          <h2 style={{ marginBottom: '24px', borderBottom: '1px solid var(--color-border)', paddingBottom: '16px', fontSize: '18px', textTransform: 'uppercase', letterSpacing: '1px' }}>
            2. Order Summary & Discounts
          </h2>
          
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '16px' }}>
              <input 
                type="text" 
                className="input-base" 
                placeholder="Enter Promo Code (e.g. SUMMER10)" 
                style={{ borderRadius: '0', textTransform: 'uppercase' }} 
                value={couponCode}
                onChange={e => setCouponCode(e.target.value)}
              />
              <button 
                className="btn-outline" 
                style={{ padding: '0 24px', borderRadius: '0' }}
                onClick={handleApplyCoupon}
              >
                Apply
              </button>
            </div>
            {couponError && <div style={{ color: '#dc2626', fontSize: '12px', marginTop: '8px' }}>{couponError}</div>}
            {activeCoupon && <div style={{ color: 'var(--color-primary)', fontSize: '12px', marginTop: '8px' }}>✓ Coupon applied: {activeCoupon.code} ({activeCoupon.discountType === 'PERCENTAGE' ? `${activeCoupon.value}%` : `Rs. ${activeCoupon.value}`})</div>}
          </div>
          
          <div style={{ backgroundColor: '#f9f9f9', padding: '16px', border: '1px solid var(--color-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span>Items Total ({totalItems})</span>
              <span>Rs. {subtotal.toLocaleString()}</span>
            </div>
            
            {discountTotal > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: 'var(--color-primary)', fontWeight: '600' }}>
                <span>Discount Applied</span>
                <span>- Rs. {discountTotal.toLocaleString()}</span>
              </div>
            )}

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
                <input type="radio" name="payment_method" value="MANUAL" checked={formData.paymentMethod === 'MANUAL'} onChange={() => setFormData({...formData, paymentMethod: 'MANUAL'})} />
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
