import React from 'react';

export default function EditModal({ open, value, onChange, onSave, onClose }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div style={{ background: '#fff', padding: 24, borderRadius: 8, minWidth: 320, boxShadow: '0 2px 16px #0002' }}>
        <h3>Edit Question</h3>
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{ width: '100%', fontSize: 16, marginBottom: 16 }}
          autoFocus
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button onClick={onClose}>Cancel</button>
          <button onClick={onSave} style={{ background: '#1976d2', color: '#fff' }}>Save</button>
        </div>
      </div>
    </div>
  );
}
