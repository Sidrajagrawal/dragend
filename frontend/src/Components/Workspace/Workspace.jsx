import { ReactFlow, Background, Controls, BackgroundVariant } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import LeftSidebar from './LeftSidebar';
import CustomControls from './Custom_Controls';

function Workspace() {
  return (
    <div className="h-screen w-screen flex bg-[#1B1B1B]">
      <LeftSidebar />
      <div className="flex-1 bg-[#1B1B1B]">
        <ReactFlow>
          <Background
            variant={BackgroundVariant.Dots}
            gap={60}
            color="white"
          />
          <CustomControls></CustomControls>
        </ReactFlow>
      </div>

    </div>
  );
}

export default Workspace;
