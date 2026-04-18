export type NodeType = 'start' | 'task' | 'approval' | 'automated' | 'end';

export interface BaseNodeData extends Record<string, unknown> {
  label: string;
}

export interface StartNodeData extends BaseNodeData {
  metadata?: { key: string; value: string }[];
}

export interface TaskNodeData extends BaseNodeData {
  description?: string;
  assignee?: string;
  dueDate?: string;
  customFields?: { key: string; value: string }[];
}

export interface ApprovalNodeData extends BaseNodeData {
  approverRole?: 'Manager' | 'HRBP' | 'Director' | '';
  autoApproveThreshold?: number;
}

export interface AutomatedNodeData extends BaseNodeData {
  actionId?: string;
  actionParams?: Record<string, any>;
}

export interface EndNodeData extends BaseNodeData {
  endMessage?: string;
  summaryFlag?: boolean;
}

export type WorkflowNodeData = 
  | StartNodeData 
  | TaskNodeData 
  | ApprovalNodeData 
  | AutomatedNodeData 
  | EndNodeData;

export interface WorkflowSimulationRequest {
  nodes: any[];
  edges: any[];
}

export interface MockAction {
  id: string;
  label: string;
  params: string[];
}
