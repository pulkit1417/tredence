
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Play, ClipboardList, CheckCircle, Zap, Flag, GripHorizontal } from 'lucide-react';

const nodeBaseStyle = {
  background: 'var(--bg-panel)',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  minWidth: '240px',
  boxShadow: '0 2px 8px -2px rgba(0, 0, 0, 0.05), 0 4px 12px -2px rgba(0, 0, 0, 0.02)',
  display: 'flex',
  flexDirection: 'column' as const,
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
};

const topSectionStyle = {
  padding: '16px',
  display: 'flex',
  gap: '12px',
};

const textContainerStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  gap: '2px',
};

const titleStyle = {
  fontSize: '13px',
  fontWeight: '600',
  color: 'var(--text-primary)',
};

const subtitleStyle = {
  fontSize: '11px',
  color: 'var(--text-secondary)',
};

const footerStyle = {
  borderTop: '1px solid #f1f5f9',
  padding: '8px 16px',
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  fontSize: '11px',
  color: 'var(--text-secondary)',
  background: '#fcfcfd',
  borderBottomLeftRadius: '8px',
  borderBottomRightRadius: '8px',
};

const metricItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '4px',
  fontWeight: '500',
};

const iconWrapperStyle = (color: string) => ({
  width: '28px',
  height: '28px',
  borderRadius: '6px',
  background: `${color}15`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: color,
});

const handleStyle = {
  width: '8px',
  height: '8px',
  background: 'var(--bg-panel)',
  border: '2px solid #cbd5e1',
};

// Start Node (Pill shaped, like Image 1 "Initialize Data")
export const StartNode = ({ data, selected }: NodeProps) => {
  const d = data as any;
  return (
    <div style={{
      background: 'var(--bg-panel)',
      border: `1px solid ${selected ? '#10b981' : '#10b981'}`,
      boxShadow: selected ? '0 0 0 2px rgba(16, 185, 129, 0.2)' : '0 2px 6px rgba(0,0,0,0.04)',
      borderRadius: '20px',
      padding: '8px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: '#10b981',
      fontSize: '12px',
      fontWeight: '600'
    }}>
      <Play size={14} fill="#10b981" />
      {d.label || 'Initialize Data'}
      <Handle type="source" position={Position.Right} style={{ ...handleStyle, borderColor: '#10b981' }} />
    </div>
  );
};

// Task Node (Standard Card Layout)
export const TaskNode = ({ data, selected }: NodeProps) => {
  const d = data as any;
  const color = '#3b82f6';
  return (
    <div style={{ ...nodeBaseStyle, border: selected ? `1px solid ${color}` : nodeBaseStyle.border, boxShadow: selected ? `0 0 0 2px ${color}33, 0 4px 12px rgba(0,0,0,0.05)` : nodeBaseStyle.boxShadow }}>
      <Handle type="target" position={Position.Left} style={{ ...handleStyle, borderColor: color }} />
      <div style={topSectionStyle}>
        <div style={iconWrapperStyle(color)}>
          <ClipboardList size={14} />
        </div>
        <div style={textContainerStyle}>
          <div style={titleStyle}>{d.label || 'Task Step'}</div>
          <div style={subtitleStyle}>{d.description ? (d.description.length > 30 ? d.description.slice(0, 30) + '...' : d.description) : 'A human task workflow'}</div>
        </div>
        <div style={{ marginLeft: 'auto', opacity: 0.2 }}><GripHorizontal size={14} /></div>
      </div>
      <div style={footerStyle}>
        <div style={metricItemStyle}><span style={{color: 'var(--text-secondary)'}}>Assignee:</span> {d.assignee || 'Unassigned'}</div>
        {d.dueDate && <div style={metricItemStyle}><span style={{color: 'var(--text-secondary)'}}>Due:</span> {d.dueDate}</div>}
      </div>
      <Handle type="source" position={Position.Right} style={{ ...handleStyle, borderColor: color }} />
    </div>
  );
};

// Approval Node
export const ApprovalNode = ({ data, selected }: NodeProps) => {
  const d = data as any;
  const color = '#f59e0b';
  return (
    <div style={{ ...nodeBaseStyle, border: selected ? `1px solid ${color}` : nodeBaseStyle.border, boxShadow: selected ? `0 0 0 2px ${color}33, 0 4px 12px rgba(0,0,0,0.05)` : nodeBaseStyle.boxShadow }}>
      <Handle type="target" position={Position.Left} style={{ ...handleStyle, borderColor: color }} />
      <div style={topSectionStyle}>
        <div style={iconWrapperStyle(color)}>
          <CheckCircle size={14} />
        </div>
        <div style={textContainerStyle}>
          <div style={titleStyle}>{d.label || 'Approval Step'}</div>
          <div style={subtitleStyle}>Required approval action</div>
        </div>
        <div style={{ marginLeft: 'auto', opacity: 0.2 }}><GripHorizontal size={14} /></div>
      </div>
      <div style={footerStyle}>
        <div style={metricItemStyle}><span style={{color: 'var(--text-secondary)'}}>Role:</span> {d.approverRole || 'Any'}</div>
        {d.autoApproveThreshold && <div style={metricItemStyle}><span style={{color: 'var(--text-secondary)'}}>Auto (d):</span> {d.autoApproveThreshold}</div>}
      </div>
      
      {/* Approved Branch */}
      <Handle type="source" position={Position.Right} id="approved" style={{ top: '35%', ...handleStyle, borderColor: '#10b981' }} />
      <div style={{ position: 'absolute', right: '-12px', top: '15%', fontSize: '9px', color: '#10b981', fontWeight: 'bold' }}>✓</div>
      
      {/* Rejected Branch */}
      <Handle type="source" position={Position.Right} id="rejected" style={{ top: '65%', ...handleStyle, borderColor: '#ef4444' }} />
      <div style={{ position: 'absolute', right: '-12px', top: '75%', fontSize: '10px', color: '#ef4444', fontWeight: 'bold' }}>✕</div>
    </div>
  );
};

// Automated Node
export const AutomatedNode = ({ data, selected }: NodeProps) => {
  const d = data as any;
  const color = '#8b5cf6';
  return (
    <div style={{ ...nodeBaseStyle, border: selected ? `1px solid ${color}` : nodeBaseStyle.border, boxShadow: selected ? `0 0 0 2px ${color}33, 0 4px 12px rgba(0,0,0,0.05)` : nodeBaseStyle.boxShadow }}>
      <Handle type="target" position={Position.Left} style={{ ...handleStyle, borderColor: color }} />
      <div style={topSectionStyle}>
        <div style={iconWrapperStyle(color)}>
          <Zap size={14} />
        </div>
        <div style={textContainerStyle}>
          <div style={titleStyle}>{d.label || 'Automated Action'}</div>
          <div style={subtitleStyle}>System triggered execution</div>
        </div>
        <div style={{ marginLeft: 'auto', opacity: 0.2 }}><GripHorizontal size={14} /></div>
      </div>
      <div style={footerStyle}>
        <div style={{ ...metricItemStyle, fontFamily: 'monospace', fontWeight: 'bold', color }}>{d.actionId || 'NO_ACTION'}</div>
      </div>
      <Handle type="source" position={Position.Right} style={{ ...handleStyle, borderColor: color }} />
    </div>
  );
};

// End Node (Pill shaped like Image 1 "Finalize")
export const EndNode = ({ data, selected }: NodeProps) => {
  const d = data as any;
  const color = '#8b5cf6';
  return (
    <div style={{
      background: 'var(--bg-panel)',
      border: `1px solid ${selected ? color : color}`,
      boxShadow: selected ? `0 0 0 2px ${color}33` : '0 2px 6px rgba(0,0,0,0.04)',
      borderRadius: '20px',
      padding: '8px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: color,
      fontSize: '12px',
      fontWeight: '600'
    }}>
      <Handle type="target" position={Position.Left} style={{ ...handleStyle, borderColor: color }} />
      {d.label || 'Finalize'}
      <Flag size={14} fill={color} />
    </div>
  );
};
