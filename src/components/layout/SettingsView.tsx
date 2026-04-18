import React, { useState } from 'react';
import { Settings, Save, Bell, Shield, Database, Trash2 } from 'lucide-react';

import { useWorkflowStore } from '../../store/workflowStore';

const SettingsView = () => {
  const { theme, setTheme } = useWorkflowStore();
  const [autoSave, setAutoSave] = useState(true);

  const blockStyle = {
    background: 'var(--bg-panel)',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 2px 4px -2px rgba(0, 0, 0, 0.02)'
  };

  const headerStyle = {
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '16px',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  };

  const clearAllData = () => {
    if (window.confirm('WARNING: This will permanently delete all saved workflows, history, and configurations. Proceed?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div style={{ padding: '40px', width: '100%', height: '100%', overflowY: 'auto', background: 'var(--bg-app)', boxSizing: 'border-box' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '32px' }}>System Settings</h1>

      <div style={blockStyle}>
        <div style={headerStyle}>
          <Settings size={20} color="#3b82f6" />
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-primary)', margin: 0 }}>Application Preferences</h2>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '24px', alignItems: 'center', marginBottom: '20px' }}>
          <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)' }}>Theme Interface</label>
          <select 
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', background: 'var(--bg-app)', maxWidth: '300px', color: 'var(--text-primary)' }}
          >
            <option value="light">Light Mode Standard</option>
            <option value="dark">Dark Mode (Experimental)</option>
            <option value="system">System Default</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '24px', alignItems: 'center' }}>
          <label style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)' }}>Auto-Save Actions</label>
          <div 
            onClick={() => setAutoSave(!autoSave)}
            style={{ 
              width: '44px', height: '24px', background: autoSave ? '#10b981' : 'var(--border-dark)', 
              borderRadius: '12px', position: 'relative', cursor: 'pointer', transition: 'background 0.3s'
            }}
          >
            <div style={{
              width: '20px', height: '20px', background: 'var(--bg-panel)', borderRadius: '50%',
              position: 'absolute', top: '2px', left: autoSave ? '22px' : '2px',
              transition: 'left 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }} />
          </div>
        </div>
      </div>

      <div style={blockStyle}>
        <div style={headerStyle}>
          <Bell size={20} color="#f59e0b" />
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-primary)', margin: 0 }}>Notification Rules</h2>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Determine when AutoHR system notifies you of external state executions.</p>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
          <input type="checkbox" defaultChecked id="cb1" style={{ cursor: 'pointer' }} />
          <label htmlFor="cb1" style={{ fontSize: '14px', color: 'var(--text-primary)', cursor: 'pointer' }}>Email upon automated task failure</label>
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <input type="checkbox" defaultChecked id="cb2" style={{ cursor: 'pointer' }} />
          <label htmlFor="cb2" style={{ fontSize: '14px', color: 'var(--text-primary)', cursor: 'pointer' }}>Generate weekly logic telemetry reports</label>
        </div>
      </div>

      <div style={blockStyle}>
        <div style={headerStyle}>
          <Database size={20} color="#ef4444" />
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-primary)', margin: 0 }}>Data & Execution Isolation</h2>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '16px' }}>Administrative access specifically modifying deep layer storage mechanisms.</p>
        
        <button 
          onClick={clearAllData}
          style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', background: '#fee2e2', 
            color: '#ef4444', border: '1px solid #fecaca', padding: '10px 16px', borderRadius: '6px', 
            fontSize: '13px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' 
          }}
        >
          <Trash2 size={16} /> Factory Reset Entire System
        </button>
      </div>
      
    </div>
  );
};

export default SettingsView;
