import { useCallback, useEffect, useRef } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  applyNodeChanges,
  BackgroundVariant
} from '@xyflow/react';
import type {
  Connection,
  Edge,
  Node,
  NodeChange
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import AgentNode from './AgentNode';

const nodeTypes = {
  custom: AgentNode,
};

export default function AgentFlowCanvas({ 
  agents, 
  onUpdatePosition, 
  onConnect,
  onNodeClick,
  onNodeDoubleClick
}: {
  agents: any[];
  onUpdatePosition: (id: string, x: number, y: number) => void;
  onConnect: (sourceId: string, targetId: string) => void;
  onNodeClick?: (id: string) => void;
  onNodeDoubleClick?: (id: string) => void;
}) {
  const [nodes, setNodes] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  // Track which agent IDs are on canvas - only re-sync when this changes
  const prevAgentIdsRef = useRef<string>('');
  const initialized = useRef(false);

  useEffect(() => {
    // Compute a stable key from agent IDs — only re-sync if IDs added/removed
    const currentIds = agents.map((a: any) => a.id).sort().join(',');
    const idsChanged = currentIds !== prevAgentIdsRef.current;

    if (!idsChanged && initialized.current) {
      // Same set of agents — only sync edges in case a parentId changed via DB
      setEdges(
        agents
          .filter((a: any) => a.parentId)
          .map((a: any) => ({
            id: `e${a.parentId}-${a.id}`,
            source: a.parentId,
            target: a.id,
            animated: true,
            style: { stroke: 'var(--primary)', strokeWidth: 2 },
          }))
      );
      return;
    }

    prevAgentIdsRef.current = currentIds;

    // IDs changed (agent added or deleted) — merge nodes
    setNodes(prev => {
      const existingMap = new Map(prev.map(n => [n.id, n]));
      const agentIds = new Set(agents.map((a: any) => a.id));
      const merged: Node[] = agents.map((a: any) => {
        const existing = existingMap.get(a.id);
        return {
          id: a.id,
          type: 'custom',
          // Preserve position if node already on canvas
          position: existing?.position ?? {
            x: typeof a.positionX === 'number' && a.positionX !== 0 ? a.positionX : 80 + Math.random() * 500,
            y: typeof a.positionY === 'number' && a.positionY !== 0 ? a.positionY : 80 + Math.random() * 300,
          },
          data: { label: a.name, role: a.role },
        };
      });
      return merged.filter(n => agentIds.has(n.id));
    });

    setEdges(
      agents
        .filter((a: any) => a.parentId)
        .map((a: any) => ({
          id: `e${a.parentId}-${a.id}`,
          source: a.parentId,
          target: a.id,
          animated: true,
          style: { stroke: 'var(--primary)', strokeWidth: 2 },
        }))
    );

    initialized.current = true;
  }, [agents, setNodes, setEdges]);

  const onNodesChangeHandler = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds));
      
      changes.forEach((change) => {
        if (change.type === 'position' && change.dragging === false && change.position) {
          onUpdatePosition(change.id, change.position.x, change.position.y);
        }
      });
    },
    [setNodes, onUpdatePosition]
  );

  const onConnectHandler = useCallback(
    (params: Connection) => {
      const edge = { ...params, animated: true, style: { stroke: 'var(--primary)', strokeWidth: 2 } };
      setEdges((eds) => addEdge(edge as any, eds));
      if (params.target && params.source) {
        onConnect(params.source, params.target);
      }
    },
    [setEdges, onConnect]
  );

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChangeHandler}
        onEdgesChange={onEdgesChange}
        onConnect={onConnectHandler}
        onNodeClick={(_, node) => onNodeClick?.(node.id)}
        onNodeDoubleClick={(_, node) => onNodeDoubleClick?.(node.id)}
        nodeTypes={nodeTypes}
        fitView={!initialized.current}
        colorMode="dark"
      >
        <Controls style={{ background: 'rgba(9,9,11,0.8)', borderColor: 'var(--border)', fill: 'var(--text-muted)' }} />
        <MiniMap 
          nodeColor={(node) => {
            return node.data.role === 'manager' ? 'rgba(0, 245, 230, 1)' : 'rgba(255, 191, 0, 1)';
          }}
          maskColor="rgba(0,0,0,0.7)"
          style={{ background: '#09090b', border: '1px solid var(--border)' }}
        />
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="rgba(255,255,255,0.05)" />
      </ReactFlow>
    </div>
  );
}
