import type { MockAction, WorkflowSimulationRequest } from '../types/workflow';

const MOCK_ACTIONS: MockAction[] = [
  { id: 'send_email', label: 'Send Email', params: ['to', 'subject'] },
  { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] }
];

export const fetchAutomations = async (): Promise<MockAction[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(MOCK_ACTIONS), 500);
  });
};

export const simulateWorkflow = async (workflow: WorkflowSimulationRequest): Promise<string[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const logs: string[] = [];
      const nodes = workflow.nodes;
      const edges = workflow.edges;

      logs.push('Started Simulation...');

      const startNodes = nodes.filter(n => n.type === 'start');
      if (startNodes.length === 0) {
        logs.push('❌ Error: No Start Node found in the workflow.');
        return resolve(logs);
      }
      if (startNodes.length > 1) {
        logs.push('❌ Error: Multiple Start Nodes found.');
        return resolve(logs);
      }

      // BFS Queue to handle branches (like Approval: Approved/Rejected)
      const queue = [startNodes[0]];
      const visited = new Set<string>();

      while (queue.length > 0) {
        const currentNode = queue.shift();
        if (!currentNode) continue;

        const data = currentNode.data as any;

        switch (currentNode.type) {
          case 'start':
            if (!visited.has(currentNode.id)) logs.push(`✅ [Start]: ${data.label}`);
            break;
          case 'task':
            if (!visited.has(currentNode.id)) logs.push(`⏳ [Task]: Assigning "${data.label}" to ${data.assignee || 'Unassigned'}`);
            break;
          case 'approval':
            if (!visited.has(currentNode.id)) logs.push(`📝 [Approval]: Required from ${data.approverRole || 'Unassigned'} (Auto-approve: ${data.autoApproveThreshold || 'None'}d)`);
            break;
          case 'automated':
            if (!visited.has(currentNode.id)) logs.push(`⚙️ [Automated Step]: Executing action "${data.actionId || 'Unknown'}"`);
            break;
          case 'end':
            logs.push(`🏁 [End]: ${data.endMessage || 'Workflow Completed.'}`);
            break;
          default:
            if (!visited.has(currentNode.id)) logs.push(`⚠️ [Unknown Step]: Unrecognized step type.`);
        }

        if (visited.has(currentNode.id)) {
          // Break cycle tracing
          continue;
        }

        visited.add(currentNode.id);

        if (currentNode.type === 'end') {
          continue;
        }

        const outgoingEdges = edges.filter(e => e.source === currentNode.id);
        
        if (outgoingEdges.length > 0) {
          // For approval nodes, state which branch we push
          if (currentNode.type === 'approval') {
            const approvedEdge = outgoingEdges.find(e => e.sourceHandle === 'approved');
            const rejectedEdge = outgoingEdges.find(e => e.sourceHandle === 'rejected');
            
            if (approvedEdge) {
              logs.push(`   ↳ Branch Approved...`);
              const target = nodes.find(n => n.id === approvedEdge.target);
              if (target) queue.push(target);
            }
            if (rejectedEdge) {
              logs.push(`   ↳ Branch Rejected...`);
              const target = nodes.find(n => n.id === rejectedEdge.target);
              if (target) queue.push(target);
            }
          } else {
             // For standard nodes, push all connections down the line
             outgoingEdges.forEach(e => {
                const nextNode = nodes.find(n => n.id === e.target);
                if (nextNode) {
                  queue.push(nextNode);
                }
             });
          }
        } else {
          logs.push('⚠️ Warning: Workflow ended abruptly without an End Node.');
        }
      }

      logs.push('Simulation Completed.');
      resolve(logs);
    }, 1000);
  });
};
