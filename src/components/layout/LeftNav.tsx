import React from 'react';
import { LayoutDashboard, ShieldCheck, Clock, BarChart2, Link as LinkIcon, Database, GitMerge, Users, Inbox, MessageSquare, Settings, HelpCircle, Layers } from 'lucide-react';
import { useWorkflowStore } from '../../store/workflowStore';

const navItemStyle = (isActive: boolean) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '8px 12px',
  fontSize: '13px',
  color: isActive ? '#ef4444' : 'var(--text-secondary)',
  background: isActive ? '#fef2f2' : 'transparent',
  fontWeight: isActive ? '600' : '500',
  borderRadius: '6px',
  cursor: 'pointer',
  transition: 'all 0.2s',
  marginBottom: '4px'
});

const sectionHeaderStyle = {
  fontSize: '11px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  color: 'var(--text-secondary)',
  fontWeight: '600',
  marginTop: '24px',
  marginBottom: '12px',
  paddingLeft: '12px'
};

export const LeftNav = () => {
  const { activeTab, setActiveTab } = useWorkflowStore();

  const handleTab = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <aside style={{
      width: '240px',
      borderRight: '1px solid #f1f5f9',
      background: 'var(--bg-panel)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      flexShrink: 0,
      zIndex: 10
    }}>
      <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #f1f5f9' }}>
        <div style={{ background: '#ef4444', padding: '6px', borderRadius: '6px' }}>
          <Layers size={18} color="white" />
        </div>
        <span style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--text-primary)' }}>AutoHR</span>
      </div>

      <div style={{ padding: '16px 12px', flexGrow: 1, overflowY: 'auto' }}>
        <div style={sectionHeaderStyle}>General</div>
        <div onClick={() => handleTab('Dashboard')} style={navItemStyle(activeTab === 'Dashboard')}><LayoutDashboard size={16} /> Dashboard</div>

        <div style={sectionHeaderStyle}>Automation</div>
        <div onClick={() => handleTab('Workflows')} style={navItemStyle(activeTab === 'Workflows')}><GitMerge size={16} /> Workflows</div>
      </div>

      <div style={{ padding: '16px 12px', borderTop: '1px solid #f1f5f9' }}>
        <div onClick={() => handleTab('Settings')} style={navItemStyle(activeTab === 'Settings')}><Settings size={16} /> Settings</div>
        <div onClick={() => handleTab('Support')} style={navItemStyle(activeTab === 'Support')}><HelpCircle size={16} /> Help & Support</div>
      </div>
    </aside>
  );
};
