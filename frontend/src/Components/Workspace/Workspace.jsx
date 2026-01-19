import { ReactFlow, Background, Controls, BackgroundVariant } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useNavigate } from 'react-router-dom';
import CustomControls from './Custom_Controls';

function Workspace() {
  const navigate = useNavigate();

  return (
    <div style={{ height: '100vh', width: '100vw', position: 'relative' }}>
      <button onClick={() => navigate('/')} className="absolute top-4 left-4 z-50 bg-white px-4 py-2 rounded shadow cursor-pointer text-xl" style={{ pointerEvents: 'auto' }}>
        Dragend
      </button>
      <div style={{ height: '100%' }}>
        <ReactFlow>
          <Background variant={BackgroundVariant.Lines} gap={80} color="grey" />
          <CustomControls />
        </ReactFlow>
      </div>

    </div>
  );
}

export default Workspace;
