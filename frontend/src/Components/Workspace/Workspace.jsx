import {
  ReactFlow, Background, BackgroundVariant, useNodesState, useEdgesState, Panel, ConnectionLineType, addEdge
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import toast, { Toaster } from 'react-hot-toast';
import LeftSidebar from './LeftSidebar';
import { Link } from 'lucide-react';
import FlyoutPanel from './FlyoutPanel';
import CustomControls from './Custom_Controls';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TableRefNode from './Nodes/TableRefNode';
import DbNode from './Nodes/DbNode';
import ApiNode from './Nodes/ApiNode';
import { SchemaProvider } from './SchemaContext';
import { saveWorkflowData } from './WorkflowAPI';
import { useUndoRedo } from './useUndoRedo';
import FieldSelectionModal from './FieldSelectionModal';

const nodeTypes = {
  dbNode: DbNode,
  apiNode: ApiNode,
  tableRefNode: TableRefNode,
};

function Workspace() {
  const navigate = useNavigate();
  const [activePanel, setActivePanel] = useState(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    params: null,
    schema: null,
    apiMethod: ''
  });

  const { undo, redo, takeSnapshot } = useUndoRedo({
    nodes, setNodes, edges, setEdges
  });

  const getValidationError = useCallback((params) => {
    const sourceNode = nodes.find((n) => n.id === params.source);
    const targetNode = nodes.find((n) => n.id === params.target);
    if (!sourceNode || !targetNode) return "Invalid Connection!";
    if (params.source === params.target) return "Cannot connect a node to itself.";
    const isSourceApi = sourceNode.type === 'apiNode';
    const isTargetApi = targetNode.type === 'apiNode';
    const isSourceDb = sourceNode.type === 'dbNode' || sourceNode.type === 'tableRefNode';
    const isTargetDb = targetNode.type === 'dbNode' || targetNode.type === 'tableRefNode';
    if (isSourceApi && isTargetApi) return "Workflow Error: Cannot connect two API endpoints directly.";
    if (isSourceDb && isTargetDb) return "Workflow Error: Cannot connect two Tables directly.";
    const existingEdge = edges.find((e) =>
      e.source === params.source &&
      e.target === params.target
    );
    if (existingEdge) {
      return "Connection already exists.";
    }
    return null;
  }, [nodes, edges]);
  const onConnect = useCallback(
    (params) => {
      const error = getValidationError(params);
      if (error) {
        toast.error(error, {
          style: { background: '#333', color: '#fff', border: '1px solid #ef4444' }
        });
        return;
      }

      const sourceNode = nodes.find((n) => n.id === params.source);
      const targetNode = nodes.find((n) => n.id === params.target);

      setModalConfig({
        isOpen: true,
        params: params,
        schema: sourceNode.data,
        apiMethod: targetNode.data.method
      });
    },
    [nodes, edges, getValidationError],
  );
  const onModalSave = (selectedFields) => {
    if (selectedFields.length === 0) {
      toast.error("Please select at least one field.");
      return;
    }
    const { params } = modalConfig;
    takeSnapshot();

    const newEdge = {
      ...params,
      id: `e${params.source}-${params.target}`,
      animated: false,
      data: { selectedFields: selectedFields },
    };

    setEdges((eds) => addEdge(newEdge, eds));

    toast.success("Linked Successfully", {
      icon: <Link size={16} />,
      style: { background: '#333', color: '#fff', border: '1px solid #22c55e' }
    });

    setModalConfig({ isOpen: false, params: null, schema: null, apiMethod: '' });
  };

  const onSave = useCallback(() => {
    const nodeLookup = nodes.reduce((acc, node) => {
      acc[node.id] = node.data;
      return acc;
    }, {});

    const relationships = edges.map((edge) => {
      const sourceNodeData = nodeLookup[edge.source];
      const targetNodeData = nodeLookup[edge.target];
      if (!sourceNodeData || !targetNodeData) return null;
      const sourceLabel = sourceNodeData.tableName || "Unknown Table";
      const targetLabel = `${targetNodeData.method} ${targetNodeData.route || ''}`;
      return {
        summary: `${sourceLabel} -> ${targetLabel}`,
        source: sourceLabel,
        target: targetLabel,
        fields: edge.data?.selectedFields || []
      };
    }).filter(Boolean);
    const payload = {
      timestamp: new Date().toISOString(),
      tables: nodes.filter(n => n.type === 'dbNode').map(n => ({
        id: n.id,
        name: n.data.tableName,
        fields: n.data.fields
      })),
      endpoints: nodes.filter(n => n.type === 'apiNode').map(n => ({
        id: n.id,
        method: n.data.method,
        route: n.data.route
      })),
      relationships: relationships
    };
    saveWorkflowData(payload);
    toast.success("Workflow Saved Successfully!", {
      style: { background: '#333', color: '#fff', border: '1px solid #22c55e' }
    });
  }, [nodes, edges]);
  const onPreview = useCallback(() => navigate('/preview'), [navigate]);
  const onDragOver = useCallback((event) => { event.preventDefault(); event.dataTransfer.dropEffect = 'move'; }, []);
  const onDrop = useCallback((event) => {
    event.preventDefault();
    takeSnapshot();
    const reactFlowBounds = event.currentTarget.getBoundingClientRect();
    const dataString = event.dataTransfer.getData('application/reactflow');
    if (!dataString) return;
    const data = JSON.parse(dataString);
    if (!data?.type) return;
    const position = {
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top
    };
    let initialData = { takeSnapshot };
    if (data.type === 'dbNode') {
      initialData = { ...initialData, tableName: "", fields: [] };
    } else if (data.type === 'apiNode') {
      initialData = { ...initialData, method: data.method, route: "" };
    } else if (data.type === 'tableRefNode') {
      initialData = {
        ...initialData,
        id: data.schema.id,
        tableName: data.schema.tableName,
        fields: data.schema.fields
      };
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
    <SchemaProvider>
      <div className="h-screen w-screen bg-[#1B1B1B] relative overflow-hidden">
        <Toaster position="bottom-right" />
        {modalConfig.isOpen && (
          <FieldSelectionModal isOpen={modalConfig.isOpen} onClose={() => setModalConfig({ ...modalConfig, isOpen: false })} onSave={onModalSave} schema={modalConfig.schema}
            apiMethod={modalConfig.apiMethod}
          />
        )}

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
    </SchemaProvider>
  );
}

export default Workspace;


// #a855f7
// #E4E6EA