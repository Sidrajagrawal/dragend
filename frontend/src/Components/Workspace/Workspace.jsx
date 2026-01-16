import {
  ReactFlow,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  Panel,
  ConnectionLineType,
  addEdge
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import LeftSidebar from './LeftSidebar';
import FlyoutPanel from './FlyoutPanel';
import CustomControls from './Custom_Controls';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DbNode from './Nodes/DbNode';
import ApiNode from './Nodes/ApiNode'; // 1. Import ApiNode
import { saveWorkflowData } from './WorkflowAPI';
import { useUndoRedo } from './useUndoRedo';

const nodeTypes = {
  dbNode: DbNode,
  apiNode: ApiNode,
};

function Workspace() {
  const navigate = useNavigate();
  const [activePanel, setActivePanel] = useState(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { undo, redo, takeSnapshot } = useUndoRedo({
    nodes, setNodes, edges, setEdges
  });

  const onConnect = useCallback(
    (params) => {
      takeSnapshot();
      setEdges((eds) => addEdge(params, eds));
    },
    [setEdges, takeSnapshot],
  );
  const onSave = useCallback(() => {
    const nodeLookup = nodes.reduce((acc, node) => {
      acc[node.id] = node.data;
      return acc;
    }, {});

    const relationships = edges.map((edge) => {
      const sourceNodeData = nodeLookup[edge.source];
      const targetNodeData = nodeLookup[edge.target];
      const sourceLabel = sourceNodeData.tableName || `${sourceNodeData.method} ${sourceNodeData.route || ''}`;
      const targetLabel = targetNodeData.tableName || `${targetNodeData.method} ${targetNodeData.route || ''}`;
      const sourceHandle = edge.sourceHandle?.replace("-source", "") || "";
      const targetHandle = edge.targetHandle?.replace("-target", "") || "";

      return {
        summary: `${sourceLabel} -> ${targetLabel}`,
        source: sourceLabel,
        target: targetLabel,
        sourceHandle: sourceHandle,
        targetHandle: targetHandle
      };
    });

    const payload = {
      timestamp: new Date().toISOString(),
      tables: nodes
        .filter(n => n.type === 'dbNode')
        .map(n => ({
          id: n.id,
          name: n.data.tableName,
          fields: n.data.fields
        })),
      endpoints: nodes
        .filter(n => n.type === 'apiNode')
        .map(n => ({
          id: n.id,
          method: n.data.method,
          route: n.data.route
        })),

      relationships: relationships
    };
    saveWorkflowData(payload);
  }, [nodes, edges]);
  const onPreview = useCallback(() => navigate('/preview'), [navigate]);
  const onDragOver = useCallback((event) => { event.preventDefault(); event.dataTransfer.dropEffect = 'move'; }, []);
  const onDrop = useCallback((event) => {
    event.preventDefault();
    takeSnapshot();

    const reactFlowBounds = event.currentTarget.getBoundingClientRect();
    const data = JSON.parse(event.dataTransfer.getData('application/reactflow'));

    if (!data?.type) return;

    const position = {
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top
    };

    let initialData = { takeSnapshot };

    if (data.type === 'dbNode') {
      initialData = { ...initialData, tableName: "New Table", fields: [] };
    } else if (data.type === 'apiNode') {
      initialData = { ...initialData, method: data.method, route: "" };
    }

    const newNode = {
      id: `${Date.now()}`,
      type: data.type,
      position,
      data: initialData
    };

    setNodes((nds) => nds.concat(newNode));
  }, [setNodes, takeSnapshot]);

  const onNodeDragStart = useCallback(() => {
    takeSnapshot();
  }, [takeSnapshot]);

  return (
    <div className="h-screen w-screen bg-[#1B1B1B] relative overflow-hidden">
      <div className="absolute top-0 left-0 h-full z-50 flex items-center pointer-events-none">
        <div className="pointer-events-auto">
          <LeftSidebar activePanel={activePanel} setActivePanel={setActivePanel} />
        </div>
        <div className="pointer-events-auto ml-2">
          {activePanel && <FlyoutPanel activePanel={activePanel} />}
        </div>
      </div>
      <div className="w-full h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeDragStart={onNodeDragStart}
          connectionLineType={ConnectionLineType.SmoothStep}
          fitView
        >
          <Background variant={BackgroundVariant.Dots} gap={60} className='bg-[#1B1B1B]' />

          <Panel position="top-right">
            <div className="flex gap-3 m-4">
              <button onClick={onSave} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-md font-medium text-sm">
                Save Flow
              </button>
            </div>
          </Panel>

          <CustomControls onUndo={undo} onRedo={redo} />

        </ReactFlow>
      </div>
    </div>
  );
}

export default Workspace;