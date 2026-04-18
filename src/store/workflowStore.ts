import { create } from 'zustand';
import {
  type Connection,
  type Edge,
  type EdgeChange,
  type Node,
  type NodeChange,
  addEdge,
  type OnNodesChange,
  type OnEdgesChange,
  type OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';

export interface SavedWorkflow {
  id: string;
  name: string;
  nodes: Node[];
  edges: Edge[];
  updatedAt: number;
}

export interface WorkflowState {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  nodes: Node[];
  edges: Edge[];
  selectedNodeId: string | null;
  history: { nodes: Node[]; edges: Edge[] }[];
  historyIndex: number;
  
  workflows: SavedWorkflow[];
  currentWorkflowId: string;
  currentWorkflowName: string;
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (node: Node) => void;
  updateNodeData: (id: string, data: any) => void;
  deleteNode: (id: string) => void;
  setSelectedNodeId: (id: string | null) => void;
  saveHistory: () => void;
  undo: () => void;
  redo: () => void;
  
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => void;
  clearWorkspace: () => void;
  
  loadWorkflow: (id: string) => void;
  createNewWorkflow: (name: string) => void;
  renameWorkflow: (newName: string) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  activeTab: 'Workflows',
  setActiveTab: (tab: string) => set({ activeTab: tab }),
  nodes: [],
  edges: [],
  selectedNodeId: null,
  history: [{ nodes: [], edges: [] }],
  historyIndex: 0,
  
  workflows: [],
  currentWorkflowId: 'default',
  currentWorkflowName: 'My HR Workflow',
  theme: 'light',
  setTheme: (theme) => {
    set({ theme });
    localStorage.setItem('autohr_theme', theme);
  },

  saveHistory: () => {
    const { nodes, edges, history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    // Explicitly parse and stringify to safely drop proxy/internal xyflow keys that may choke structuredClone
    const clonedNodes = JSON.parse(JSON.stringify(nodes));
    const clonedEdges = JSON.parse(JSON.stringify(edges));
    newHistory.push({ nodes: clonedNodes, edges: clonedEdges });
    set({ history: newHistory, historyIndex: newHistory.length - 1 });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      const state = history[prevIndex];
      set({ 
        nodes: JSON.parse(JSON.stringify(state.nodes)), 
        edges: JSON.parse(JSON.stringify(state.edges)), 
        historyIndex: prevIndex, 
        selectedNodeId: null 
      });
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      const state = history[nextIndex];
      set({ 
        nodes: JSON.parse(JSON.stringify(state.nodes)), 
        edges: JSON.parse(JSON.stringify(state.edges)), 
        historyIndex: nextIndex, 
        selectedNodeId: null 
      });
    }
  },

  saveToLocalStorage: () => {
    const { nodes, edges, currentWorkflowId, currentWorkflowName, workflows } = get();
    const updatedWorkflows = [...workflows];
    const index = updatedWorkflows.findIndex(w => w.id === currentWorkflowId);
    
    if (index >= 0) {
      updatedWorkflows[index] = { 
        ...updatedWorkflows[index], 
        name: currentWorkflowName,
        nodes, 
        edges, 
        updatedAt: Date.now() 
      };
    } else {
      updatedWorkflows.push({
        id: currentWorkflowId,
        name: currentWorkflowName,
        nodes,
        edges,
        updatedAt: Date.now()
      });
    }
    
    localStorage.setItem('autohr_workflows_v2', JSON.stringify(updatedWorkflows));
    set({ workflows: updatedWorkflows });
  },

  loadFromLocalStorage: () => {
    const themeSaved = localStorage.getItem('autohr_theme');
    if (themeSaved) set({ theme: themeSaved as any });

    const saved = localStorage.getItem('autohr_workflows_v2');
    if (saved) {
      try {
        const parsedWorkflows = JSON.parse(saved) as SavedWorkflow[];
        if (parsedWorkflows.length > 0) {
          // Sort by newest
          parsedWorkflows.sort((a, b) => b.updatedAt - a.updatedAt);
          const active = parsedWorkflows[0];
          set({ 
            workflows: parsedWorkflows,
            currentWorkflowId: active.id,
            currentWorkflowName: active.name,
            nodes: active.nodes || [], 
            edges: active.edges || [],
            history: [{ nodes: active.nodes || [], edges: active.edges || [] }],
            historyIndex: 0
          });
          return;
        }
      } catch (e) {
        console.error('Failed to parse workflows', e);
      }
    }
  },

  loadWorkflow: (id: string) => {
    const { workflows } = get();
    const target = workflows.find(w => w.id === id);
    if (target) {
      set({
        currentWorkflowId: target.id,
        currentWorkflowName: target.name,
        nodes: target.nodes || [],
        edges: target.edges || [],
        selectedNodeId: null,
        history: [{ nodes: target.nodes || [], edges: target.edges || [] }],
        historyIndex: 0
      });
    }
  },

  createNewWorkflow: (name: string) => {
    const newId = generateId();
    set({
      currentWorkflowId: newId,
      currentWorkflowName: name,
      nodes: [],
      edges: [],
      selectedNodeId: null,
      history: [{ nodes: [], edges: [] }],
      historyIndex: 0
    });
    get().saveToLocalStorage();
  },
  
  renameWorkflow: (newName: string) => {
    set({ currentWorkflowName: newName });
    get().saveToLocalStorage();
  },

  clearWorkspace: () => {
    set({ nodes: [], edges: [], selectedNodeId: null });
    get().saveHistory();
  },

  onNodesChange: (changes: NodeChange[]) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) });
    const activeDrag = changes.some(c => c.type === 'position' && c.dragging);
    const activeSelection = changes.some(c => c.type === 'select');
    if (!activeDrag && !activeSelection && changes.length > 0) {
      get().saveHistory();
    }
  },

  onEdgesChange: (changes: EdgeChange[]) => {
    const activeSelection = changes.some(c => c.type === 'select');
    set({ edges: applyEdgeChanges(changes, get().edges) });
    if (!activeSelection && changes.length > 0) get().saveHistory();
  },

  onConnect: (connection: Connection) => {
    let edgeStyle = { strokeWidth: 2, stroke: 'var(--text-secondary)' };
    if (connection.sourceHandle === 'approved') edgeStyle = { strokeWidth: 2, stroke: '#10b981' };
    if (connection.sourceHandle === 'rejected') edgeStyle = { strokeWidth: 2, stroke: '#ef4444' };
    
    // Auto-create edge with appropriate styling overlay
    const newEdge = { ...connection, style: edgeStyle };
    set({ edges: addEdge(newEdge, get().edges) });
    get().saveHistory();
  },

  addNode: (node: Node) => {
    set({ nodes: [...get().nodes, node] });
    get().saveHistory();
  },

  updateNodeData: (id: string, data: any) => {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, ...data } };
        }
        return node;
      }),
    });
    get().saveHistory();
  },

  deleteNode: (id: string) => {
    const { nodes, edges } = get();
    // Validate if node actually exists before triggering deep changes
    if (!nodes.find(n => n.id === id)) return;
    set({
      nodes: nodes.filter((node) => node.id !== id),
      edges: edges.filter((edge) => edge.source !== id && edge.target !== id),
      selectedNodeId: get().selectedNodeId === id ? null : get().selectedNodeId,
    });
    get().saveHistory();
  },

  setSelectedNodeId: (id: string | null) => {
    set({ selectedNodeId: id });
  },
}));
