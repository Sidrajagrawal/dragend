import { useReactFlow } from '@xyflow/react';

function CustomControls() {
    const { zoomIn, zoomOut, fitView } = useReactFlow();

    return (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 flex gap-3 bg-white p-3 rounded-xl shadow-lg">
            <button onClick={zoomIn} className="w-6 h-6 text-2xl font-bold rounded-lg hover:bg-gray-100" >
                +
            </button>
            <button onClick={zoomOut} className="w-6 h-6 text-2xl font-bold rounded-lg hover:bg-gray-100">
                −
            </button>
        </div>
    );
}

export default CustomControls;
