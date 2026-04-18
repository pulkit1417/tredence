import React from 'react';
import { useWorkflowStore } from '../../store/workflowStore';
import { LayoutDashboard, Activity, Layers, PlayCircle, GitMerge, FileText } from 'lucide-react';

const Dashboard = () => {
  const { workflows, loadWorkflow, setActiveTab } = useWorkflowStore();

  const totalWorkflows = workflows.length;
  const totalNodes = workflows.reduce((acc, w) => acc + (w.nodes?.length || 0), 0);
  const totalAutomated = workflows.reduce((acc, w) => acc + (w.nodes?.filter(n => n.type === 'automated').length || 0), 0);

  const statCardStyle = {
    background: 'var(--bg-panel)',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
    flex: '1 1 200px'
  };

  const handleOpenWorkflow = (id: string) => {
    loadWorkflow(id);
    setActiveTab('Workflows');
  };

  return (
    <div style={{ padding: '40px', width: '100%', height: '100%', overflowY: 'auto', background: 'var(--bg-app)', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
        <div style={{ background: '#3b82f6', padding: '10px', borderRadius: '10px' }}>
          <LayoutDashboard size={24} color="#ffffff" />
        </div>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-primary)', margin: 0 }}>AutoHR Dashboard</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>Overview of all automated processes and performance metrics.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px', marginBottom: '40px', flexWrap: 'wrap' }}>
        <div style={statCardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)' }}>Total Workflows</span>
            <GitMerge size={20} color="#3b82f6" />
          </div>
          <span style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{totalWorkflows}</span>
          <span style={{ fontSize: '12px', color: '#10b981', fontWeight: '500' }}>+2 this week</span>
        </div>

        <div style={statCardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)' }}>Nodes Configured</span>
            <Layers size={20} color="#f59e0b" />
          </div>
          <span style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{totalNodes}</span>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Across all systems</span>
        </div>

        <div style={statCardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)' }}>Automated Actions</span>
            <Activity size={20} color="#8b5cf6" />
          </div>
          <span style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{totalAutomated}</span>
          <span style={{ fontSize: '12px', color: '#10b981', fontWeight: '500' }}>100% active</span>
        </div>
      </div>

      <div style={{ background: 'var(--bg-panel)', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-primary)', margin: 0 }}>Recent Workflows</h2>
        </div>
        
        {workflows.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px' }}>
            No workflows created yet. Navigate to the Workflows tab to get started.
          </div>
        ) : (
          <div>
            {workflows.map((w, i) => (
              <div 
                key={w.id} 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  padding: '16px 24px', 
                  borderBottom: i < workflows.length - 1 ? '1px solid #f1f5f9' : 'none',
                  transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-app)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ background: 'var(--border-light)', padding: '10px', borderRadius: '8px', marginRight: '16px' }}>
                  <FileText size={18} color="#64748b" />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)' }}>{w.name}</h3>
                  <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                    {w.nodes?.length || 0} nodes • Last updated {new Date(w.updatedAt).toLocaleTimeString()}
                  </div>
                </div>
                <button 
                  onClick={() => handleOpenWorkflow(w.id)}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px', 
                    background: 'var(--bg-panel)', 
                    border: '1px solid #e2e8f0', 
                    padding: '8px 16px', 
                    borderRadius: '6px', 
                    fontSize: '12px', 
                    fontWeight: '600', 
                    color: '#3b82f6',
                    cursor: 'pointer'
                  }}
                >
                  <PlayCircle size={14} /> Open
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
