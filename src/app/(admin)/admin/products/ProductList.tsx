'use client';

import { useState } from 'react';
import Image from 'next/image';
import { bulkDeleteProducts, createProduct, updateProduct, deleteProduct } from '@/app/actions/products';
import type { ProductInput } from '@/app/actions/products';

type Variation = {
  id?: string;
  optionName: string;
  price: number;
  stock: number;
};

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string | null;
  category: { id: string; name: string } | null;
  variations: { id: string; optionName: string; price: number; stock: number }[];
};

type FormState = {
  name: string;
  description: string;
  price: string;
  stock: string;
  imageUrl: string;
  categoryId: string;
  variations: Variation[];
};

const EMPTY_FORM: FormState = {
  name: '',
  description: '',
  price: '',
  stock: '',
  imageUrl: '',
  categoryId: '',
  variations: [],
};

const NEW_VARIATION: Variation = { optionName: '', price: 0, stock: 0 };

export default function ProductList({
  initialProducts,
  categories,
}: {
  initialProducts: Product[];
  categories: { id: string; name: string }[];
}) {
  const [products, setProducts] = useState(initialProducts);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [editTarget, setEditTarget] = useState<Product | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setEditTarget(null);
    setFormError(null);
    setModal('add');
  };

  const openEdit = (p: Product) => {
    setForm({
      name: p.name,
      description: p.description,
      price: String(p.price),
      stock: String(p.stock),
      imageUrl: p.imageUrl || '',
      categoryId: p.category?.id || '',
      variations: p.variations.map((v) => ({
        id: v.id,
        optionName: v.optionName,
        price: v.price,
        stock: v.stock,
      })),
    });
    setEditTarget(p);
    setFormError(null);
    setModal('edit');
  };

  const closeModal = () => {
    setModal(null);
    setEditTarget(null);
  };

  const addVariation = () =>
    setForm((f) => ({ ...f, variations: [...f.variations, { ...NEW_VARIATION }] }));

  const updateVariation = (index: number, patch: Partial<Variation>) =>
    setForm((f) => ({
      ...f,
      variations: f.variations.map((v, i) => (i === index ? { ...v, ...patch } : v)),
    }));

  const removeVariation = (index: number) =>
    setForm((f) => ({ ...f, variations: f.variations.filter((_, i) => i !== index) }));

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);

    const payload: ProductInput = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: parseFloat(form.price) || 0,
      stock: parseInt(form.stock, 10) || 0,
      imageUrl: form.imageUrl.trim(),
      categoryId: form.categoryId,
      variations: form.variations.map((v) => ({
        id: v.id,
        optionName: v.optionName.trim(),
        price: Number(v.price) || 0,
        stock: Number(v.stock) || 0,
      })),
    };

    const res =
      modal === 'add' ? await createProduct(payload) : await updateProduct(editTarget!.id, payload);

    if (res.success) {
      window.location.reload();
    } else {
      setFormError(res.error);
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    setLoading(true);
    const res = await deleteProduct(id);
    if (res.success) {
      setProducts(products.filter((p) => p.id !== id));
    } else {
      alert(res.error);
    }
    setLoading(false);
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedIds.length} products?`)) return;
    setLoading(true);
    const res = await bulkDeleteProducts(selectedIds);
    if (res.success) {
      setProducts(products.filter((p) => !selectedIds.includes(p.id)));
      setSelectedIds([]);
    } else {
      alert(res.error);
    }
    setLoading(false);
  };

  const toggleSelect = (id: string) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  const toggleAll = () =>
    setSelectedIds(selectedIds.length === products.length ? [] : products.map((p) => p.id));

  const inputStyle = { borderRadius: '4px', marginBottom: '12px', fontSize: '14px' };

  return (
    <>
      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          {selectedIds.length > 0 && (
            <button
              onClick={handleBulkDelete}
              disabled={loading}
              style={{ padding: '8px 16px', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '4px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
            >
              Delete {selectedIds.length} Selected
            </button>
          )}
        </div>
        <button onClick={openAdd} className="btn-primary" style={{ borderRadius: '4px', fontSize: '13px' }}>
          + Add New Product
        </button>
      </div>

      {/* Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: '40px' }}>
                <input
                  type="checkbox"
                  checked={selectedIds.length === products.length && products.length > 0}
                  onChange={toggleAll}
                />
              </th>
              <th>Product</th>
              <th>Category</th>
              <th>Variations</th>
              <th style={{ textAlign: 'right' }}>Price</th>
              <th style={{ textAlign: 'right' }}>Stock</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '48px', color: '#9ca3af' }}>
                  No products yet. Add your first product!
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(product.id)}
                      onChange={() => toggleSelect(product.id)}
                    />
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {product.imageUrl && (
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          width={44}
                          height={44}
                          style={{ objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--color-border)' }}
                        />
                      )}
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--color-dark)' }}>{product.name}</div>
                        <div style={{ fontSize: '11px', color: '#6b7280' }}>ID: {product.id.slice(0, 8)}…</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: '13px', color: '#6b7280' }}>{product.category?.name || 'Uncategorized'}</td>
                  <td>
                    <span style={{ fontSize: '12px', backgroundColor: '#f3f4f6', padding: '2px 8px', borderRadius: '4px' }}>
                      {product.variations.length} {product.variations.length === 1 ? 'option' : 'options'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', fontWeight: 600 }}>Rs. {product.price.toLocaleString()}</td>
                  <td style={{ textAlign: 'right' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        padding: '3px 10px',
                        borderRadius: '50px',
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: product.stock > 0 ? '#d1fae5' : '#fee2e2',
                        color: product.stock > 0 ? '#065f46' : '#991b1b',
                      }}
                    >
                      {product.stock > 0 ? `${product.stock} IN STOCK` : 'OUT OF STOCK'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => openEdit(product)}
                        style={{ color: 'var(--color-gold)', fontSize: '13px', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        style={{ color: '#dc2626', fontSize: '13px', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '24px',
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '640px',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '32px',
              boxShadow: '0 25px 50px rgba(0,0,0,0.15)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '22px', color: 'var(--color-dark)' }}>
                {modal === 'add' ? 'Add New Product' : 'Edit Product'}
              </h2>
              <button onClick={closeModal} style={{ fontSize: '24px', color: '#6b7280', cursor: 'pointer', background: 'none', border: 'none' }}>
                ×
              </button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <input
                className="input-base"
                style={inputStyle}
                placeholder="Product Name *"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <textarea
                className="input-base"
                style={{ ...inputStyle, height: '80px', resize: 'vertical' }}
                placeholder="Description *"
                required
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <input
                  className="input-base"
                  style={inputStyle}
                  type="number"
                  placeholder="Base Price (Rs.) *"
                  required
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
                <input
                  className="input-base"
                  style={inputStyle}
                  type="number"
                  placeholder="Base Stock Qty *"
                  required
                  min="0"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                />
              </div>
              <input
                className="input-base"
                style={inputStyle}
                placeholder="Image URL (e.g. /images/products/myproduct.png)"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              />
              <select
                className="input-base"
                style={inputStyle}
                value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              >
                <option value="">— No Category —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              {/* Variations Repeater */}
              <div
                style={{
                  marginTop: '16px',
                  marginBottom: '16px',
                  padding: '16px',
                  backgroundColor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px' }}>Variations</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>Optional — e.g. 50ml, 100ml, 1 Litre.</div>
                  </div>
                  <button
                    type="button"
                    onClick={addVariation}
                    style={{
                      padding: '6px 12px',
                      fontSize: '12px',
                      fontWeight: 600,
                      backgroundColor: 'var(--color-primary)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    + Add Variation
                  </button>
                </div>

                {form.variations.length === 0 && (
                  <div style={{ fontSize: '12px', color: '#9ca3af', padding: '8px 0' }}>
                    No variations yet. The base price + stock above will be used.
                  </div>
                )}

                {form.variations.map((v, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1.5fr 1fr 1fr auto',
                      gap: '8px',
                      marginBottom: '8px',
                      alignItems: 'center',
                    }}
                  >
                    <input
                      className="input-base"
                      style={{ borderRadius: '4px', fontSize: '13px', marginBottom: 0 }}
                      placeholder="Label (e.g. 100ml)"
                      value={v.optionName}
                      onChange={(e) => updateVariation(i, { optionName: e.target.value })}
                      required
                    />
                    <input
                      className="input-base"
                      style={{ borderRadius: '4px', fontSize: '13px', marginBottom: 0 }}
                      type="number"
                      placeholder="Price"
                      min="0"
                      step="0.01"
                      value={v.price}
                      onChange={(e) => updateVariation(i, { price: parseFloat(e.target.value) || 0 })}
                      required
                    />
                    <input
                      className="input-base"
                      style={{ borderRadius: '4px', fontSize: '13px', marginBottom: 0 }}
                      type="number"
                      placeholder="Stock"
                      min="0"
                      value={v.stock}
                      onChange={(e) => updateVariation(i, { stock: parseInt(e.target.value, 10) || 0 })}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => removeVariation(i)}
                      style={{
                        padding: '8px',
                        color: '#dc2626',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '18px',
                      }}
                      aria-label="Remove variation"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              {formError && (
                <div
                  style={{
                    padding: '12px',
                    backgroundColor: '#fee2e2',
                    color: '#dc2626',
                    borderRadius: '4px',
                    fontSize: '13px',
                    marginBottom: '16px',
                  }}
                >
                  {formError}
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button type="button" onClick={closeModal} className="btn-outline" style={{ flex: 1, borderRadius: '4px' }}>
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="btn-primary" style={{ flex: 1, borderRadius: '4px' }}>
                  {loading ? 'Saving…' : modal === 'add' ? 'Create Product' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
