import React from 'react';
import { Play, ClipboardList, CheckCircle, Zap, Flag, GripVertical } from 'lucide-react';
import type { NodeType } from '../../types/workflow';

const Sidebar = () => {
  const onDragStart = (event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const nodeTypes = [
    { type: 'start', label: 'Start Node', icon: <Play size={16} color="#10b981" fill="#10b981" />, bg: '#ecfdf5', border: '#10b981' },
    { type: 'task', label: 'Human Task', icon: <ClipboardList size={16} color="#3b82f6" />, bg: '#eff6ff', border: '#3b82f6' },
    { type: 'approval', label: 'Approval Step', icon: <CheckCircle size={16} color="#f59e0b" />, bg: '#fffbeb', border: '#f59e0b' },
    { type: 'automated', label: 'Automated Action', icon: <Zap size={16} color="#8b5cf6" fill="#8b5cf6" />, bg: '#f5f3ff', border: '#8b5cf6' },
    { type: 'end', label: 'End Node', icon: <Flag size={16} color="#ef4444" fill="#ef4444" />, bg: '#fef2f2', border: '#ef4444' },
  ];

  return (
    <aside style={{
      width: '260px',
      borderRight: '1px solid rgba(226, 232, 240, 0.8)',
      padding: '24px',
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      boxShadow: '4px 0 15px rgba(0,0,0,0.02)',
      zIndex: 10,
    }}>
      <h3 style={{ 
        fontSize: '15px', 
        fontWeight: '700', 
        color: 'var(--text-primary)', 
        marginBottom: '4px',
        letterSpacing: '0.2px'
      }}>
        Components
      </h3>
      <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.4' }}>
        Drag and drop components to build your HR workflow.
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {nodeTypes.map((node) => (
          <div
            key={node.type}
            onDragStart={(event) => onDragStart(event, node.type as NodeType)}
            draggable
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 14px',
              background: 'var(--bg-panel)',
              border: `1px solid #e2e8f0`,
              borderLeft: `4px solid ${node.border}`,
              borderRadius: '8px',
              cursor: 'grab',
              fontSize: '13px',
              fontWeight: '600',
              color: 'var(--text-primary)',
              boxShadow: '0 2px 4px -1px rgba(0, 0, 0, 0.03)',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px) translateX(2px)';
              e.currentTarget.style.boxShadow = `0 6px 12px -2px rgba(0,0,0,0.08), -2px 0 0 ${node.border}`;
              e.currentTarget.style.background = node.bg;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = '0 2px 4px -1px rgba(0, 0, 0, 0.03)';
              e.currentTarget.style.background = 'var(--bg-panel)';
            }}
          >
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', 
              width: '28px', height: '28px', borderRadius: '6px', background: node.bg 
            }}>
              {node.icon}
            </div>
            {node.label}
            <div style={{ marginLeft: 'auto', opacity: 0.3 }}>
              <GripVertical size={14} />
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
