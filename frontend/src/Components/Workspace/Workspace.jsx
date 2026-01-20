import {
  ReactFlow, Background, BackgroundVariant, useNodesState, useEdgesState, Panel, ConnectionLineType, addEdge,
  useReactFlow, ReactFlowProvider
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import toast, { Toaster } from 'react-hot-toast';
import LeftSidebar from './LeftSidebar';
import { Link, Loader2, Trash2, FileDown } from 'lucide-react';
import FlyoutPanel from './FlyoutPanel';
import CustomControls from './Custom_Controls';
import { useCallback, useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TableRefNode from './Nodes/TableRefNode';
import DbNode from './Nodes/DbNode';
import ApiNode from './Nodes/ApiNode';
import { SchemaProvider } from './SchemaContext';
import { saveWorkflowData, getProjectData, deleteProjectAPI } from './WorkflowAPI';
import { useUndoRedo } from './useUndoRedo';
import FieldSelectionModal from './FieldSelectionModal';

const nodeTypes = {
  dbNode: DbNode,
  apiNode: ApiNode,
  tableRefNode: TableRefNode,
};

function WorkspaceContent() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { deleteElements } = useReactFlow();

  const [activePanel, setActivePanel] = useState(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isSaving, setIsSaving] = useState(false);

  const [isDraggingNode, setIsDraggingNode] = useState(false);
  const trashCanRef = useRef(null);

  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    params: null,
    schema: null,
    apiMethod: ''
  });

  const { undo, redo, takeSnapshot } = useUndoRedo({
    nodes, setNodes, edges, setEdges
  });

  useEffect(() => {
    const loadWorkflow = async () => {
      if (!projectId) return;

      try {
        const data = await getProjectData(projectId);

        if (data.success) {
          const { canvasState, name } = data.project;

          if (canvasState) {
            setNodes(canvasState.nodes || []);
            setEdges(canvasState.edges || []);
          }
        }
      } catch (error) {
        console.error("Load Error:", error);
        toast.error("Could not load project data.");
      }
    };

    loadWorkflow();
  }, [projectId, setNodes, setEdges]);

  const onDeleteProject = async () => {
    if (!window.confirm("Are you sure? This will delete the project and all workflows permanently.")) {
      return;
    }

    try {
      const res = await deleteProjectAPI(projectId);
      if (res.success) {
        toast.success("Project deleted.");
        navigate('/');
      }
    } catch (error) {
      toast.error("Failed to delete project.");
    }
  };

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
    toast.success("Linked Successfully", { icon: <Link size={16} />, style: { background: '#333', color: '#fff', border: '1px solid #22c55e' } });
    setModalConfig({ isOpen: false, params: null, schema: null, apiMethod: '' });
  };

  const onSave = useCallback(async () => {
    if (!projectId) {
      toast.error("Project ID missing. Cannot Save.");
      return;
    }
    setIsSaving(true);

    const tableNodes = nodes.filter(n => n.type === 'dbNode' || n.type === 'tableRefNode');
    const tableMap = new Map();

    tableNodes.forEach(node => {
      if (node.data?.tableName) {
        tableMap.set(node.data.tableName, {
          name: node.data.tableName,
          fields: (node.data.fields || []).map(field => ({
            ...field, constraint: field.constraint ? field.constraint : 'none'
          }))
        });
      }
    });

    const uniqueTables = Array.from(tableMap.values());

    const endpointsPayload = nodes
      .filter(n => n.type === 'apiNode')
      .map(apiNode => {
        const edge = edges.find(e => e.target === apiNode.id);
        let connectedTableName = null;
        let selectedFields = [];

        if (edge) {
          const sourceNode = nodes.find(n => n.id === edge.source);
          if (sourceNode) {
            connectedTableName = sourceNode.data.tableName;
          }
          selectedFields = edge.data?.selectedFields || [];
        }

        return {
          method: apiNode.data.method,
          route: apiNode.data.route,
          connectedTableName: connectedTableName,
          selectedFields: selectedFields
        };
      });

    const payload = {
      tables: uniqueTables,
      endpoints: endpointsPayload,
      canvasState: { nodes, edges }
    };

    try {
      await saveWorkflowData(projectId, payload);
      toast.success("Workflow Saved Successfully!", { style: { background: '#333', color: '#fff', border: '1px solid #22c55e' } });
    } catch (error) {
      toast.error("Failed to save flow.", { style: { background: '#333', color: '#fff', border: '1px solid #ef4444' } });
    } finally {
      setIsSaving(false);
    }
  }, [nodes, edges, projectId]);

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
      initialData = { ...initialData, id: data.schema.id, tableName: data.schema.tableName, fields: data.schema.fields };
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
    setIsDraggingNode(true);
  }, [takeSnapshot]);
  const onNodeDragStop = useCallback((event, node) => {
    setIsDraggingNode(false);

    if (trashCanRef.current) {
      const trashRect = trashCanRef.current.getBoundingClientRect();
      const mouseX = event.clientX;
      const mouseY = event.clientY;

      if (
        mouseX >= trashRect.left &&
        mouseX <= trashRect.right &&
        mouseY >= trashRect.top &&
        mouseY <= trashRect.bottom
      ) {
        deleteElements({ nodes: [{ id: node.id }] });
        toast.success("Node deleted", { icon: <Trash2 size={14} />, style: { background: '#333', color: '#fff' } });
      }
    }
  }, [deleteElements]);


  return (
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

      <div className="w-full h-full relative">
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
          onNodeDragStop={onNodeDragStop}
          connectionLineType={ConnectionLineType.SmoothStep}
          fitView
        >
          <Background variant={BackgroundVariant.Dots} gap={60} className='bg-[#1B1B1B]' />

          <Panel position="top-right">
            <div className="flex gap-3 m-4">
              <button
                onClick={onDeleteProject}
                className="flex items-center gap-2 px-4 py-2 border-2 border-red-900 text-gray-300 rounded-lg hover:bg-red-900 transition-colors shadow-md font-medium text-sm cursor-pointer"
              >
                <Trash2 size={16} />
                Delete Project
              </button>

              <button onClick={onSave} disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-md font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSaving && <Loader2 size={16} className="animate-spin" />}
                {isSaving ? 'Saving...' : 'Save Flow'}
              </button>

             
            </div>
          </Panel>
          <CustomControls onUndo={undo} onRedo={redo} />
        </ReactFlow>
        <div ref={trashCanRef} className={`absolute bottom-8 right-8 z-50 transition-all duration-300 ease-in-out transform ${isDraggingNode ? "translate-y-0 opacity-100 scale-110" : "translate-y-20 opacity-0 scale-90 pointer-events-none"
          }`}
        >
          <div className="w-16 h-16 bg-red-900/20 backdrop-blur-sm border-2 border-red-900 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.5)]">
            <Trash2 size={25} className="text-red-700" />
          </div>
        </div>

      </div>
    </div>
  );
}

function Workspace() {
  return (
    <ReactFlowProvider>
      <SchemaProvider>
        <WorkspaceContent />
      </SchemaProvider>
    </ReactFlowProvider>
  );
}

export default Workspace;