import React, { useCallback, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  BackgroundVariant,
  Panel,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { v4 as uuidv4 } from 'uuid';

import { useWorkflowStore } from '../../store/workflowStore';
import {
  StartNode,
  TaskNode,
  ApprovalNode,
  AutomatedNode,
  EndNode,
} from '../nodes/CustomNodes';
import type { NodeType } from '../../types/workflow';

const nodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  automated: AutomatedNode,
  end: EndNode,
};

const WorkflowCanvasComponent = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition } = useReactFlow();
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode, setSelectedNodeId, theme } =
    useWorkflowStore();

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current) return;

      const type = event.dataTransfer.getData('application/reactflow') as NodeType;
      if (!type) return;

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: uuidv4(),
        type,
        position,
        data: { label: `${type.charAt(0).toUpperCase() + type.slice(1)} Node` },
      };

      addNode(newNode);
    },
    [addNode]
  );

  const onSelectionChange = useCallback(
    ({ nodes }: { nodes: any[] }) => {
      if (nodes.length === 1) {
        setSelectedNodeId(nodes[0].id);
      } else {
        setSelectedNodeId(null);
      }
    },
    [setSelectedNodeId]
  );

  return (
    <div className="reactflow-wrapper" ref={reactFlowWrapper} style={{ flexGrow: 1, height: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        onSelectionChange={onSelectionChange}
        defaultEdgeOptions={{ 
          type: 'smoothstep', 
          style: { strokeWidth: 2, stroke: 'var(--text-secondary)' },
          animated: true,
        }}
        fitView
        colorMode={theme === 'system' ? 'light' : theme}
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="#cbd5e1" />
        <Controls style={{ boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', border: 'none', borderRadius: '8px', overflow: 'hidden' }} />
        <MiniMap 
          style={{ 
            height: 120, 
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
            border: '1px solid #e2e8f0',
            borderRadius: '12px'
          }}
          nodeColor={(node) => {
            switch (node.type) {
              case 'start': return '#10b981';
              case 'task': return '#3b82f6';
              case 'approval': return '#f59e0b';
              case 'automated': return '#8b5cf6';
              case 'end': return '#ef4444';
              default: return 'var(--border-dark)';
            }
          }}
        />
        <Panel position="top-left" style={{ margin: '16px' }}>
           <div style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', padding: '6px 12px', borderRadius: '20px', fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              Canvas Space
           </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export const WorkflowCanvas = () => (
  <ReactFlowProvider>
    <WorkflowCanvasComponent />
  </ReactFlowProvider>
);
