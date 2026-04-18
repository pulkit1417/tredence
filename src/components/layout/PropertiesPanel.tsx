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
import { Trash2, Beaker, ChevronRight } from 'lucide-react';

const formComponents: Record<string, React.FC<any>> = {
  start: StartNodeForm,
  task: TaskNodeForm,
  approval: ApprovalNodeForm,
  automated: AutomatedNodeForm,
  end: EndNodeForm,
};

const PropertiesPanel = () => {
  const { nodes, edges, selectedNodeId, deleteNode } = useWorkflowStore();
  const [isSimulating, setIsSimulating] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [showSandbox, setShowSandbox] = useState(false);

  const selectedNode = nodes.find(n => n.id === selectedNodeId);
  const FormComponent = selectedNode ? formComponents[selectedNode.type as string] : null;

  const handleSimulate = async () => {
    setIsSimulating(true);
    setShowSandbox(true);
    setLogs(['Initializing secure sandbox...', 'Tracing workflow edges...']);
    try {
      const resultLogs = await simulateWorkflow({ nodes, edges });
      setLogs((prev) => [...prev, ...resultLogs]);
    } catch (e) {
      setLogs((prev) => [...prev, '❌ Simulation Failed due to system error.']);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <aside style={{
      width: '340px',
      borderLeft: '1px solid rgba(226, 232, 240, 0.8)',
      background: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      boxShadow: '-4px 0 15px rgba(0,0,0,0.02)'
    }}>
      {/* Node Properties Section */}
      <div style={{ padding: '24px', flexGrow: 1, overflowY: 'auto' }}>
        <h3 style={{ 
          fontSize: '15px', 
          fontWeight: '700', 
          color: 'var(--text-primary)', 
          marginBottom: '20px', 
          paddingBottom: '12px', 
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          Configuration
          
          {selectedNode && (
            <button
              onClick={() => deleteNode(selectedNode.id)}
              title="Delete Node"
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#ef4444',
                padding: '6px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <Trash2 size={16} />
            </button>
          )}
        </h3>

        {selectedNode && FormComponent ? (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <FormComponent nodeId={selectedNode.id} data={selectedNode.data} />
          </div>
        ) : (
          <div style={{ 
            fontSize: '14px', 
            color: 'var(--text-secondary)', 
            textAlign: 'center', 
            marginTop: '60px',
            background: 'var(--bg-app)',
            padding: '30px 20px',
            borderRadius: '12px',
            border: '1px dashed #cbd5e1'
          }}>
            Select a node on the canvas to configure its properties
          </div>
        )}
      </div>

      {/* Sandbox Section */}
      <div style={{ padding: '24px', borderTop: '1px solid #f1f5f9', background: 'var(--bg-panel)' }}>
        <button
          onClick={handleSimulate}
          disabled={isSimulating}
          style={{
            width: '100%',
            padding: '12px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: 'var(--bg-panel)',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            fontSize: '14px',
            cursor: isSimulating ? 'not-allowed' : 'pointer',
            opacity: isSimulating ? 0.8 : 1,
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.2), 0 2px 4px -1px rgba(59, 130, 246, 0.1)',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
          onMouseOver={(e) => { if (!isSimulating) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 8px -1px rgba(59, 130, 246, 0.3)'; } }}
          onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(59, 130, 246, 0.2)'; }}
        >
          <Beaker size={16} />
          {isSimulating ? 'Running Simulation...' : 'Test Workflow Workflow'}
        </button>

        {showSandbox && (
          <div style={{
            background: '#0f172a',
            color: '#38bdf8',
            padding: '16px',
            borderRadius: '8px',
            fontSize: '13px',
            fontFamily: '"Fira Code", "JetBrains Mono", monospace',
            maxHeight: '220px',
            overflowY: 'auto',
            border: '1px solid #1e293b',
            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)',
            animation: 'slideUp 0.3s ease'
          }}>
            <div style={{ color: 'var(--text-secondary)', marginBottom: '12px', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Execution Log</div>
            {logs.map((log, i) => (
              <div key={i} style={{ 
                marginBottom: '8px', 
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
                color: log.includes('❌') ? '#ef4444' : log.includes('✅') ? '#10b981' : log.includes('⚠️') ? '#f59e0b' : '#e0f2fe'
              }}>
                <ChevronRight size={14} style={{ marginTop: '2px', flexShrink: 0, opacity: 0.5 }} />
                <span style={{ lineHeight: '1.4' }}>{log}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default PropertiesPanel;
