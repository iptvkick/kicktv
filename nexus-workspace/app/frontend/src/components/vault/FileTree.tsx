import { useState, useEffect } from 'react';
import { FileText, ChevronRight, ChevronDown, Folder, Database } from 'lucide-react';
import api from '../../hooks/useApi';

interface TreeNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: TreeNode[];
}

export default function FileTree({ onSelect }: { onSelect?: (path: string) => void }) {
  const [tree, setTree] = useState<TreeNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  useEffect(() => {
    setLoading(true);
    setError(null);
    api.get('/api/vault/tree')
      .then(r => {
        const data = r.data;
        if (data?.tree) {
          // API returns a single root node - expand to its children
          const root = data.tree;
          setTree(root.children ?? (root.type === 'file' ? [root] : []));
        } else {
          setTree([]);
          setError('Vault não configurado. Vá em Configurações para definir o caminho.');
        }
        setLoading(false);
      })
      .catch(() => {
        setTree([]);
        setError('Não foi possível carregar o Vault. Verifique as configurações.');
        setLoading(false);
      });
  }, []);

  const toggleExpand = (path: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  const renderNode = (node: TreeNode, depth: number = 0) => {
    const isExpanded = expanded.has(node.path);
    const isFolder = node.type === 'folder';

    return (
      <div key={node.path}>
        <button
          onClick={() => isFolder ? toggleExpand(node.path) : onSelect?.(node.path)}
          className="w-full flex items-center gap-2 px-3 py-1.5 hover:bg-white/5 transition-colors text-left"
          style={{ paddingLeft: `${depth * 12 + 12}px` }}
        >
          {isFolder ? (
            isExpanded ? <ChevronDown size={14} className="text-zinc-400" /> : <ChevronRight size={14} className="text-zinc-400" />
          ) : (
            <div className="w-[14px]" /> // Spacer
          )}
          
          {isFolder ? (
            <Folder size={14} className="text-primary/70" />
          ) : (
            <FileText size={14} className="text-zinc-500" />
          )}
          
          <span className="text-xs font-space text-zinc-300 truncate">{node.name}</span>
        </button>
        {isFolder && isExpanded && node.children && (
          <div>
            {node.children.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  if (loading) return <div className="p-4 text-xs text-zinc-500 animate-pulse">Carregando vault...</div>;

  if (error) return (
    <div className="p-4 flex flex-col items-center gap-2 text-center">
      <Database size={20} className="text-zinc-600" />
      <p className="text-xs text-zinc-500">{error}</p>
    </div>
  );

  if (tree.length === 0) return (
    <div className="p-4 flex flex-col items-center gap-2 text-center">
      <Folder size={20} className="text-zinc-600" />
      <p className="text-xs text-zinc-500">Vault vazio.</p>
    </div>
  );

  return (
    <div className="py-2">
      {tree.map(node => renderNode(node))}
    </div>
  );
}
