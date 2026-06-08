import { useMemo } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

export default function MindGraph() {
  const initialNodes = useMemo(() => [
    { id: '1', position: { x: 0, y: 0 }, data: { label: 'Knowledge Base' }, style: { background: 'var(--primary-dim)', color: 'white', border: '1px solid var(--primary)', borderRadius: '8px', padding: '10px' } },
    { id: '2', position: { x: -100, y: 100 }, data: { label: 'guidelines.md' }, style: { background: 'var(--background)', color: 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: '4px', padding: '8px', fontSize: '12px' } },
    { id: '3', position: { x: 100, y: 100 }, data: { label: 'architecture.md' }, style: { background: 'var(--background)', color: 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: '4px', padding: '8px', fontSize: '12px' } },
    { id: '4', position: { x: 200, y: 0 }, data: { label: 'Projects' }, style: { background: 'var(--primary-dim)', color: 'white', border: '1px solid var(--primary)', borderRadius: '8px', padding: '10px' } },
    { id: '5', position: { x: 200, y: 100 }, data: { label: 'project-a.md' }, style: { background: 'var(--background)', color: 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: '4px', padding: '8px', fontSize: '12px' } },
  ], []);

  const initialEdges = useMemo(() => [
    { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: 'var(--text-muted)' } },
    { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: 'var(--text-muted)' } },
    { id: 'e4-5', source: '4', target: '5', animated: true, style: { stroke: 'var(--text-muted)' } },
  ], []);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={initialNodes}
        edges={initialEdges}
        fitView
        colorMode="dark"
      >
        <Controls style={{ background: 'rgba(9,9,11,0.8)', borderColor: 'var(--border)', fill: 'var(--text-muted)' }} />
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="rgba(255,255,255,0.05)" />
      </ReactFlow>
    </div>
  );
}
