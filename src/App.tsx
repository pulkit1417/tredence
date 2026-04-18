import React from 'react';
import { WorkflowCanvas } from './components/canvas/WorkflowCanvas';
import { LeftNav } from './components/layout/LeftNav';
import RightSidebar from './components/layout/RightSidebar';
import Dashboard from './components/layout/Dashboard';
import SettingsView from './components/layout/SettingsView';
import SupportView from './components/layout/SupportView';
import { Undo, Redo, LayoutGrid, Save, Trash2 } from 'lucide-react';
import { useWorkflowStore } from './store/workflowStore';
import './index.css';

function App() {
  const [showDropdown, setShowDropdown] = React.useState(false);
  const { undo, redo, saveToLocalStorage, loadFromLocalStorage, activeTab, clearWorkspace, workflows, currentWorkflowId, currentWorkflowName, loadWorkflow, createNewWorkflow, theme } = useWorkflowStore();

  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  React.useEffect(() => {
    loadFromLocalStorage();
  }, [loadFromLocalStorage]);

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', fontFamily: '"Inter", sans-serif', background: 'var(--bg-app)', overflow: 'hidden' }}>
      
      {/* Static Left Navigation */}
      <LeftNav />

      {/* Main Canvas Area */}
      <main style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, position: 'relative' }}>
        
        {/* Top bar internal to canvas area */}
        {activeTab === 'Workflows' && (
        <header style={{
          height: '60px',
          background: 'var(--bg-panel)',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          zIndex: 10
        }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={undo} style={{ cursor: 'pointer', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-panel)', border: '1px solid var(--border-medium)', borderRadius: '6px', color: 'var(--text-secondary)' }}><Undo size={14}/></button>
            <button onClick={redo} style={{ cursor: 'pointer', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-panel)', border: '1px solid var(--border-medium)', borderRadius: '6px', color: 'var(--text-secondary)' }}><Redo size={14}/></button>
          </div>

          <div style={{ textAlign: 'center', position: 'relative' }}>
            <div 
              onClick={() => setShowDropdown(!showDropdown)}
              style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', cursor: 'pointer' }}
            >
              {currentWorkflowName} <span style={{ color: 'var(--text-secondary)' }}>▼</span>
            </div>
            
            {showDropdown && (
              <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', marginTop: '12px', background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', padding: '8px', minWidth: '220px', zIndex: 100, textAlign: 'left' }}>
                 <div style={{ fontSize: '10px', fontWeight: 'bold', color: 'var(--text-secondary)', padding: '4px 12px', textTransform: 'uppercase' }}>Saved Workflows</div>
                 {workflows.length === 0 && <div style={{ padding: '8px 12px', fontSize: '12px', color: 'var(--border-dark)' }}>No saved workflows</div>}
                 {workflows.map(w => (
                   <div 
                     key={w.id} 
                     onClick={(e) => { e.stopPropagation(); loadWorkflow(w.id); setShowDropdown(false); }} 
                     style={{ padding: '8px 12px', cursor: 'pointer', borderRadius: '4px', background: w.id === currentWorkflowId ? 'var(--bg-app)' : 'transparent', color: w.id === currentWorkflowId ? 'var(--text-primary)' : 'var(--text-secondary)', fontSize: '13px', fontWeight: w.id === currentWorkflowId ? '600' : '500', display: 'flex', alignItems: 'center', gap: '8px' }}
                   >
                      <LayoutGrid size={14} color={w.id === currentWorkflowId ? '#3b82f6' : 'var(--border-dark)'} />
                      {w.name}
                   </div>
                 ))}
                 <div style={{ borderTop: '1px solid #f1f5f9', margin: '4px 0' }}></div>
                 <div onClick={(e) => { e.stopPropagation(); const name = prompt('Enter a name for the new workflow:'); if(name) { createNewWorkflow(name); setShowDropdown(false); } }} style={{ padding: '8px 12px', cursor: 'pointer', color: '#10b981', fontWeight: '600', fontSize: '13px' }}>
                    + Create New Workflow
                 </div>
              </div>
            )}
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>Overview of HR Workflows.</div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
             <button 
                title="Clear Workspace" 
                onClick={() => { if(window.confirm('Are you sure you want to clear the canvas?')) clearWorkspace(); }} 
                style={{ cursor: 'pointer', padding: '0 12px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: 'var(--bg-panel)', border: '1px solid #e2e8f0', borderRadius: '6px', color: '#ef4444', fontSize: '13px', fontWeight: '500' }}
             >
                <Trash2 size={14} /> Clear
             </button>
             <button 
                title="Save Workflow" 
                onClick={() => saveToLocalStorage()} 
                style={{ cursor: 'pointer', padding: '0 16px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: '#10b981', border: 'none', borderRadius: '6px', color: 'var(--bg-panel)', fontSize: '13px', fontWeight: '600', boxShadow: '0 2px 4px rgba(16,185,129,0.2)' }}
             >
                <Save size={14} /> Save
             </button>
          </div>
        </header>
        )}

        <div style={{ flexGrow: 1, position: 'relative', width: '100%', height: activeTab === 'Workflows' ? 'calc(100% - 60px)' : '100%' }}>
          {activeTab === 'Workflows' ? (
             <WorkflowCanvas />
          ) : activeTab === 'Dashboard' ? (
             <Dashboard />
          ) : activeTab === 'Settings' ? (
             <SettingsView />
          ) : activeTab === 'Support' ? (
             <SupportView />
          ) : (
             <div style={{ display: 'flex', height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: 'var(--text-secondary)' }}>
                <LayoutGrid size={48} style={{ opacity: 0.2, marginBottom: '16px' }} />
                <h3>{activeTab} Module</h3>
                <p style={{ fontSize: '12px' }}>This module is under construction. Please return to Workflows.</p>
             </div>
          )}
        </div>
      </main>

      {/* Right Sidebar Tools & Config */}
      {activeTab === 'Workflows' && <RightSidebar />}
      
    </div>
  );
}

export default App;
