'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface SecretGateProps {
  onClose: () => void;
}

export default function SecretGate({ onClose }: SecretGateProps) {
  const router = useRouter();
  const [employeeId, setEmployeeId] = useState('');
  const [sessionPin, setSessionPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (sessionPin.length !== 4) {
      setError('Session PIN must be 4 digits.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: employeeId }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // 1. Store the user-part of the encryption key in RAM only
        sessionStorage.setItem('vault_key_fragment', sessionPin);
        
        // 2. Set the secure auth session cookie
        Cookies.set('auth_session', 'true', { 
          expires: 1,            // Expire in 1 day
          secure: true,         // Only send over HTTPS
          sameSite: 'strict'    // Prevent CSRF attacks
        });
        
        router.push('/dashboard');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

        :root {
          --bg: #ffffff;
          --surface: #f7f7f5;
          --border: #e8e8e4;
          --border-focus: #1a1a1a;
          --text-primary: #111110;
          --text-secondary: #7a7a72;
          --text-muted: #b0b0a8;
          --accent: #1a1a1a;
          --accent-hover: #333330;
          --error-bg: #fff5f5;
          --error-border: #f0a0a0;
          --error-text: #c0392b;
          --gold: #c8a750;
        }

        .sg-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          background: rgba(17, 17, 16, 0.4);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          animation: overlay-in 0.25s ease;
        }

        @keyframes overlay-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .sg-card {
          background: var(--bg);
          width: 100%;
          max-width: 400px;
          border-radius: 16px;
          padding: 40px 36px 32px;
          position: relative;
          box-shadow:
            0 0 0 1px rgba(0,0,0,0.06),
            0 4px 6px -1px rgba(0,0,0,0.04),
            0 24px 48px -8px rgba(0,0,0,0.14);
          animation: card-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes card-in {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }

        .sg-close {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: none;
          background: var(--surface);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s;
          color: var(--text-secondary);
          font-size: 14px;
        }

        .sg-close:hover {
          background: var(--border);
          color: var(--text-primary);
        }

        .sg-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 100px;
          padding: 4px 10px 4px 8px;
          margin-bottom: 24px;
        }

        .sg-badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--gold);
        }

        .sg-badge-text {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-secondary);
        }

        .sg-heading {
          font-family: 'Sora', sans-serif;
          font-size: 22px;
          font-weight: 600;
          letter-spacing: -0.03em;
          color: var(--text-primary);
          line-height: 1.2;
          margin-bottom: 6px;
        }

        .sg-subheading {
          font-family: 'Sora', sans-serif;
          font-size: 13px;
          font-weight: 300;
          color: var(--text-secondary);
          margin-bottom: 32px;
          line-height: 1.5;
        }

        .sg-error {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          background: var(--error-bg);
          border: 1px solid var(--error-border);
          border-radius: 10px;
          padding: 11px 13px;
          margin-bottom: 20px;
          font-family: 'Sora', sans-serif;
          font-size: 12px;
          font-weight: 400;
          color: var(--error-text);
          line-height: 1.5;
        }

        .sg-form {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .sg-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .sg-label {
          font-family: 'Sora', sans-serif;
          font-size: 11.5px;
          font-weight: 500;
          letter-spacing: 0.02em;
          color: var(--text-secondary);
        }

        .sg-input-wrap {
          position: relative;
        }

        .sg-input {
          width: 100%;
          font-family: 'Sora', sans-serif;
          font-size: 14px;
          font-weight: 400;
          color: var(--text-primary);
          background: var(--surface);
          border: 1.5px solid var(--border);
          border-radius: 10px;
          padding: 11px 14px;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
          -webkit-appearance: none;
        }

        .sg-input::placeholder {
          color: var(--text-muted);
          font-weight: 300;
        }

        .sg-input:focus {
          border-color: var(--border-focus);
          background: var(--bg);
          box-shadow: 0 0 0 3px rgba(26,26,26,0.07);
        }

        .sg-input-pin {
          font-family: 'JetBrains Mono', monospace;
          font-size: 18px;
          font-weight: 500;
          letter-spacing: 0.45em;
          text-align: center;
          padding-right: 10px;
        }

        .sg-pin-hint {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: var(--text-muted);
          pointer-events: none;
        }

        .sg-btn {
          width: 100%;
          padding: 13px;
          border-radius: 10px;
          border: none;
          background: var(--accent);
          color: #ffffff;
          font-family: 'Sora', sans-serif;
          font-size: 13.5px;
          font-weight: 500;
          letter-spacing: 0.01em;
          cursor: pointer;
          transition: background 0.18s, transform 0.1s, box-shadow 0.18s;
          box-shadow: 0 1px 2px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.1);
          margin-top: 4px;
        }

        .sg-btn:hover:not(:disabled) {
          background: var(--accent-hover);
          box-shadow: 0 1px 3px rgba(0,0,0,0.16), 0 6px 16px rgba(0,0,0,0.14);
          transform: translateY(-1px);
        }

        .sg-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .sg-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .sg-btn-inner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .sg-spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .sg-footer {
          margin-top: 22px;
          text-align: center;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: var(--text-muted);
          letter-spacing: 0.04em;
        }
      `}</style>

      <div className="sg-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="sg-card">

          <button className="sg-close" onClick={onClose} aria-label="Close">✕</button>

          <div className="sg-badge">
            <div className="sg-badge-dot" />
            <span className="sg-badge-text">Restricted</span>
          </div>

          <h2 className="sg-heading">Internal Portal</h2>
          <p className="sg-subheading">Sign in with your employee credentials to continue.</p>

          {error && (
            <div className="sg-error">
              <span>⚠</span>
              <span>{error}</span>
            </div>
          )}

          <form className="sg-form" onSubmit={handleSubmit}>
            <div className="sg-field">
              <label className="sg-label">Employee ID</label>
              <input
                type="password"
                required
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="Enter your employee ID"
                className="sg-input"
              />
            </div>

            <div className="sg-field">
              <label className="sg-label">Session PIN</label>
              <div className="sg-input-wrap">
                <input
                  type="text"
                  required
                  maxLength={4}
                  value={sessionPin}
                  onChange={(e) => setSessionPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="0000"
                  className="sg-input sg-input-pin"
                />
                {sessionPin.length > 0 && sessionPin.length < 4 && (
                  <span className="sg-pin-hint">{4 - sessionPin.length} left</span>
                )}
              </div>
            </div>

            <button type="submit" disabled={loading} className="sg-btn">
              <span className="sg-btn-inner">
                {loading && <span className="sg-spinner" />}
                {loading ? 'Verifying…' : 'Sign In'}
              </span>
            </button>
          </form>

          <p className="sg-footer">© {new Date().getFullYear()} Nexus Systems International</p>

        </div>
      </div>
    </>
  );
}