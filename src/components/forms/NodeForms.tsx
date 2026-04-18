import React, { useEffect, useState } from 'react';
import { useWorkflowStore } from '../../store/workflowStore';
import { fetchAutomations } from '../../api/mockApi';
import type { MockAction } from '../../types/workflow';

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  border: '1px solid #cbd5e1',
  borderRadius: '8px',
  fontSize: '13px',
  marginTop: '6px',
  marginBottom: '16px',
  boxSizing: 'border-box' as const,
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  color: 'var(--text-primary)',
  background: 'var(--bg-panel)'
};

const labelStyle = {
  display: 'block',
  fontSize: '12px',
  fontWeight: '600',
  color: 'var(--text-secondary)',
  letterSpacing: '0.3px',
};

const FormGroup = ({ children }: { children: React.ReactNode }) => (
  <div style={{ marginBottom: '4px' }}>
    {children}
  </div>
);

export const StartNodeForm = ({ nodeId, data }: { nodeId: string; data: any }) => {
  const updateNodeData = useWorkflowStore(state => state.updateNodeData);

  return (
    <div>
      <FormGroup>
        <label style={labelStyle}>Start Title</label>
        <input
          style={inputStyle}
          value={data.label || ''}
          placeholder="e.g. Employee Onboarding"
          onChange={(e) => updateNodeData(nodeId, { label: e.target.value })}
        />
      </FormGroup>
    </div>
  );
};

export const TaskNodeForm = ({ nodeId, data }: { nodeId: string; data: any }) => {
  const updateNodeData = useWorkflowStore(state => state.updateNodeData);

  return (
    <div>
      <FormGroup>
        <label style={labelStyle}>Task Title *</label>
        <input
          style={inputStyle}
          value={data.label || ''}
          placeholder="e.g. Collect Documents"
          onChange={(e) => updateNodeData(nodeId, { label: e.target.value })}
          required
        />
      </FormGroup>
      
      <FormGroup>
        <label style={labelStyle}>Description</label>
        <textarea
          style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
          value={data.description || ''}
          placeholder="Detailed explanation..."
          onChange={(e) => updateNodeData(nodeId, { description: e.target.value })}
        />
      </FormGroup>

      <FormGroup>
        <label style={labelStyle}>Assignee</label>
        <input
          style={inputStyle}
          value={data.assignee || ''}
          placeholder="e.g. HR Admin"
          onChange={(e) => updateNodeData(nodeId, { assignee: e.target.value })}
        />
      </FormGroup>

      <FormGroup>
        <label style={labelStyle}>Due Date</label>
        <input
          type="date"
          style={inputStyle}
          value={data.dueDate || ''}
          onChange={(e) => updateNodeData(nodeId, { dueDate: e.target.value })}
        />
      </FormGroup>
    </div>
  );
};

export const ApprovalNodeForm = ({ nodeId, data }: { nodeId: string; data: any }) => {
  const updateNodeData = useWorkflowStore(state => state.updateNodeData);

  return (
    <div>
      <FormGroup>
        <label style={labelStyle}>Approval Title</label>
        <input
          style={inputStyle}
          value={data.label || ''}
          onChange={(e) => updateNodeData(nodeId, { label: e.target.value })}
        />
      </FormGroup>

      <FormGroup>
        <label style={labelStyle}>Approver Role</label>
        <select
          style={inputStyle}
          value={data.approverRole || ''}
          onChange={(e) => updateNodeData(nodeId, { approverRole: e.target.value })}
        >
          <option value="" disabled>Select Role</option>
          <option value="Manager">Manager</option>
          <option value="HRBP">HRBP</option>
          <option value="Director">Director</option>
          <option value="VP">VP</option>
        </select>
      </FormGroup>

      <FormGroup>
        <label style={labelStyle}>Auto-approve Threshold (Days)</label>
        <input
          type="number"
          style={inputStyle}
          placeholder="e.g. 5"
          value={data.autoApproveThreshold || ''}
          onChange={(e) => updateNodeData(nodeId, { autoApproveThreshold: Number(e.target.value) })}
        />
      </FormGroup>
    </div>
  );
};

export const AutomatedNodeForm = ({ nodeId, data }: { nodeId: string; data: any }) => {
  const updateNodeData = useWorkflowStore(state => state.updateNodeData);
  const [actions, setActions] = useState<MockAction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAutomations().then((res) => {
      setActions(res);
      setLoading(false);
    });
  }, []);

  const selectedAction = actions.find(a => a.id === data.actionId);

  return (
    <div>
      <FormGroup>
        <label style={labelStyle}>Step Title</label>
        <input
          style={inputStyle}
          value={data.label || ''}
          onChange={(e) => updateNodeData(nodeId, { label: e.target.value })}
        />
      </FormGroup>

      <FormGroup>
        <label style={labelStyle}>API Action</label>
        <select
          style={inputStyle}
          value={data.actionId || ''}
          disabled={loading}
          onChange={(e) => {
            updateNodeData(nodeId, { actionId: e.target.value, actionParams: {} });
          }}
        >
          <option value="" disabled>{loading ? 'Loading APIs...' : 'Select Action'}</option>
          {actions.map(a => (
            <option key={a.id} value={a.id}>{a.label}</option>
          ))}
        </select>
      </FormGroup>

      {selectedAction && selectedAction.params.length > 0 && (
        <div style={{ marginTop: '8px', padding: '16px', background: 'var(--bg-app)', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '12px', fontWeight: 'bold' }}>Action Parameters</div>
          {selectedAction.params.map(param => (
            <div key={param}>
              <label style={labelStyle}>{param.charAt(0).toUpperCase() + param.slice(1)}</label>
              <input
                style={{ ...inputStyle, marginBottom: '8px' }}
                value={data.actionParams?.[param] || ''}
                placeholder={`Enter ${param}...`}
                onChange={(e) => {
                  updateNodeData(nodeId, {
                    actionParams: {
                      ...(data.actionParams || {}),
                      [param]: e.target.value
                    }
                  });
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const EndNodeForm = ({ nodeId, data }: { nodeId: string; data: any }) => {
  const updateNodeData = useWorkflowStore(state => state.updateNodeData);

  return (
    <div>
      <FormGroup>
        <label style={labelStyle}>Node Label</label>
        <input
          style={inputStyle}
          value={data.label || ''}
          onChange={(e) => updateNodeData(nodeId, { label: e.target.value })}
        />
      </FormGroup>
      
      <FormGroup>
        <label style={labelStyle}>Completion Message</label>
        <input
          style={inputStyle}
          value={data.endMessage || ''}
          placeholder="Workflow finished successfully."
          onChange={(e) => updateNodeData(nodeId, { endMessage: e.target.value })}
        />
      </FormGroup>

      <label style={{ 
        ...labelStyle, 
        display: 'flex', 
        alignItems: 'center', 
        gap: '12px',
        marginTop: '20px',
        cursor: 'pointer' 
      }}>
        <div style={{ position: 'relative', width: '36px', height: '20px' }}>
          <input
            type="checkbox"
            checked={!!data.summaryFlag}
            onChange={(e) => updateNodeData(nodeId, { summaryFlag: e.target.checked })}
            style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }}
          />
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: data.summaryFlag ? '#3b82f6' : 'var(--border-dark)',
            borderRadius: '20px',
            transition: '0.3s'
          }}>
            <div style={{
              position: 'absolute',
              height: '14px', width: '14px',
              left: data.summaryFlag ? '19px' : '3px',
              bottom: '3px',
              backgroundColor: 'white',
              borderRadius: '50%',
              transition: '0.3s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
            }} />
          </div>
        </div>
        Generate Summary Report
      </label>
    </div>
  );
};
