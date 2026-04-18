# 🧑‍💼 HR Workflow Designer Module

This is a functional prototype of a mini-HR Workflow Designer module. It allows HR administrators to visually design, configure, and simulate internal workflows such as onboarding, leave approvals, and automated data processing. ✨

## 🏗️ Architecture & Design Choices

1. **📦 State Management**: 
   - **Zustand** is used for global state management (`workflowStore`). It allows us to decouple the React Flow canvas state (nodes, edges, selection) from specific components. This enables components like the `PropertiesPanel` or `Sidebar` to easily modify and read the canvas state without deeply nested context or prop drilling.
   
2. **🧩 Component Structure**:
   - 🎨 `components/canvas/`: Concerns solely with rendering the React Flow instance and handling drag-and-drop mechanics.
   - 🔵 `components/nodes/`: Custom node declarations (Start, Task, Approval, Automated, End) mapped to React Flow.
   - 📝 `components/forms/`: Decoupled form components for Node editing. Shows dynamic fields based on the selected node type.
   - 🖼️ `components/layout/`: App shell, Sidebar (for Node templates tool palette), and PropertiesPanel (for forms & simulation).
   
3. **🔄 Data Flow**:
   - 🖱️ The user selects a node from the `Sidebar` and drops it onto the `WorkflowCanvas`.
   - 🆔 The `WorkflowCanvas` generates a UUID and adds it to the Zustand store.
   - ⚡ When a node is selected, its ID is saved in the store. The `PropertiesPanel` pulls the configured `FormComponent` based on the active node's type.
   - 🚀 Changes in the form push directly back to the Zustand store, immediately reflecting in the node (e.g., node titles update live).

4. **🔌 Mock API**:
   - ⏳ Added a `mockApi.ts` simulation file imitating an external backend. It resolves automatically after a delay to simulate loading states.
   - 🤖 `fetchAutomations`: Returns mock actions to populate dropdowns in the Automated Step Node form.
   - 🏃 `simulateWorkflow`: A basic graph traversal algorithm that ensures there is a single start node, evaluates path connectivity without cycles, and constructs execution logs dynamically based on form data (like assignees and descriptions).

5. **✨ Aesthetics & UI Guidelines**:
   - 💅 Opted for a vanilla CSS + inline styling approach styled with a clean UI referencing the provided Coda/Auto case study structure.
   - 🎨 Node styling applies intuitive colored Lucide-react icons signifying the context of the operational stages (🟩 Green/Start, 🟥 Red/End, 🟦 Blue/Task, 🟪 Purple/Automated, 🟧 Orange/Approval).

## 🚀 How to Run

1. `npm install` 📦
2. `npm run dev` 💻
3. Open `http://localhost:5173` 🌐

## 🚧 Assumptions & Boundaries

- 💾 **Persistence**: As requested, back-end persistence and auth are excluded. Everything resets when the page reloads.
- 🛤️ **Simulation constraints**: For linear testing, the simulation engine simply grabs the first outgoing edge if there are multiple. Branching logic (And/Or gateways) is not yet baked into the traversal for this prototype scope.
