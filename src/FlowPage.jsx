import { useState, useCallback } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import QuestionNode from './QuestionNode';
import EditModal from './EditModal';
import axios from 'axios';

const initialNodes = [
  { id: 'n1', type: 'question', position: { x: 0, y: 0 }, data: { label: 'Click to edit question 1' } },
  { id: 'n2', type: 'question', position: { x: 0, y: 100 }, data: { label: 'Click to ' } },
];
const initialEdges = [{ id: 'n1-n2', source: 'n1', target: 'n2' }];

export default function FlowPage({ editRow }) {
  const [nodes, setNodes] = useState(
    editRow
      ? [{ id: 'edit', type: 'question', position: { x: 0, y: 0 }, data: { label: editRow.buildings || editRow.question || editRow.label || '' } }]
      : initialNodes
  );
  const [edges, setEdges] = useState(initialEdges);
  const [nodeId, setNodeId] = useState(3);
  const [submitting, setSubmitting] = useState(false);

  const [editModal, setEditModal] = useState({ open: false, id: null, value: '' });

  const nodeTypes = { question: (props) => (
    <QuestionNode {...props} onDelete={handleNodeDelete} onEdit={handleNodeEdit} />
  ) };
  function handleNodeEdit(id, label) {
    setEditModal({ open: true, id, value: label });
  }

  function handleModalChange(val) {
    setEditModal((m) => ({ ...m, value: val }));
  }

  function handleModalSave() {
    if (editModal.id) {
      handleNodeLabelChange(editModal.id, editModal.value);
    }
    setEditModal({ open: false, id: null, value: '' });
  }

  function handleModalClose() {
    setEditModal({ open: false, id: null, value: '' });
  }

  function handleNodeDelete(id) {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
  }

  function handleNodeLabelChange(id, label) {
    setNodes((nds) => nds.map((n) => n.id === id ? { ...n, data: { ...n.data, label } } : n));
  }

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

  const addQuestionNode = () => {
    setNodes((nds) => [
      ...nds,
      {
        id: `n${nodeId}`,
        type: 'question',
        position: { x: 100 + nodeId * 20, y: 100 + nodeId * 20 },
        data: { label: '' },
      },
    ]);
    setNodeId((id) => id + 1);
  };

  async function handleSubmit() {
    setSubmitting(true);
    try {
      // Adjust the API URL to your Laravel endpoint
      const questionLabels = nodes.map(n => n.data.label);
      const response = await axios.post('http://127.0.0.1:8000/api/survey/store_survey', {
        questions: questionLabels,
        edges,
      });
      console.log(response.data);
      alert('Questions saved successfully!');
    } catch (error) {
      alert('Failed to save questions.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <button onClick={addQuestionNode} style={{ position: 'absolute', zIndex: 10, top: 20, left: 20, padding: '8px 18px', fontSize: 16 }}>
        Add Question
      </button>
      <button
        onClick={handleSubmit}
        disabled={submitting}
        style={{ position: 'absolute', zIndex: 10, top: 20, left: 160, padding: '8px 18px', fontSize: 16, background: '#1976d2', color: '#fff' }}
      >
        {submitting ? 'Saving...' : 'Submit'}
      </button>
      <EditModal
        open={editModal.open}
        value={editModal.value}
        onChange={handleModalChange}
        onSave={handleModalSave}
        onClose={handleModalClose}
      />
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      />
    </div>
  );
}