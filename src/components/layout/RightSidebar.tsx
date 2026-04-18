import React, { useState } from 'react';
import { useWorkflowStore } from '../../store/workflowStore';
import {
  StartNodeForm,
  TaskNodeForm,
  ApprovalNodeForm,
  AutomatedNodeForm,
  EndNodeForm
} from '../forms/NodeForms';
import { simulateWorkflow } from '../../api/mockApi';
import { Trash2, Play, ClipboardList, CheckCircle, Zap, Flag, GripVertical } from 'lucide-react';
import type { NodeType } from '../../types/workflow';

const formComponents: Record<string, React.FC<any>> = {
  start: StartNodeForm,
  task: TaskNodeForm,
  approval: ApprovalNodeForm,
  automated: AutomatedNodeForm,
  end: EndNodeForm,
};

const RightSidebar = () => {
  const { nodes, edges, selectedNodeId, deleteNode } = useWorkflowStore();
  const [isSimulating, setIsSimulating] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [showSandbox, setShowSandbox] = useState(false);

  const selectedNode = nodes.find(n => n.id === selectedNodeId);
  const FormComponent = selectedNode ? formComponents[selectedNode.type as string] : null;

  const handleSimulate = async () => {
    setIsSimulating(true);
    setShowSandbox(true);
    setLogs(['Initializing run environment...', 'Evaluating edges...']);
    try {
      const resultLogs = await simulateWorkflow({ nodes, edges });
      setLogs((prev) => [...prev, ...resultLogs]);
    } catch (e) {
      setLogs((prev) => [...prev, '❌ Simulation Failed']);
    } finally {
      setIsSimulating(false);
    }
  };

  const onDragStart = (event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const templates = [
    { type: 'start', label: 'Initialize Workflow', icon: <Play size={14} color="#10b981" />, bg: '#ecfdf5', border: '#10b981' },
    { type: 'task', label: 'Manual Action', icon: <ClipboardList size={14} color="#3b82f6" />, bg: '#eff6ff', border: '#3b82f6' },
    { type: 'approval', label: 'Approval Verification', icon: <CheckCircle size={14} color="#f59e0b" />, bg: '#fffbeb', border: '#f59e0b' },
    { type: 'automated', label: 'System Execution', icon: <Zap size={14} color="#8b5cf6" />, bg: '#f5f3ff', border: '#8b5cf6' },
    { type: 'end', label: 'Completion', icon: <Flag size={14} color="#ef4444" />, bg: '#fef2f2', border: '#ef4444' },
  ];

  return (
    <aside style={{
      width: '320px',
      borderLeft: '1px solid #f1f5f9',
      background: 'var(--bg-app)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      flexShrink: 0,
      zIndex: 10
    }}>
      {/* Simulation Engine Panel */}
      <div style={{ padding: '20px 24px', background: 'var(--bg-panel)', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-primary)' }}>Performance Overview</h3>
        </div>
        
        <button
          onClick={handleSimulate}
          disabled={isSimulating}
          style={{
            width: '100%',
            padding: '10px',
            background: isSimulating ? 'var(--border-medium)' : '#10b981',
            color: isSimulating ? 'var(--text-secondary)' : 'var(--bg-panel)',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '600',
            fontSize: '13px',
            cursor: isSimulating ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s'
          }}
        >
          {isSimulating ? 'Simulating...' : 'Test Execution'}
        </button>

        {showSandbox && (
          <div style={{
            marginTop: '12px',
            background: 'var(--bg-panel)',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            padding: '8px',
            fontSize: '11px',
            fontFamily: 'monospace',
            color: 'var(--text-secondary)',
            maxHeight: '120px',
            overflowY: 'auto'
          }}>
            {logs.map((log, i) => (
              <div key={i} style={{ marginBottom: '4px' }}>{log}</div>
            ))}
          </div>
        )}
      </div>

      <div style={{ flexGrow: 1, overflowY: 'auto' }}>
        
        {/* Node Properties (Only visible when a node is selected) */}
        {selectedNode && FormComponent ? (
          <div style={{ padding: '20px 24px', background: 'var(--bg-panel)', borderBottom: '1px solid #f1f5f9' }}>
            <h3 style={{ 
              fontSize: '13px', 
              fontWeight: 'bold', 
              color: 'var(--text-primary)', 
              marginBottom: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              Node Settings
              
              <button
                onClick={() => deleteNode(selectedNode.id)}
                title="Delete Node"
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#ef4444',
                  padding: '4px',
                  borderRadius: '4px'
                }}
              >
                <Trash2 size={14} />
              </button>
            </h3>
            <FormComponent nodeId={selectedNode.id} data={selectedNode.data} />
          </div>
        ) : null}

        {/* Templates Panel - Matches "Flow Objectives" styling */}
        <div style={{ padding: '20px 24px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '16px' }}>Flow Components</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {templates.map((node) => (
              <div
                key={node.type}
                onClick={() => {
                   const newNode = {
                     id: Math.random().toString(36).substring(2, 9),
                     type: node.type as NodeType,
                     position: { x: Math.random() * 200 + 100, y: Math.random() * 200 + 100 },
                     data: { label: node.label }
                   };
                   useWorkflowStore.getState().addNode(newNode);
                }}
                onDragStart={(event) => onDragStart(event, node.type as NodeType)}
                draggable
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'var(--bg-panel)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  padding: '12px',
                  cursor: 'grab',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                }}
              >
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', 
                  width: '24px', height: '24px', borderRadius: '4px', background: node.bg,
                  marginRight: '12px' 
                }}>
                  {node.icon}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-primary)' }}>{node.label}</span>
                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Drag to canvas</span>
                </div>
                <div style={{ marginLeft: 'auto', opacity: 0.3 }}>
                  <GripVertical size={14} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </aside>
  );
};

export default RightSidebar;
