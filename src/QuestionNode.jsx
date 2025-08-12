import React from 'react';
import { Handle, Position } from '@xyflow/react';

export default function QuestionNode({ id, data, selected, onDelete, onEdit }) {
  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit) onEdit(id, data.label);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) onDelete(id);
  };

  return (
    <div
      style={{ padding: 10, background: selected ? '#e0f7fa' : '#fff', border: '1px solid #888', borderRadius: 6, minWidth: 180, position: 'relative' }}
      onClick={e => e.stopPropagation()}
    >
      <Handle type="target" position={Position.Top} />
      <div style={{ display: 'flex', alignItems: 'center', minHeight: 24 }}>
        <div style={{ flex: 1, cursor: 'pointer' }} onClick={handleEdit}>
          {data.label || <span style={{ color: '#aaa' }}>Click to edit question</span>}
        </div>
        <button onClick={handleEdit} style={{ marginLeft: 4, fontSize: 12 }}>Edit</button>
        {onDelete && (
          <button onClick={handleDelete} style={{ marginLeft: 4, fontSize: 12, color: 'red' }}>Delete</button>
        )}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
