import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

interface AgentNodeProps {
  data: {
    label: string;
    role: string;
    status?: string;
  };
  isConnectable: boolean;
}

function AgentNode({ data, isConnectable }: AgentNodeProps) {
  const isManager = data.role === 'manager';

  return (
    <div
      className="px-4 py-3 rounded-xl shadow-lg border relative group transition-all"
      style={{
        background: 'rgba(9, 9, 11, 0.8)',
        backdropFilter: 'blur(12px)',
        borderColor: isManager ? 'rgba(0, 245, 230, 0.4)' : 'rgba(255, 191, 0, 0.3)',
        boxShadow: isManager ? '0 0 15px rgba(0, 245, 230, 0.1)' : '0 0 10px rgba(255, 191, 0, 0.05)',
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-white"
      />

      <div className="flex items-center gap-3">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
          style={{
            background: isManager ? 'rgba(0, 245, 230, 0.1)' : 'rgba(255, 191, 0, 0.1)',
            border: `1px solid ${isManager ? 'rgba(0, 245, 230, 0.3)' : 'rgba(255, 191, 0, 0.2)'}`
          }}
        >
          {isManager ? '👑' : '👷'}
        </div>
        <div>
          <div className="font-space font-bold text-sm text-white">{data.label}</div>
          <div className="text-xs uppercase tracking-wider" style={{ color: isManager ? 'var(--primary)' : 'var(--secondary)' }}>
            {data.role}
          </div>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-3 h-3"
        style={{ background: isManager ? 'var(--primary)' : 'var(--secondary)' }}
      />
    </div>
  );
}

export default memo(AgentNode);
