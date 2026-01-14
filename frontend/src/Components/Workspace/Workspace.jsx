import { ReactFlow, Background, BackgroundVariant, useNodesState, useEdgesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import LeftSidebar from './LeftSidebar';
import FlyoutPanel from './FlyoutPanel';
import CustomControls from './Custom_Controls';
import { useCallback, useState } from 'react';
import DbNode from './Nodes/DbNode';

const nodeTypes = {
  dbNode: DbNode,
};

function Workspace() {
  const [activePanel, setActivePanel] = useState(null);

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const data = JSON.parse(
        event.dataTransfer.getData('application/reactflow')
      );

      if (!data?.type) return;

      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      const newNode = {
        id: `${Date.now()}`,
        type: data.type,
        position,
        data: {},
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  return (
    <div className="h-screen w-screen flex bg-[#1B1B1B] overflow-hidden">
      <LeftSidebar activePanel={activePanel} setActivePanel={setActivePanel} />

      {activePanel && <FlyoutPanel activePanel={activePanel} />}

      <div className="flex-1 bg-[#1B1B1B] overflow-hidden">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          onDrop={onDrop}
          onDragOver={onDragOver}
          fitView
        >
          <Background variant={BackgroundVariant.Dots} gap={60} color="white" />
          <CustomControls />
        </ReactFlow>
      </div>
    </div>
  );
}

export default Workspace;
