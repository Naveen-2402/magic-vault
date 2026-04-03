'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [newCat, setNewCat] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');

  const fetchCategories = async () => {
    const res = await fetch('/api/categories');
    const data = await res.json();
    setCategories(data);
  };

  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCat.trim()) return;
    await fetch('/api/categories', {
      method: 'POST',
      body: JSON.stringify({ name: newCat }),
    });
    setNewCat('');
    fetchCategories();
  };

  const editCategory = async (id: number) => {
    if (!editingName.trim()) return;
    await fetch(`/api/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name: editingName }),
    });
    setEditingId(null);
    setEditingName('');
    fetchCategories();
  };

  const deleteCategory = async (id: number) => {
    if (!confirm('Delete this category and all saved passwords?')) return;
    await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    fetchCategories();
  };
  

  

  useEffect(() => { fetchCategories(); }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

        :root {
          --bg: #ffffff;
          --surface: #f7f7f5;
          --surface-hover: #f0f0ec;
          --border: #e8e8e4;
          --border-strong: #d0d0ca;
          --text-primary: #111110;
          --text-secondary: #6e6e66;
          --text-muted: #b0b0a6;
          --accent: #111110;
          --accent-text: #ffffff;
          --danger: #d04040;
          --danger-bg: #fff5f5;
        }

        .cp-wrap {
          font-family: 'Sora', sans-serif;
          color: var(--text-primary);
          max-width: 760px;
        }

        /* ── Header ── */
        .cp-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 36px;
          flex-wrap: wrap;
        }

        .cp-title-group {}

        .cp-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10.5px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 8px;
        }

        .cp-title {
          font-size: 24px;
          font-weight: 600;
          letter-spacing: -0.03em;
          color: var(--text-primary);
          line-height: 1;
        }

        /* ── Add form ── */
        .cp-form {
          display: flex;
          align-items: center;
          gap: 8px;
          align-self: flex-end;
        }

        .cp-form-input {
          font-family: 'Sora', sans-serif;
          font-size: 13.5px;
          font-weight: 400;
          color: var(--text-primary);
          background: var(--surface);
          border: 1.5px solid var(--border);
          border-radius: 10px;
          padding: 9px 13px;
          outline: none;
          width: 200px;
          transition: border-color 0.18s, box-shadow 0.18s, background 0.18s;
          -webkit-appearance: none;
        }

        .cp-form-input::placeholder {
          color: var(--text-muted);
          font-weight: 300;
        }

        .cp-form-input:focus {
          border-color: var(--accent);
          background: var(--bg);
          box-shadow: 0 0 0 3px rgba(17,17,16,0.07);
        }

        .cp-form-btn {
          font-family: 'Sora', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: var(--accent-text);
          background: var(--accent);
          border: none;
          border-radius: 10px;
          padding: 9px 16px;
          cursor: pointer;
          white-space: nowrap;
          transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
          box-shadow: 0 1px 2px rgba(0,0,0,0.12), 0 3px 8px rgba(0,0,0,0.08);
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .cp-form-btn:hover {
          background: #2a2a28;
          box-shadow: 0 2px 4px rgba(0,0,0,0.14), 0 6px 14px rgba(0,0,0,0.1);
          transform: translateY(-1px);
        }

        .cp-form-btn:active { transform: translateY(0); }

        /* ── Divider ── */
        .cp-divider {
          height: 1px;
          background: var(--border);
          margin-bottom: 4px;
        }

        /* ── Count row ── */
        .cp-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 0;
          margin-bottom: 4px;
        }

        .cp-count {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: var(--text-muted);
          letter-spacing: 0.05em;
        }

        /* ── List ── */
        .cp-list {
          display: flex;
          flex-direction: column;
        }

        .cp-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 5px 6px 5px 4px;
          border-radius: 10px;
          transition: background 0.15s;
          margin: 0 -6px;
        }

        .cp-item:hover { background: var(--surface); }

        .cp-item-link {
          display: flex;
          align-items: center;
          gap: 14px;
          flex: 1;
          text-decoration: none;
          padding: 9px 8px;
          min-width: 0;
          border-radius: 8px;
        }

        .cp-item-num {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          color: var(--text-muted);
          flex-shrink: 0;
          width: 22px;
          text-align: right;
          line-height: 1;
        }

        .cp-item-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: var(--surface-hover);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          flex-shrink: 0;
          transition: background 0.15s, border-color 0.15s;
        }

        .cp-item:hover .cp-item-icon {
          background: #e8e8e0;
          border-color: var(--border-strong);
        }

        .cp-item-name {
          font-size: 14px;
          font-weight: 400;
          color: var(--text-primary);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          flex: 1;
        }

        .cp-item-id {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10.5px;
          color: var(--text-muted);
          flex-shrink: 0;
          margin-left: auto;
        }

        .cp-item-arrow {
          font-size: 14px;
          color: var(--text-muted);
          flex-shrink: 0;
          transition: color 0.15s, transform 0.15s;
          line-height: 1;
        }

        .cp-item:hover .cp-item-arrow {
          color: var(--text-secondary);
          transform: translateX(2px);
        }

        .cp-delete {
          width: 28px;
          height: 28px;
          border-radius: 7px;
          border: none;
          background: transparent;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          color: var(--text-muted);
          flex-shrink: 0;
          transition: background 0.15s, color 0.15s;
          opacity: 0;
          transition: opacity 0.15s, background 0.15s, color 0.15s;
        }

        .cp-item:hover .cp-delete { opacity: 1; }
        .cp-delete:hover {
          background: var(--danger-bg);
          color: var(--danger);
        }

        /* ── Row separator ── */
        .cp-sep {
          height: 1px;
          background: var(--border);
          margin: 0 10px;
          opacity: 0.7;
        }

        /* ── Empty ── */
        .cp-empty {
          padding: 56px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          text-align: center;
        }

        .cp-empty-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: var(--surface);
          border: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          margin-bottom: 4px;
        }

        .cp-empty-title {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-secondary);
        }

        .cp-empty-sub {
          font-size: 12.5px;
          font-weight: 300;
          color: var(--text-muted);
        }
      `}</style>

      <div className="cp-wrap">

        {/* Header */}
        <div className="cp-header">
          <div className="cp-title-group">
            <p className="cp-label">Resource Directories</p>
            <h1 className="cp-title">Categories</h1>
          </div>

          <form onSubmit={addCategory} className="cp-form">
            <input
              type="text"
              placeholder="Category name…"
              className="cp-form-input"
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
            />
            <button type="submit" className="cp-form-btn">
              <span>+</span> Add
            </button>
          </form>
        </div>

        <div className="cp-divider" />

        {/* Meta row */}
        <div className="cp-meta">
          <span className="cp-count">
            {categories.length === 0
              ? 'No categories'
              : `${categories.length} categor${categories.length === 1 ? 'y' : 'ies'}`}
          </span>
        </div>

        {/* List */}
        <div className="cp-list">
          {categories.length === 0 ? (
            <div className="cp-empty">
              <div className="cp-empty-icon">🗂️</div>
              <p className="cp-empty-title">Nothing here yet</p>
              <p className="cp-empty-sub">Add a category above to get started</p>
            </div>
          ) : (
            categories.map((cat, i) => (
              <div key={cat.id}>
                <div className="cp-item">
                  <Link href={`/dashboard/${cat.id}`} className="cp-item-link">
                    <span className="cp-item-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="cp-item-icon">🗂️</span>
                    <span className="cp-item-name">{cat.name}</span>
                    <span className="cp-item-id">#{cat.id}</span>
                    <span className="cp-item-arrow">→</span>
                  </Link>
                  {editingId === cat.id ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', paddingRight: '4px' }}>
                      <input
                        autoFocus
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') editCategory(cat.id);
                          if (e.key === 'Escape') { setEditingId(null); setEditingName(''); }
                        }}
                        className="cp-form-input"
                        style={{ width: '160px', padding: '6px 10px', fontSize: '13px' }}
                      />
                      <button onClick={() => editCategory(cat.id)} className="cp-form-btn" style={{ padding: '6px 12px', fontSize: '12px' }}>Save</button>
                      <button onClick={() => { setEditingId(null); setEditingName(''); }} className="cp-delete" style={{ opacity: 1, color: '#b0b0a6' }}>✕</button>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => { setEditingId(cat.id); setEditingName(cat.name); }}
                        className="cp-delete"
                        aria-label="Edit category"
                        style={{ fontSize: '13px' }}
                      >
                        ✎
                      </button>
                      <button
                        onClick={() => deleteCategory(cat.id)}
                        className="cp-delete"
                        aria-label="Delete category"
                      >
                        ✕
                      </button>
                    </>
                  )}
                </div>
                {i < categories.length - 1 && <div className="cp-sep" />}
              </div>
            ))
          )}
        </div>

      </div>
    </>
  );
}