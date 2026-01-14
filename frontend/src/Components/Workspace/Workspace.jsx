import { ReactFlow, Background, Controls, BackgroundVariant } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import LeftSidebar from './LeftSidebar';
import FlyoutPanel from './FlyoutPanel';
import CustomControls from './Custom_Controls';
import { useState } from 'react';

function Workspace() {
  const [activePanel, setActivePanel] = useState(null);

  return (
    <div className="h-screen w-screen flex bg-[#1B1B1B] overflow-hidden">
      <LeftSidebar activePanel={activePanel} setActivePanel={setActivePanel} />

      {/* Flyout Panel */}
      {activePanel && <FlyoutPanel activePanel={activePanel} />}

      <div className="flex-1 bg-[#1B1B1B] overflow-hidden">
        <ReactFlow>
          <Background variant={BackgroundVariant.Dots} gap={60} color="white" />
          <CustomControls></CustomControls>
        </ReactFlow>
      </div>
    </div>
  );
}

export default Workspace;
